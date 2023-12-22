import {
  id_param,
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

const order_id_param = {
  ...id_param,
  name: "orderId",
};

const review_id_param = {
  ...id_param,
  name: "reviewId",
};

const user_id_param = {
  ...id_param,
  name: "userId",
};

const product_id_param = {
  ...id_param,
  name: "productId",
};

export const get_post_review = {
  get: {
    [props.description]: "Get reviews by id",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        ...query_params.limit,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
        [props.description]: "Search by user name",
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
                    page: response.error.page,

                    limit: response.error.limit,

                    sort_type: {
                      ...prop_type.str_type,
                      example: "Sort type should be either: asc or dsc",
                    },

                    search_by: response.error.search_by,
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

      "404": use_response.sendNotFound({ key: "Reviews" }),

      "200": {
        [props.description]: "List of reviews",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: response.success.current_page,

                    prev_page: response.success.prev_page,

                    next_page: response.success.next_page,

                    limit: response.success.limit,

                    total_pages: response.success.total_pages,

                    total_reviews: response.success.total_items,
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_reviews",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/reviews?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/reviews?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/reviews?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "review",
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
    [props.description]: "Post new review",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,

            [props.properties]: {
              user_name: request.name,

              user_id: request.documentId,

              user_image: {
                ...prop_type.object_type,
                [props.properties]: {
                  key: {
                    ...prop_type.str_type,
                    example: "profile.png",
                  },

                  url: {
                    ...prop_type.str_type,
                    example: "https://cloud.com/profile.png",
                  },
                },
                [props.required]: ["key", "url"],
              },

              product_id: request.documentId,

              product_uid: request.documentId,

              order_id: request.documentId,

              review: {
                ...prop_type.str_type,
                example: "This is a wonderful shirt",
              },

              rating: {
                ...prop_type.integer_type,
                example: 4.5,
              },
            },

            [props.required]: [
              "user_name",
              "user_id",
              "user_image",
              "product_id",
              "product_uid",
              "order_id",
              "review",
              "rating",
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
                    user_name: response.error.name,

                    user_id: {
                      ...prop_type.str_type,
                      example: "User id is required!",
                    },

                    user_image: {
                      ...prop_type.str_type,
                      example: "User image is required!",
                    },

                    product_id: {
                      ...prop_type.str_type,
                      example: "Product id is required!",
                    },

                    product_uid: {
                      ...prop_type.str_type,
                      example: "Product uid is required!",
                    },

                    order_id: {
                      ...prop_type.str_type,
                      example: "Order id is required!",
                    },

                    review: {
                      ...prop_type.str_type,
                      example: "Review is required!",
                    },

                    rating: {
                      ...prop_type.str_type,
                      example: "Rating is required!",
                    },
                  },

                  [props.required]: [
                    "user_name",
                    "user_id",
                    "user_image",
                    "product_id",
                    "product_uid",
                    "order_id",
                    "review",
                    "rating",
                  ],
                },
              },

              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "409": {
        [props.description]: "Already reviewed!",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                error: {
                  ...prop_type.str_type,
                  example: "Already reviewed!",
                },
              },
              [props.required]: ["error"],
            },
          },
        },
      },

      "500": use_response.sendServerError(),
    },
  },
};

