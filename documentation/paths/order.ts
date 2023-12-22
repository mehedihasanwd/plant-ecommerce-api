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

const order_id_param = {
  ...id_param,
  name: "orderId",
};

const user_id_param = {
  ...id_param,
  name: "userId",
};

const product_id_param = {
  ...id_param,
  name: "productId",
};

export const get_post_order = {
  post: {
    [props.description]: "Post new order",
    [props.tags]: [tags.order],
  },

  get: {
    [props.description]: "Get orders",
    [props.tags]: [tags.order],
  },
};

export const order_by_id = {
  get: {},

  patch: {},

  delete: {},
};
