import swaggerJSDoc from "swagger-jsdoc";
import { prop_type } from "./prop_type";

export const headers: swaggerJSDoc.Header = {
  "Set-Cookie": {
    schema: {
      ...prop_type.str_type,
      example:
        "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c; Path=/; HttpOnly",
    },
  },
};
