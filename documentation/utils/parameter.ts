import { prop_type } from "./prop_type";

export const id_param = {
  name: "_id",
  in: "path",
  description: "ObjectId",
  required: true,
  schema: {
    ...prop_type.object_id,
    example: "507f191e810c19729de860ea",
  },
};

export const query_params = {
  page: {
    name: "page",
    in: "query",
    description: "Current page number",
    schema: {
      ...prop_type.integer_type,
      example: 1,
    },
  },

  limit: {
    name: "limit",
    in: "query",
    description: "Number of items",
    schema: {
      ...prop_type.integer_type,
      example: 8,
    },
  },

  sort_type: {
    name: "sort_type",
    in: "query",
    schema: {
      ...prop_type.str_type,
      enum: ["asc", "dsc"],
    },
  },

  search_by: {
    name: "search_by",
    in: "query",
    description: "search_by: name/email/phone",
    schema: {
      ...prop_type.str_type,
    },
  },
};
