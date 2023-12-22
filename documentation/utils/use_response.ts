import { response } from "./request_response";
import { prop_type } from "./prop_type";
import { props } from "./prop";

interface IKey {
  key: string;
}

/* user & staff */
// error response utilities
export const sendAlreadyExists = ({
  key,
  suffix,
}: {
  key: string;
  suffix: string;
}) => {
  return {
    description: `${key} already exists!`,
    content: {
      [props.application_json]: {
        schema: {
          type: "object",
          properties: {
            error: {
              ...prop_type.str_type,
              example: `${key} already exists! ${suffix}`,
            },
          },
          required: ["error"],
        },
      },
    },
  };
};

export const sendStatusInUse = () => {
  return {
    description: `Status is already active!`,
    content: {
      [props.application_json]: {
        schema: {
          type: "object",
          properties: {
            error: {
              ...prop_type.str_type,
              example: `Status is already active! available status value: active/inactive`,
            },
          },
          required: ["error"],
        },
      },
    },
  };
};

export const sendNotFound = ({ key }: IKey) => {
  return {
    description: `${key} not found!`,
    content: {
      [props.application_json]: {
        schema: {
          type: "object",
          properties: {
            error: {
              ...prop_type.str_type,
              example: `${key} not found!`,
            },
          },
          required: ["error"],
        },
      },
    },
  };
};

export const sendPasswordNotMatch = () => {
  return {
    description: `Unauthorized!`,
    content: {
      [props.application_json]: {
        schema: {
          type: "object",
          properties: {
            error: {
              ...prop_type.str_type,
              example: `Password does not match!`,
            },
          },
          required: ["error"],
        },
      },
    },
  };
};

export const sendInvalidCredentials = () => {
  return {
    description: "Invalid credentials!",
    content: {
      [props.application_json]: {
        schema: {
          ...prop_type.object_type,
          properties: {
            error: {
              ...prop_type.str_type,
              example: "Invalid credentials!",
            },
          },
          required: ["error"],
        },
      },
    },
  };
};

export const sendInvalidToken = () => {
  return {
    description: "Invalid token or expired!",
    content: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example:
                "Invalid token or expired! please try again using a valid one",
            },
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendInvalidId = ({ key }: { key: string }) => {
  return {
    description: `Invalid ${key} id!`,
    content: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example: `Invalid ${key} id! please try again using a valid one`,
            },
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendServerError = () => {
  return {
    description: "Server error occurred!",
    content: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example: "Server error occurred! please try again",
            },
          },
          [props.required]: true,
        },
      },
    },
  };
};

export const sendPermissionDenied = () => {
  return {
    [props.description]: "Permission denied!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example: "Permission denied!",
            },
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendTokenRequired = () => {
  return {
    [props.description]: "Token is required!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: response.error.token,
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendRoleRequired = () => {
  return {
    [props.description]: "Role is required!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: response.error.role,
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendEmailRequired = () => {
  return {
    [props.description]: "E-mail is required!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: response.error.email,
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendInValidLoginCredentials = () => {
  return {
    [props.description]: "Invalid credentials!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            errors: {
              ...prop_type.object_type,
              [props.properties]: {
                email: response.error.email,
                password: response.error.password,
              },
              [props.required]: ["email", "password"],
            },
          },
          [props.required]: ["errors"],
        },
      },
    },
  };
};

export const sendInvalidChangePasswordCredentials = () => {
  return {
    [props.description]: "Invalid credentials",
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            errors: {
              ...prop_type.object_type,
              [props.properties]: {
                email: response.error.email,
                password: response.error.password,
                new_password: response.error.new_password,
              },
              [props.required]: ["email", "password", "new_password"],
            },
          },
          [props.required]: ["errors"],
        },
      },
    },
  };
};

export const sendInvalidVerifyEmailInfo = () => {
  return {
    [props.description]: "Invalid credentials!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            errors: {
              ...prop_type.object_type,
              [props.properties]: {
                email: response.error.email,
                new_email: response.error.new_email,
              },
              [props.required]: ["email", "new_email"],
            },
          },
          [props.required]: ["errors"],
        },
      },
    },
  };
};

export const sendInvalidQueryInfo = ({
  sort_value,
}: {
  sort_value: string;
}) => {
  return {
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
                  example: `Sort type should be either: ${sort_value}`,
                },

                search_by: {
                  ...prop_type.str_type,
                  example: "Search by should be a string!",
                },
              },
              [props.required]: ["page", "limit"],
            },
          },
          [props.required]: ["errors"],
        },
      },
    },
  };
};

export const sendInvalidUpdateAccountInfo = () => {
  return {
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
                gender: response.error.gender,
                phone: response.error.phone,
                country: response.error.country,
                city: response.error.city,
                house_number_or_name: response.error.house_number_or_name,
                post_code: response.error.post_code,
              },
              [props.required]: ["name"],
            },

            error: {
              ...prop_type.str_type,
              example: "Mulitple image uploads not allowed!",
            },
          },
          [props.required]: ["errors"],
        },
      },
    },
  };
};

export const sendUnsupportedImageFormat = () => {
  return {
    [props.description]: "Unsupported image format!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example:
                "Unsupported image format! supported formats: JPG, PNG, JPEG",
            },
          },
          [props.required]: ["error"],
        },
      },
    },
  };
};

export const sendStatusRequired = () => {
  return {
    [props.description]: "Status is required!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            status: response.error.status,
          },
          [props.required]: ["status"],
        },
      },
    },
  };
};

export const sendTooManyRequest = () => {
  return {
    [props.description]: "You made too many requests!",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            error: {
              ...prop_type.str_type,
              example:
                "You made too many requests! please try again after 30 minutes!",
            },
          },

          [props.required]: ["error"],
        },
      },
    },
  };
};

// success response utilites
export const sendVerifyNewEmailSuccessInfo = () => {
  return {
    [props.description]: "E-mail has been sent to mehedi@gmail.com",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            message: {
              ...prop_type.str_type,
              example:
                "E-mail has been sent to mehedi@gmail.com, please check your e-mail and follow the instructions to complete registration",
            },
          },
          [props.required]: ["message"],
        },
      },
    },
  };
};

export const sendVerifyAccountEmailSuccessInfo = () => {
  return {
    [props.description]: "E-mail has been sent to mehedi@gmail.com",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            message: {
              ...prop_type.str_type,
              example:
                "E-mail has been sent to mehedi@gmail.com, please check your e-mail and follow the instructions to update your e-mail",
            },
          },
          [props.required]: ["message"],
        },
      },
    },
  };
};

export const sendForgotPasswordInfo = () => {
  return {
    [props.description]: "E-mail has been sent to mehedi@gmail.com",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            message: {
              ...prop_type.str_type,
              example:
                "E-mail has been sent to mehedi@gmail.com, please check your e-mail and follow the instructions to reset your password",
            },
          },
          [props.required]: ["message"],
        },
      },
    },
  };
};

export const sendRotateTokenInfo = () => {
  return {
    [props.description]: "Token rotated successfully",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            code: {
              ...prop_type.integer_type,
              example: 200,
            },

            access_token: response.success.access_token,
          },
          [props.required]: ["code", "access_token"],
        },
      },
    },
  };
};

export const sendDeleteSuccessfully = () => {
  return {
    [props.description]: "Deleted successfully",
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            code: response.success.code,
            message: {
              ...prop_type.str_type,
              example: "Deleted successfully",
            },
          },
          [props.required]: ["code", "message"],
        },
      },
    },
  };
};

/* products */
