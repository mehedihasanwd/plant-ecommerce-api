import { prop_type } from "./prop_type";
import { props } from "./prop";

export const schema_props = {
  _id: {
    ...prop_type.str_type,
    example: "507f191e810c19729de860ea",
  },

  name: {
    ...prop_type.str_type,
    example: "Mehedi Hasan",
  },

  email: {
    ...prop_type.email_type,
    example: "mehedi@gmail.com",
  },

  password: {
    ...prop_type.password_type,
    example: "8^Kz%3mP#x",
  },

  gender: {
    ...prop_type.str_type,
    enum: ["man", "woman", "select"],
    default: "select",
  },

  phone: {
    ...prop_type.str_type,
    example: "+8801539",
  },

  image: {
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

  profile_image: {
    ...prop_type.object_type,
    [props.properties]: {
      isChangedSelf: {
        ...prop_type.bool_type,
        example: false,
      },

      key: {
        ...prop_type.str_type,
        example: "profile.png",
      },

      url: {
        ...prop_type.str_type,
        example: "https://cloud.com/profile.png",
      },
    },
    [props.required]: ["isChangedSelf", "key", "url"],
  },

  staff_role: {
    ...prop_type.str_type,
    enum: ["admin", "editor", "guest"],
    default: "guest",
  },

  user_role: {
    ...prop_type.str_type,
    enum: ["user"],
    default: "user",
  },

  country: {
    ...prop_type.str_type,
    example: "Bangladesh",
  },

  city: { ...prop_type.str_type, example: "Dhaka" },

  house_number_or_name: {
    ...prop_type.str_type,
    example: "17/45 Rose villa",
  },

  post_code: {
    ...prop_type.integer_type,
    example: 1216,
  },

  slug: {
    ...prop_type.str_type,
  },

  status: {
    ...prop_type.str_type,
    enum: ["active", "inactive"],
    default: "active",
  },

  original_price: {
    ...prop_type.integer_type,
    example: 20,
  },

  discount: {
    ...prop_type.integer_type,
    max: 15,
  },

  price: {
    ...prop_type.integer_type,
    example: 17,
  },

  in_stock: {
    ...prop_type.integer_type,
    example: 50,
  },

  sizes: {
    ...prop_type.array_type,
    items: {
      ...prop_type.str_type,
      enum: ["S", "M", "L", "XL"],
    },
  },

  size: {
    ...prop_type.str_type,
    enum: ["S", "M", "L", "XL"],
  },

  category: {
    ...prop_type.str_type,
    enum: ["flower", "fruit", "indoor", "herb"],
  },

  total_ratings: {
    ...prop_type.integer_type,
    example: 10,
  },

  average_rating: {
    ...prop_type.integer_type,
    max: 5,
    example: 4.5,
  },

  total_reviews: {
    ...prop_type.integer_type,
    example: 10,
  },

  sales: {
    ...prop_type.integer_type,
    example: 20,
  },

  top_category: {
    ...prop_type.str_type,
    enum: ["Regular", "Bestseller", "Highestrated", "Featured"],
    default: "Regular",
  },

  user_id: {
    ...prop_type.str_type,
    example: "507f191e810c19729de860ea",
  },

  order_id: {
    ...prop_type.str_type,
    example: "507f191e810c19729de860ea",
  },

  product_id: {
    ...prop_type.str_type,
    example: "507f191e810c19729de860ea",
  },

  product_uid: {
    ...prop_type.str_type,
    example: "507f191e810c19729de860ea",
  },

  quantity: {
    ...prop_type.str_type,
    example: 10,
  },

  total_cost: {
    ...prop_type.str_type,
    example: 170,
  },

  payment_intent: { ...prop_type.str_type },

  client_secret: { ...prop_type.str_type },

  review: { ...prop_type.str_type, example: "This is a beatiful plant" },

  rating: {
    ...prop_type.str_type,
    example: 5,
  },

  expire_date: {
    ...prop_type.date_type,
    example: "2023-12-04T18:31:18.240+00:00",
  },

  createdAt: {
    ...prop_type.date_type,
    example: "2023-12-04T18:31:18.240+00:00",
  },

  updatedAt: {
    ...prop_type.date_type,
    example: "2023-12-04T18:31:18.240+00:00",
  },

  __v: {
    ...prop_type.integer_type,
    example: 0,
  },

  description: {
    ...prop_type.integer_type,
  },
};
