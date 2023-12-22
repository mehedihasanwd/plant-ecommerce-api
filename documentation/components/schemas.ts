import swaggerJSDoc from "swagger-jsdoc";
import { prop_type, props, schema_props } from "../utils";

const account_props = {
  _id: schema_props._id,
  name: schema_props.name,
  email: schema_props.email,
  password: schema_props.password,
  gender: schema_props.gender,
  phone: schema_props.phone,
  image: schema_props.profile_image,
  country: schema_props.country,
  city: schema_props.city,
  house_number_or_name: schema_props.house_number_or_name,
  post_code: schema_props.post_code,
  createdAt: schema_props.createdAt,
  updatedAt: schema_props.updatedAt,
  __v: schema_props.__v,
};

const account_required_props = [
  "name",
  "email",
  "password",
  "gender",
  "phone",
  "image",
  "country",
  "city",
  "house_number_or_name",
  "post_code",
  "createdAt",
  "updatedAt",
  "__v",
];

// schemas
const staff_account_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    ...account_props,
    role: schema_props.staff_role,
  },
  [props.required]: account_required_props,
};

const user_account_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    ...account_props,
    role: schema_props.user_role,
  },
  [props.required]: account_required_props,
};

const category_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    _id: schema_props._id,

    name: { ...schema_props.name, example: "fruit" },

    slug: {
      ...schema_props.slug,
      example: "fruit",
    },

    description: {
      ...schema_props.description,
      example: "This is fruit category",
    },

    image: schema_props.image,

    status: schema_props.status,

    createdAt: schema_props.createdAt,

    updatedAt: schema_props.updatedAt,

    __v: schema_props.__v,
  },
  [props.required]: [
    "_id",
    "name",
    "image",
    "description",
    "slug",
    "status",
    "createdAt",
    "updatedAt",
    "__v",
  ],
};

const product_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    _id: schema_props._id,

    name: {
      ...schema_props.name,
      example: "Black shirt",
    },

    slug: {
      ...schema_props.slug,
      example: "black-shirt",
    },

    image: schema_props.image,

    description: {
      ...schema_props.description,
      example: "This is a cool black shirt",
    },

    original_price: {
      ...schema_props.original_price,
      example: 20,
    },

    discount: {
      ...schema_props.discount,
      example: 15,
    },

    price: {
      ...schema_props.price,
      example: 17,
    },

    in_stock: schema_props.in_stock,

    sizes: schema_props.sizes,

    category: schema_props.category,

    status: schema_props.status,

    total_ratings: schema_props.total_ratings,

    average_rating: schema_props.average_rating,

    total_reviews: schema_props.total_reviews,

    sales: schema_props.sales,

    top_category: schema_props.top_category,

    createdAt: schema_props.createdAt,

    updatedAt: schema_props.updatedAt,

    __v: schema_props.__v,
  },

  [props.required]: [
    "_id",
    "name",
    "slug",
    "image",
    "description",
    "original_price",
    "price",
    "discount",
    "in_stock",
    "sizes",
    "size",
    "category",
    "status",
    "total_ratings",
    "average_rating",
    "total_reviews",
    "sales",
    "top_category",
    "createdAt",
    "updatedAt",
    "__v",
  ],
};

const order_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    _id: schema_props._id,

    user_id: schema_props.user_id,

    products: {
      ...prop_type.array_type,
      items: {
        ...prop_type.object_type,
        [props.properties]: {
          _id: schema_props._id,

          order_id: schema_props.order_id,

          product_id: schema_props.product_id,

          product_uid: schema_props.product_uid,

          name: {
            ...schema_props.name,
            example: "Black shirt",
          },

          slug: {
            ...schema_props.slug,
            example: "black-shirt",
          },

          image: schema_props.image,

          description: {
            ...schema_props.description,
            example: "This is a cool black shirt",
          },

          price: schema_props.price,

          quantity: schema_props.quantity,

          size: schema_props.size,

          category: schema_props.category,
        },

        [props.required]: [
          "_id",
          "order_id",
          "product_id",
          "product_uid",
          "name",
          "slug",
          "image",
          "description",
          "price",
          "quantity",
          "size",
          "category",
        ],
      },
    },

    status: schema_props.status,

    total_cost: schema_props.total_cost,

    payment_intent: {
      ...schema_props.payment_intent,
      example: "payment_intent",
    },

    client_secret: {
      ...schema_props.client_secret,
      example: "client_secret",
    },

    shipping_address: {
      ...prop_type.object_type,
      [props.properties]: {
        _id: schema_props._id,

        country: schema_props.country,

        city: schema_props.city,

        house_number_or_name: schema_props.house_number_or_name,

        phone: schema_props.phone,

        post_code: schema_props.post_code,
      },
      [props.required]: [
        "_id",
        "country",
        "city",
        "house_number_or_name",
        "phone",
        "post_code",
      ],
    },

    createdAt: schema_props.createdAt,

    updatedAt: schema_props.updatedAt,

    __v: schema_props.__v,
  },
  [props.required]: [
    "_id",
    "user_id",
    "products",
    "status",
    "total_cost",
    "payment_intent",
    "client_secret",
    "shipping_address",
    "createdAt",
    "updatedAt",
    "__v",
  ],
};

const review_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    _id: schema_props._id,

    user_name: schema_props.name,

    user_id: schema_props.user_id,

    user_image: schema_props.image,

    product_id: schema_props.product_id,

    product_uid: schema_props.product_uid,

    order_id: schema_props.order_id,

    review: schema_props.review,

    rating: schema_props.rating,

    createdAt: schema_props.createdAt,

    updatedAt: schema_props.updatedAt,

    __v: schema_props.__v,
  },
  [props.required]: [
    "_id",
    "user_name",
    "user_id",
    "user_image",
    "product_id",
    "product_uid",
    "order_id",
    "review",
    "rating",
    "createdAt",
    "updatedAt",
    "__v",
  ],
};

const coupon_schema = {
  ...prop_type.object_type,
  [props.properties]: {
    _id: schema_props._id,

    name: schema_props.name,

    user_id: schema_props.user_id,

    status: schema_props.status,

    expire_date: schema_props.expire_date,

    createdAt: schema_props.createdAt,

    updatedAt: schema_props.updatedAt,

    __v: schema_props.__v,
  },
  [props.required]: [
    "_id",
    "name",
    "user_id",
    "status",
    "expire_date",
    "createdAt",
    "updatedAt",
    "__v",
  ],
};

export const schemas: swaggerJSDoc.Schema = {
  User: user_account_schema,
  Staff: staff_account_schema,
  Category: category_schema,
  Product: product_schema,
  Order: order_schema,
  Review: review_schema,
  Coupon: coupon_schema,
};
