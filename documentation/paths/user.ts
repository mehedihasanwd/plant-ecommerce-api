import {
  prop_type,
  props,
  id_param,
  query_params,
  security,
  tags,
  response,
  use_response,
  headers,
  use_request,
  schema_ref,
} from "../utils";

const user_param_id = {
  ...id_param,
  name: "userId",
};

// path schemas
export const post_verify_email = {
  post: {
    [props.description]: "Verify email",
    [props.tags]: [tags.user_auth],
    [props.requestBody]: use_request.verifyNewEmailInfo(),
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
                    email: response.error.email,
                    password: response.error.password,
                  },
                  [props.required]: ["name", "email", "password"],
                },
              },
              [props.required]: ["errors"],
            },
          },
        },
      },

      "409": use_response.sendAlreadyExists({
        key: "E-mail",
        suffix: "please try again using a new one",
      }),

      "200": use_response.sendVerifyNewEmailSuccessInfo(),
    },
  },
};

export const post_register_user = {
  post: {
    [props.description]: "Register",
    [props.tags]: [tags.user_auth],
    [props.requestBody]: use_request.bodyToken(),
    [props.responses]: {
      "400": use_response.sendTokenRequired(),

      "401": use_response.sendInvalidToken(),

      "409": use_response.sendAlreadyExists({
        key: "E-mail",
        suffix: "please try again using a new one",
      }),

      "500": use_response.sendServerError(),

      "201": {
        [props.description]: "Registered successfully",
        headers,
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 201,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Registered successfully",
                },

                access_token: response.success.access_token,

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/users/register",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "user",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const post_login_user = {
  post: {
    [props.description]: "Login",
    [props.tags]: [tags.user_auth],
    [props.requestBody]: use_request.loginInfo(),
    [props.responses]: {
      "400": use_response.sendInValidLoginCredentials(),

      "404": use_response.sendNotFound({ key: "User" }),

      "401": use_response.sendPasswordNotMatch(),

      "200": {
        [props.description]: "Logged in successfully",
        headers,
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Logged in successfully",
                },

                access_token: response.success.access_token,

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/users/login",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "user",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const post_logout_user = {
  post: {
    [props.description]: "Logout",
    [props.tags]: [tags.user_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.bodyEmail,
    [props.responses]: {
      "400": use_response.sendEmailRequired(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "200": {
        [props.description]: "Logged out successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Logged out successfully",
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/users/logout",
                    },

                    login: {
                      ...prop_type.str_type,
                      example: "/auth/users/login",
                    },
                  },
                  [props.required]: ["self", "login"],
                },
              },
              [props.required]: ["code", "message", "links"],
            },
          },
        },
      },
    },
  },
};

export const post_forgot_password = {
  post: {
    [props.description]: "Forgot password",
    [props.tags]: [tags.user_auth],
    [props.security]: [],
    [props.parameters]: [],
    [props.requestBody]: use_request.forgotPasswordInfo(),
    [props.responses]: {
      "400": use_response.sendEmailRequired(),

      "404": use_response.sendNotFound({ key: "User" }),

      "200": use_response.sendForgotPasswordInfo(),
    },
  },
};

export const patch_reset_password = {
  patch: {
    [props.description]: "Reset password",
    [props.tags]: [tags.user_auth],
    [props.security]: [],
    [props.parameters]: [],
    [props.requestBody]: use_request.bodyToken(),
    [props.responses]: {
      "400": use_response.sendTokenRequired(),

      "401": use_response.sendInvalidToken(),

      "404": use_response.sendNotFound({ key: "User" }),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Reset password successfully",
        headers,
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Reset password successfully",
                },

                access_token: response.success.access_token,

                user: schema_ref.user,
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "user",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const patch_change_password = {
  patch: {
    [props.description]: "Change password",
    [props.tags]: [tags.user_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.changePasswordInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidChangePasswordCredentials(),

      "401": use_response.sendPasswordNotMatch(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Password changed successfully",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                message: {
                  ...prop_type.str_type,
                  example: "Password changed successfully",
                },

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/users/change-password",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: ["code", "message", "user", "links"],
            },
          },
        },
      },
    },
  },
};

export const post_verify_user_email = {
  post: {
    [props.description]: "Verify user email",
    [props.tags]: [tags.user_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.verifyAccountEmailInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidVerifyEmailInfo(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "200": use_response.sendVerifyAccountEmailSuccessInfo(),
    },
  },
};

export const patch_update_user_email = {
  patch: {
    [props.description]: "Update user email",
    [props.tags]: [tags.user_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.bodyToken(),
    [props.responses]: {
      "400": use_response.sendTokenRequired(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "E-mail updated successfully",
        headers,
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_id,
              [props.properties]: {
                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                message: {
                  ...prop_type.str_type,
                  example: "E-mail updated successfully",
                },

                access_token: response.success.access_token,

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/users/update-user-email",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "user",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const get_new_access_token = {
  get: {
    [props.description]: "Rotate token",
    [props.tags]: [tags.user_auth],
    [props.security]: [security.bearerAuth],
    [props.responses]: {
      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "200": use_response.sendRotateTokenInfo(),
    },
  },
};

// crud
export const get_users = {
  get: {
    [props.description]: "Get users",
    [props.tags]: [tags.user_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of users",
        [props.required]: true,
      },

      {
        ...query_params.sort_type,
      },

      {
        ...query_params.search_by,
      },
    ],
    [props.responses]: {
      "400": use_response.sendInvalidQueryInfo({ sort_value: "asc or dsc" }),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Users" }),

      "200": {
        [props.description]: ["List of users"],
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                users: {
                  ...prop_type.array_type,
                  items: schema_ref.user,
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

                    total_users: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_users",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/users?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/users?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/users?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "users",
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

export const user_by_id = {
  get: {
    [props.description]: "Get user by id",
    [props.tags]: [tags.user_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [user_param_id],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "user" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "200": {
        [props.description]: "Successfull data",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                from_cache: response.success.from_cache,

                code: {
                  ...prop_type.integer_type,
                  example: 200,
                },

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/users/u/3",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },

                    users: {
                      ...prop_type.str_type,
                      example: "/dashboard/users",
                    },
                  },
                  [props.required]: ["self", "profile", "users"],
                },
              },
              [props.required]: ["from_cache", "code", "user", "links"],
            },
          },
        },
      },
    },
  },

  put: {
    [props.description]: "Update staff by id",
    [props.tags]: [tags.user_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [user_param_id],
    [props.requestBody]: use_request.updateAccountInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidUpdateAccountInfo(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "415": use_response.sendUnsupportedImageFormat(),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Information updated successfully",
        headers,
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

                acces_token: response.success.access_token,

                user: schema_ref.user,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/users/u/3",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/users/u/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "user",
                "links",
              ],
            },
          },
        },
      },
    },
  },

  delete: {
    [props.description]: "Delete user by id",
    [props.tags]: [tags.user_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [user_param_id],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "user" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "User" }),

      "200": use_response.sendDeleteSuccessfully(),
    },
  },
};
