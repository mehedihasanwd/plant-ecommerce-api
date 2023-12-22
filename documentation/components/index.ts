import swaggerJSDoc from "swagger-jsdoc";
import { schemas } from "./schemas";

export const components: swaggerJSDoc.Components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },

    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "access_token",
    },
  },

  schemas,
};
