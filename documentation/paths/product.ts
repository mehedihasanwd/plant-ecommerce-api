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

const product_id_param = {
  ...id_param,
  name: "productId",
};

const product_slug_param = {
  ...id_param,
  name: "slug",
  description: "product slug",
  schema: {
    ...prop_type.str_type,
    example: "black-shirt",
  },
};

export const get_post_product = {
  post: {
    [props.description]: "Post new product",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.mulitpart_formdata]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              name: {
                ...prop_type.str_type,
                example: "Black shirt",
              },

              image: request.image,

              description: {
                ...prop_type.str_type,
                example: "This is a cool black shirt",
              },

              original_price: request.original_price,

              in_stock: request.in_stock,

              sizes: request.sizes,

              category: request.category,

              discount: request.discount,

              status: request.status,
            },
            [props.required]: [
              "name",
              "image",
              "description",
              "original_price",
              "in_stock",
              "sizes",
              "category",
            ],
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

                    original_price: response.error.original_price,

                    in_stock: response.error.in_stock,

                    sizes: response.error.sizes,

                    category: response.error.category,

                    status: response.error.status,
                  },
                  [props.required]: [
                    "name",
                    "description",
                    "original_price",
                    "in_stock",
                    "sizes",
                    "category",
                    "status",
                  ],
                },

                error: {
                  ...response.error.image,
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

      "409": use_response.sendAlreadyExists({
        key: "Product",
        suffix: "product name should be unique",
      }),

      "415": use_response.sendUnsupportedImageFormat(),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

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

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products",
                    },

                    products: {
                      ...prop_type.str_type,
                      example: "/dashboard/products",
                    },
                  },
                  [props.required]: ["self", "products"],
                },
              },
              [props.required]: ["code", "message", "product", "links"],
            },
          },
        },
      },
    },
  },

  get: {
    [props.description]: "Get all products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc", "active", "inactive", "in_stock", "stockout"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example:
                        "Sort type should be either: asc/dsc, active/inactive or in_stock/stockout",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_active_products = {
  get: {
    [props.description]: "Get active products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of active products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/active?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/active?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/active?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_inactive_products = {
  get: {
    [props.description]: "Get inactive products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of inactive products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/inactive?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/inactive?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/inactive?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_dicount_products = {
  get: {
    [props.description]: "Get discount products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of products with discount",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/discount?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/discount?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/discount?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_instock_products = {
  get: {
    [props.description]: "Get in stock products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of in stock products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/instock?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/instock?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/instock?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_stockout_products = {
  get: {
    [props.description]: "Get stockout products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of stockout products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/stockout?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/stockout?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/stockout?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_regular_products = {
  get: {
    [props.description]: "Get regular products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of regular products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/top-category/regular?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/top-category/regular?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/top-category/regular?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_featured_products = {
  get: {
    [props.description]: "Get featured products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of featured products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/top-category/featured?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/products/top-category/featured?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/products/top-category/featured?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_highestrated_products = {
  get: {
    [props.description]: "Get highest rated products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of highest rated products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/highestrated?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/highestrated?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/highestrated?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const get_bestselling_products = {
  get: {
    [props.description]: "Get best selling products",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of products",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
        [props.schema]: {
          ...prop_type.str_type,
          enum: ["asc", "dsc"],
        },
      },

      {
        ...query_params.search_by,
        description: "search by: name/category/top_category",
      },
    ],
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
                    page: {
                      ...prop_type.str_type,
                      example: "Page is required!",
                    },

                    limit: {
                      ...prop_type.str_type,
                      example: "Limit is required!",
                    },

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: {
                      ...prop_type.str_type,
                      example: "Search by name, category or top_category",
                    },
                  },

                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Products" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "List of best selling products",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                products: {
                  ...prop_type.array_type,
                  items: schema_ref.product,
                },

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: {
                      ...prop_type.integer_type,
                      example: 2,
                    },

                    prev_page: {
                      ...prop_type.integer_type,
                      example: 1,
                    },

                    next_page: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    limit: {
                      ...prop_type.integer_type,
                      example: 5,
                    },

                    total_pages: {
                      ...prop_type.integer_type,
                      example: 3,
                    },

                    total_products: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_products",
                    "total_pages",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/bestseller?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/bestseller?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example:
                        "/products/top-category/bestseller?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "products",
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

export const patch_product_discount_by_id = {
  patch: {
    [props.description]: "Update product discount by id",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              discount: {
                ...request.discount,
                example: 5,
              },
            },
            [props.required]: ["discount"],
          },
        },
      },
    },
    [props.responses]: {
      "400": {
        [props.description]: "Discount is required!",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                error: {
                  ...prop_type.str_type,
                  example: "Discount is required!",
                },
              },
              [props.required]: ["error"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Product" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Discount updated successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                message: {
                  ...prop_type.str_type,
                  example: "Discount updated successfully",
                },

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/discount/p/3",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/discount/p/3",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "message", "product", "links"],
            },
          },
        },
      },
    },
  },
};

