import swaggerJSDoc from "swagger-jsdoc";
import { tags } from "./tags";
import { components } from "../components";
import paths from "../paths";

const info: swaggerJSDoc.Information = {
  title: "Plant ecommerce API",
  version: "1.0.0",
  description: "This is an ecommerce API for plant selling shop",
};

const servers: swaggerJSDoc.Server[] = [
  { url: "http://localhost:5000/api/v1", description: "Development" },
];

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info,
    servers,
    components,
    tags,
    paths,
  },
  apis: ["../../src/routes/*.ts"],
};

export const swaggerspec: object = swaggerJSDoc(options);
