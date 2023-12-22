import {
  id_param,
  use_request,
  use_response,
  request,
  response,
  props,
  prop_type,
  security,
  tags,
  query_params,
  schema_ref,
} from "../utils";

const category_id_param = {
  ...id_param,
  name: "categoryId",
};

export const get_post_category = {
  get: {
    [props.description]: "Get categories",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      { ...query_params.page, [props.required]: true },

      {
        ...query_params.limit,
        [props.required]: true,
        [props.description]: "Number of categories",
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc", "active", "inactive"],
        },
      },

      {
        name: "search_by",
        in: "query",
        [props.description]: "search_by: name",
        [props.schema]: {
          ...prop_type.str_type,
        },
      },
    ],
    [props.responses]: {
      "400": use_response.sendInvalidQueryInfo({
        sort_value: "asc, dsc, active, inactive",
      }),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Categories" }),

      "429": use_response.sendTooManyRequest(),

      "200": {
        [props.description]: "Get categoreis",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                categories: {
                  items: schema_ref.category,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_categories: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },

                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_categories",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/categories?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/categories?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "categories",
                "pagination",
                "links",
              ],
            },
          },
        },
      },
    },
  },

  post: {
    [props.description]: "Post new category",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.mulitpart_formdata]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              image: request.image,

              name: request.category,

              description: {
                ...prop_type.object_type,
                example: "This is fruit category",
              },
            },
            [props.required]: ["name", "description", "image"],
          },
        },
      },
    },
    [props.responses]: {
      "400": {
        [props.description]: "Invalid credentials",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                errors: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    name: response.error.name,
                    description: response.error.description,
                  },
                  [props.required]: ["name", "description"],
                },

                error: {
                  ...prop_type.str_type,
                  example: "Image is required!",
                },
              },
              [props.required]: ["errors", "error"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Categories" }),

      "409": use_response.sendAlreadyExists({
        key: "Category",
        suffix: "please try again using an unique name",
      }),

      "415": use_response.sendUnsupportedImageFormat(),

      "429": use_response.sendTooManyRequest(),

      "201": {
        [props.description]: "Created successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...response.success.code,
                  example: 201,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Created successfully",
                },

                category: schema_ref.category,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories",
                    },

                    categories: {
                      ...prop_type.str_type,
                      example: "/dashboard/categories",
                    },
                  },
                  [props.required]: ["self", "categories"],
                },
              },
              [props.required]: ["code", "message", "category", "links"],
            },
          },
        },
      },
    },
  },
};

export const get_active_categories = {
  get: {
    [props.description]: "Get active categories",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      { ...query_params.page, [props.required]: true },

      {
        ...query_params.limit,
        [props.required]: true,
        [props.description]: "Number of categories",
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        name: "search_by",
        in: "query",
        [props.description]: "search_by: name",
        [props.schema]: {
          ...prop_type.str_type,
        },
      },
    ],
    [props.responses]: {
      "400": use_response.sendInvalidQueryInfo({
        sort_value: "asc, dsc, active, inactive",
      }),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Categories" }),

      "429": use_response.sendTooManyRequest(),

      "200": {
        [props.description]: "Get active categoreis",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                categories: {
                  items: schema_ref.category,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_categories: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },

                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_categories",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories/active?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/categories/active?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/categories/active?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "categories",
                "pagination",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const get_inactive_categories = {
  get: {
    [props.description]: "Get active categories",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      { ...query_params.page, [props.required]: true },

      {
        ...query_params.limit,
        [props.required]: true,
        [props.description]: "Number of categories",
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        name: "search_by",
        in: "query",
        [props.description]: "search_by: name",
        [props.schema]: {
          ...prop_type.str_type,
        },
      },
    ],
    [props.responses]: {
      "400": use_response.sendInvalidQueryInfo({
        sort_value: "asc, dsc, active, inactive",
      }),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Categories" }),

      "429": use_response.sendTooManyRequest(),

      "200": {
        [props.description]: "Get inactive categoreis",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                categories: {
                  items: schema_ref.category,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_categories: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },

                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_categories",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories/inactive?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/categories/inactive?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/categories/inactive?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "categories",
                "pagination",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const category_by_id = {
  get: {
    [props.description]: "Get category by id",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [category_id_param],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "category" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Category" }),

      "200": {
        [props.description]: "Category data",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                category: schema_ref.category,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories/ca/3",
                    },

                    category: {
                      ...prop_type.str_type,
                      example: "/dashboard/categories/ca/3",
                    },
                  },
                  [props.required]: ["self", "category"],
                },
              },
              [props.required]: ["from_cache", "code", "category", "links"],
            },
          },
        },
      },
    },
  },

  patch: {
    [props.description]: "Update category status by id",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [category_id_param],
    [props.requestBody]: use_request.bodyStatus(),
    [props.responses]: {
      "400": use_response.sendStatusRequired(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Category" }),

      "409": use_response.sendStatusInUse(),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Status updated successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                message: {
                  ...prop_type.str_type,
                  example: "Status updated successfully",
                },

                category: schema_ref.category,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories/ca/3",
                    },

                    category: {
                      ...prop_type.str_type,
                      example: "/dashboard/categories/ca/3",
                    },
                  },
                  [props.required]: ["self", "category"],
                },
              },
              [props.required]: ["code", "message", "category", "links"],
            },
          },
        },
      },
    },
  },

  put: {
    [props.description]: "Update category by id",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [category_id_param],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.mulitpart_formdata]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              name: request.category,

              description: {
                ...prop_type.str_type,
                example: "This is fruit category",
              },

              image: request.image,
            },
            [props.required]: ["name", "description"],
          },
        },
      },
    },
    [props.responses]: {
      "400": {
        [props.description]: "Invalid credentials!",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                errors: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    name: response.error.name,
                    description: response.error.description,
                  },
                  [props.required]: ["name", "description"],
                },

                error: response.error.image,
              },
              [props.required]: ["errors", "error"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "category" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "415": use_response.sendUnsupportedImageFormat(),

      "429": use_response.sendTooManyRequest(),

      "200": {
        [props.description]: "Information updated successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                message: {
                  ...prop_type.str_type,
                  example: "Information updated successfully",
                },

                category: schema_ref.category,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/categories/ca/3",
                    },

                    category: {
                      ...prop_type.str_type,
                      example: "/dashboard/categories/ca/3",
                    },
                  },
                  [props.required]: ["self", "category"],
                },
              },
              [props.required]: ["code", "message", "category", "links"],
            },
          },
        },
      },
    },
  },

  delete: {
    [props.description]: "Delete category by id",
    [props.tags]: [tags.category],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [category_id_param],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "staff" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "429": use_response.sendTooManyRequest(),

      "200": use_response.sendDeleteSuccessfully(),
    },
  },
};
