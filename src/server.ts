import mongoose from "mongoose";
import http from "http";
import dotenvconfig from "./config/dotenvconfig";
import { connectDatabase } from "./db";
import app from "./app";

let uri: string = dotenvconfig.MONGO_URI;

uri = uri.replace("username", dotenvconfig.DB_USERNAME);
uri = uri.replace("password", dotenvconfig.DB_PASSWORD);
uri = uri.replace("database", dotenvconfig.DATABASE);

const port: number = dotenvconfig.PORT;

const server: http.Server = http.createServer(app);

connectDatabase(uri)
  .then(() => {
    console.log("Database connected!");
    server.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  })
  .catch((e: mongoose.MongooseError) => {
    console.log("Connection error: ", e.message);
  });