export const patch_product_stock_by_id = {
  patch: {
    [props.description]: "Update product stock by id",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              in_stock: {
                ...request.in_stock,
                example: 50,
              },
            },
            [props.required]: ["in_stock"],
          },
        },
      },
    },
    [props.responses]: {
      "400": {
        [props.description]: "Stock is required!",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                error: {
                  ...prop_type.str_type,
                  example: "Stock is required!",
                },
              },
              [props.required]: ["error"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Product" }),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Stock updated successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                message: {
                  ...prop_type.str_type,
                  example: "Stock updated successfully",
                },

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/stock/p/3",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/stock/p/3",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "message", "product", "links"],
            },
          },
        },
      },
    },
  },
};

export const get_product_by_slug = {
  get: {
    [props.description]: "Get product by slug",
    [props.tags]: [tags.product],
    [props.parameters]: [product_slug_param],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "product" }),

      "404": use_response.sendNotFound({ key: "Product" }),

      "200": {
        [props.description]: "Product data",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/p/s/black-shirt",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/p/s/black-shirt",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "product", "links"],
            },
          },
        },
      },
    },
  },
};

export const product_by_id = {
  get: {
    [props.description]: "Get product by id",
    [props.tags]: [tags.product],
    [props.parameters]: [product_id_param],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "product" }),

      "404": use_response.sendNotFound({ key: "Product" }),

      "200": {
        [props.description]: "Product data",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/p/3",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/p/3",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "product", "links"],
            },
          },
        },
      },
    },
  },

  patch: {
    [props.description]: "Update product status by id",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [product_id_param],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              status: request.status,
            },
            [props.required]: ["status"],
          },
        },
      },
    },
    [props.responses]: {
      "400": use_response.sendStatusRequired(),

      "401": use_response.sendInvalidId({ key: "product" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Product" }),

      "409": use_response.sendStatusInUse(),

      "429": use_response.sendTooManyRequest(),

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

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/p/3",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/p/3",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "message", "product", "links"],
            },
          },
        },
      },
    },
  },

  put: {
    [props.description]: "Update product by id",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [product_id_param],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.mulitpart_formdata]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              image: request.image,

              name: {
                ...prop_type.str_type,
                example: "White shirt",
              },

              description: {
                ...prop_type.str_type,
                example: "This is a cool white shirt",
              },

              original_price: {
                ...prop_type.integer_type,
              },

              discount: request.discount,

              sizes: request.sizes,

              category: request.category,
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

                    original_price: {
                      ...response.error.original_price,
                      example: "Original price should be a number!",
                    },
                    sizes: {
                      ...prop_type.str_type,
                      example: "Sizes should be array of 'S','M', 'L' or 'XL'",
                    },
                    category: {
                      ...response.error.category,
                      example:
                        "Category should be either: 'flower', 'fruit', 'indoor' or 'herb'",
                    },
                  },
                  [props.required]: ["name", "description"],
                },

                error: {
                  ...prop_type.str_type,
                  example: "Multiple image uploads not allowed!",
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "product" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Product" }),

      "415": use_response.sendUnsupportedImageFormat(),

      "429": use_response.sendTooManyRequest(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Updated successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: response.success.code,

                message: {
                  ...prop_type.str_type,
                  example: "Updated successfully",
                },

                product: schema_ref.product,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/products/p/3",
                    },

                    product: {
                      ...prop_type.str_type,
                      example: "/dashboard/products/p/3",
                    },
                  },
                  [props.required]: ["self", "product"],
                },
              },
              [props.required]: ["code", "message", "product", "links"],
            },
          },
        },
      },
    },
  },

  delete: {
    [props.description]: "Delete product by id",
    [props.tags]: [tags.product],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [product_id_param],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "product" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Product" }),

      "429": use_response.sendTooManyRequest(),

      "200": use_response.sendDeleteSuccessfully(),
    },
  },
};
