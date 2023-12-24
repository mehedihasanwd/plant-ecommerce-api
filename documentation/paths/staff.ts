import {
  prop_type,
  props,
  id_param,
  query_params,
  security,
  tags,
  request,
  response,
  use_response,
  headers,
  use_request,
  schema_ref,
} from "../utils";

const staff_param_id = {
  ...id_param,
  name: "staffId",
};

// path schemas
export const post_verify_email = {
  post: {
    [props.description]: "Verify email",
    [props.tags]: [tags.staff_auth],
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

export const post_register_staff = {
  post: {
    [props.description]: "Register",
    [props.tags]: [tags.staff_auth],
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

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/staffs/register",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "staff",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const post_login_staff = {
  post: {
    [props.description]: "Login",
    [props.tags]: [tags.staff_auth],
    [props.requestBody]: use_request.loginInfo(),
    [props.responses]: {
      "400": use_response.sendInValidLoginCredentials(),

      "404": use_response.sendNotFound({ key: "Staff" }),

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

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/staffs/login",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "staff",
                "links",
              ],
            },
          },
        },
      },
    },
  },
};

export const post_logout_staff = {
  post: {
    [props.description]: "Logout",
    [props.tags]: [tags.staff_auth],
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
                      example: "/auth/staffs/logout",
                    },

                    login: {
                      ...prop_type.str_type,
                      example: "/auth/staffs/login",
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
    [props.tags]: [tags.staff_auth],
    [props.security]: [],
    [props.parameters]: [],
    [props.requestBody]: use_request.forgotPasswordInfo(),
    [props.responses]: {
      "400": use_response.sendEmailRequired(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "200": use_response.sendForgotPasswordInfo(),
    },
  },
};

export const patch_reset_password = {
  patch: {
    [props.description]: "Reset password",
    [props.tags]: [tags.staff_auth],
    [props.security]: [],
    [props.parameters]: [],
    [props.requestBody]: use_request.bodyToken(),
    [props.responses]: {
      "400": use_response.sendTokenRequired(),

      "401": use_response.sendInvalidToken(),

      "404": use_response.sendNotFound({ key: "Staff" }),

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

                staff: schema_ref.staff,
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "staff",
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
    [props.tags]: [tags.staff_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.changePasswordInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidChangePasswordCredentials(),

      "401": use_response.sendPasswordNotMatch(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

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

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/staffs/change-password",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: ["code", "message", "staff", "links"],
            },
          },
        },
      },
    },
  },
};

export const post_verify_staff_email = {
  post: {
    [props.description]: "Verify staff email",
    [props.tags]: [tags.staff_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.verifyAccountEmailInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidVerifyEmailInfo(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "200": use_response.sendVerifyAccountEmailSuccessInfo(),
    },
  },
};

export const patch_update_staff_email = {
  patch: {
    [props.description]: "Update staff email",
    [props.tags]: [tags.staff_auth],
    [props.security]: [security.bearerAuth],
    [props.requestBody]: use_request.bodyToken(),
    [props.responses]: {
      "400": use_response.sendTokenRequired(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "E-mail updated successfully",
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
                  example: "E-mail updated successfully",
                },

                access_token: response.success.access_token,

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/auth/staffs/update-staff-email",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "staff",
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
    [props.tags]: [tags.staff_auth],
    [props.security]: [security.bearerAuth],
    [props.responses]: {
      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "200": use_response.sendRotateTokenInfo(),
    },
  },
};

// crud
export const get_staffs = {
  get: {
    [props.description]: "Get staffs",
    [props.tags]: [tags.staff_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [
      {
        ...query_params.page,
        [props.required]: true,
      },

      {
        ...query_params.limit,
        description: "Number of staffs",
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

      "404": use_response.sendNotFound({ key: "Staffs" }),

      "200": {
        [props.description]: ["List of staffs"],
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

                staffs: {
                  ...prop_type.array_type,
                  items: schema_ref.staff,
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

                    total_staffs: {
                      ...prop_type.integer_type,
                      example: 15,
                    },
                  },
                  [props.required]: [
                    "current_page",
                    "limit",
                    "total_pages",
                    "total_staffs",
                  ],
                },

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/staffs?page=2&limit=5",
                    },

                    prev: {
                      ...prop_type.str_type,
                      example: "/staffs?page=1&limit=5",
                    },

                    next: {
                      ...prop_type.str_type,
                      example: "/staffs?page=3&limit=5",
                    },
                  },
                  [props.required]: ["self"],
                },
              },
              [props.required]: [
                "from_cache",
                "code",
                "staffs",
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

export const staff_by_id = {
  get: {
    [props.description]: "Get staff by id",
    [props.tags]: [tags.staff_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [staff_param_id],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "staff" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

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

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },

                    staffs: {
                      ...prop_type.str_type,
                      example: "/dashboard/staffs",
                    },
                  },
                  [props.required]: ["self", "profile", "staffs"],
                },
              },
              [props.required]: ["from_cache", "code", "staff", "links"],
            },
          },
        },
      },
    },
  },

  patch: {
    [props.description]: "Update staff role by id",
    [props.tags]: [tags.staff_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [staff_param_id],
    [props.requestBody]: {
      [props.required]: true,
      [props.content]: {
        [props.application_json]: {
          [props.schema]: {
            ...prop_type.object_type,
            [props.properties]: {
              role: request.staff_role,
            },
            [props.required]: ["role"],
          },
        },
      },
    },
    [props.responses]: {
      "400": use_response.sendRoleRequired(),

      "401": use_response.sendInvalidId({ key: "staff" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "500": use_response.sendServerError(),

      "200": {
        [props.description]: "Role updated successfully",
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
                  example: "Role updated successfully",
                },

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3",
                    },

                    staffs: {
                      ...prop_type.str_type,
                      example: "/staffs",
                    },
                  },
                  [props.required]: ["self", "staffs"],
                },
              },
              [props.required]: ["code", "message", "staff", "links"],
            },
          },
        },
      },
    },
  },

  put: {
    [props.description]: "Update staff by id",
    [props.tags]: [tags.staff_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [staff_param_id],
    [props.requestBody]: use_request.updateAccountInfo(),
    [props.responses]: {
      "400": use_response.sendInvalidUpdateAccountInfo(),

      "401": use_response.sendInvalidToken(),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

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

                staff: schema_ref.staff,

                links: {
                  ...prop_type.object_type,
                  [props.properties]: {
                    self: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3",
                    },

                    profile: {
                      ...prop_type.str_type,
                      example: "/staffs/s/3/profile",
                    },
                  },
                  [props.required]: ["self", "profile"],
                },
              },
              [props.required]: [
                "code",
                "message",
                "access_token",
                "staff",
                "links",
              ],
            },
          },
        },
      },
    },
  },

  delete: {
    [props.description]: "Delete staff by id",
    [props.tags]: [tags.staff_crud],
    [props.security]: [security.bearerAuth],
    [props.parameters]: [staff_param_id],
    [props.responses]: {
      "401": use_response.sendInvalidId({ key: "staff" }),

      "403": use_response.sendPermissionDenied(),

      "404": use_response.sendNotFound({ key: "Staff" }),

      "200": use_response.sendDeleteSuccessfully(),
    },
  },
};
