import { props, prop_type } from "../utils";

export const getHealth = {
  get: {
    [props.description]: "Get health status",
    [props.tags]: ["Health"],
    [props.security]: [],
    [props.parameters]: [],
    [props.responses]: {
      "200": {
        [props.description]: "Get health status",
        [props.content]: {
          [props.application_json]: {
            [props.schema]: {
              ...prop_type.object_type,
              [props.properties]: {
                message: {
                  ...prop_type.str_type,
                  example: "Success",
                },
              },
              [props.required]: ["message"],
            },
          },
        },
      },
    },
  },
};