export const get_reviews_by_userId = {
  get: {
    [props.description]: "Get reviews by user id",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      user_id_param,
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
        [props.description]: "Search by user name",
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
                    page: response.error.page,

                    limit: response.error.limit,

                    sort_type: response.error.sort_type,

                    search_by: response.error.search_by,
                  },
                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "user" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Reviews" }),

      "200": {
        [props.description]: "List of reviews",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: response.success.current_page,

                    prev_page: response.success.prev_page,

                    next_page: response.success.next_page,

                    limit: response.success.limit,

                    total_pages: response.success.total_pages,

                    total_reviews: response.success.total_items,
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_reviews",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/u/507f191e810c19729de860ea?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/u/507f191e810c19729de860ea?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/u/507f191e810c19729de860ea?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "review",
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

export const get_reviews_by_orderId = {
  get: {
    [props.description]: "Get reviews by order id",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      order_id_param,
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
        [props.description]: "Search by user name",
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
                    page: response.error.page,

                    limit: response.error.limit,

                    sort_type: response.error.sort_type,

                    search_by: response.error.search_by,
                  },
                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "order" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Reviews" }),

      "200": {
        [props.description]: "List of reviews",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: response.success.current_page,

                    prev_page: response.success.prev_page,

                    next_page: response.success.next_page,

                    limit: response.success.limit,

                    total_pages: response.success.total_pages,

                    total_reviews: response.success.total_items,
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_reviews",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/o/507f191e810c19729de860ea?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/o/507f191e810c19729de860ea?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/o/507f191e810c19729de860ea?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "review",
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

export const get_reviews_by_productId = {
  get: {
    [props.description]: "Get reviews by product id",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      product_id_param,
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
        [props.description]: "Search by user name",
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
                    page: response.error.page,

                    limit: response.error.limit,

                    sort_type: response.error.sort_type,

                    search_by: response.error.search_by,
                  },
                  [props.required]: ["page", "limit"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "product" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Reviews" }),

      "200": {
        [props.description]: "List of reviews",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: response.success.current_page,

                    prev_page: response.success.prev_page,

                    next_page: response.success.next_page,

                    limit: response.success.limit,

                    total_pages: response.success.total_pages,

                    total_reviews: response.success.total_items,
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_reviews",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/p/507f191e810c19729de860ea?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/p/507f191e810c19729de860ea?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example:
                        "/reviews/p/507f191e810c19729de860ea?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "review",
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

export const get_reviews_by_rating = {
  get: {
    [props.description]: "Get reviews by rating",
    [props.tags]: [tags.review],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        [props.description]: "Number of reviews",
        [props.required]: true,
      },

      {
        name: "rating",
        in: "query",
        description: "Rating from 1 to 5",
        schema: {
          ...prop_type.integer_type,
          example: 4.5,
        },
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
        [props.description]: "Search by user name",
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
                    page: response.error.page,

                    limit: response.error.limit,

                    rating: {
                      ...prop_type.str_type,
                      example: "Rating is required!",
                    },

                    sort_type: response.error.sort_type,

                    search_by: response.error.search_by,
                  },
                  [props.required]: ["page", "limit", "rating"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Reviews" }),

      "200": {
        [props.description]: "List of reviews",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                pagination: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    current_page: response.success.current_page,

                    prev_page: response.success.prev_page,

                    next_page: response.success.next_page,

                    limit: response.success.limit,

                    total_pages: response.success.total_pages,

                    total_reviews: response.success.total_items,
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_reviews",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/reviews/rating?rating=4&page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/reviews/rating?rating=4&page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/reviews/rating?rating=4&page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "review",
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

export const review_by_id = {
  get: {
    [props.description]: "Get review by id",
    [props.tags]: [tags.review],
    [props.parameters]: [review_id_param],
    [props.security]: [security.bearerAuth],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "review" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Review" }),

      "200": {
        [props.description]: "Review data",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: response.success.code,

                review: schema_ref.review,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/reviews/r/3",
                    },

                    review: {
                      ...prop_type.str_type,
                      example: "/reviews/r/3",
                    },
                  },
                  [props.required]: ["self", "review"],
                },
              },
              [props.required]: ["from_cache", "code", "review", "links"],
            },
          },
        },
      },
    },
  },

  patch: {
    [props.description]: "Put review by id",
    [props.tags]: [tags.review],
    [props.parameters]: [review_id_param],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              order_id: request.documentId,

              user_id: request.documentId,

              product_id: request.documentId,

              product_uid: request.documentId,

              review: {
                ...prop_type.str_type,
                example: "I love this shirt",
              },

              rating: {
                ...prop_type.integer_type,
                example: 4.5,
              },
            },
            [props.required]: [
              "order_id",
              "user_id",
              "product_id",
              "product_uid",
              "review",
              "rating",
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
                  ...prop_type.object_type,
                  [props.properties]: {
                    order_id: {
                      ...prop_type.str_type,
                      example: "Order id is required!",
                    },

                    user_id: {
                      ...prop_type.str_type,
                      example: "User id is required!",
                    },

                    product_id: {
                      ...prop_type.str_type,
                      example: "Product id is required!",
                    },

                    product_uid: {
                      ...prop_type.str_type,
                      example: "Product uid is required!",
                    },

                    review: {
                      ...prop_type.str_type,
                      example: "Review is required!",
                    },

                    rating: {
                      ...prop_type.str_type,
                      example: "Rating is required!",
                    },
                  },

                  [props.required]: [
                    "order_id",
                    "user_id",
                    "product_id",
                    "product_uid",
                    "review",
                    "rating",
                  ],
                },
              },

              [props.required]: ["errors"],
            },
          },
        },
      },

      "401": use_response.sendInvalidId({ key: "review" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Review" }),

      "429": use_response.sendTooManyRequest(),

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

                review: schema_ref.review,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/reviews/r/3",
                    },

                    review: {
                      ...prop_type.str_type,
                      example: "/reviews/r/3",
                    },
                  },
                  [props.required]: ["self", "review"],
                },
              },
              [props.required]: ["code", "message", "review", "links"],
            },
          },
        },
      },
    },
  },

  delete: {
    [props.description]: "Delete review by id",
    [props.tags]: [tags.review],
    [props.parameters]: [review_id_param],
    [props.security]: [security.bearerAuth],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "review" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Review" }),

      "200": use_response.sendDeleteSuccessfully(),
    },
  },
};
