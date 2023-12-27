import { prop_type } from "./prop_type";
import { props } from "./prop";
import { request } from "./request_response";

/* common */
export const bodyStatus = () => {
  return {
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
  };
};

/* user & staff */
export const bodyToken = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
            token: request.token,
          },
          [props.required]: ["token"],
        },
      },
    },
  };
};

export const verifyNewEmailInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            name: request.name,
            email: request.email,
            password: request.password,
          },
          [props.required]: ["name", "email", "password"],
        },
      },
    },
  };
};

export const verifyAccountEmailInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
            new_email: request.new_email,
          },
          [props.required]: ["email", "new_email"],
        },
      },
    },
  };
};

export const changePasswordInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
            password: request.password,
            new_password: request.new_password,
          },
          [props.required]: ["email", "password", "new_password"],
        },
      },
    },
  };
};

export const loginInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
            password: request.password,
          },
          [props.required]: ["email", "password"],
        },
      },
    },
  };
};

export const bodyEmail = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
          },
          [props.required]: ["email"],
        },
      },
    },
  };
};

export const forgotPasswordInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            email: request.email,
          },
          [props.required]: ["email"],
        },
      },
    },
  };
};

export const resetPasswordInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.application_json]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            token: request.token,
            new_password: request.new_password,
          },
          [props.required]: ["token", "new_password"],
        },
      },
    },
  };
};

export const updateAccountInfo = () => {
  return {
    [props.required]: true,
    [props.content]: {
      [props.mulitpart_formdata]: {
        [props.schema]: {
          ...prop_type.object_type,
          [props.properties]: {
            image: request.image,
            name: request.name,
            gender: request.gender,
            phone: request.phone,
            country: request.country,
            city: request.city,
            house_number_or_name: request.house_number_or_name,
            post_code: request.post_code,
          },
          [props.required]: ["name"],
        },
      },
    },
  };
};

/* category */
