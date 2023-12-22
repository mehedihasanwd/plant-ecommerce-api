import { prop_type } from "./prop_type";

export const response = {
  error: {
    token: {
      ...prop_type.str_type,
      example: "Token is required!",
    },

    name: {
      ...prop_type.str_type,
      example: "Name is required!",
    },

    email: {
      ...prop_type.str_type,
      example: "E-mail is required!",
    },

    new_email: {
      ...prop_type.str_type,
      example: "New e-mail is required!",
    },

    password: {
      ...prop_type.str_type,
      example: "Password is required!",
    },

    new_password: {
      ...prop_type.str_type,
      example: "New password is required!",
    },

    role: {
      ...prop_type.str_type,
      example: "Role is required!",
    },

    image: {
      ...prop_type.str_type,
      example: "Multiple image upaloads not allowed!",
    },

    gender: {
      ...prop_type.str_type,
      example: "Gender should be either 'man', 'woman' or 'select'",
    },

    phone: {
      ...prop_type.str_type,
      example: "Phone should be a string!",
    },

    country: {
      ...prop_type.str_type,
      example: "Country should be a string!",
    },

    city: {
      ...prop_type.str_type,
      example: "City should be a string!",
    },

    house_number_or_name: {
      ...prop_type.str_type,
      example: "House number or name should be a string!",
    },

    post_code: {
      ...prop_type.str_type,
      example: "Postal code should be a number!",
    },

    description: {
      ...prop_type.str_type,
      example: "Description is required!",
    },

    status: {
      ...prop_type.str_type,
      example: "Status is required!",
    },

    original_price: {
      ...prop_type.str_type,
      example: "Original price is required!",
    },

    in_stock: {
      ...prop_type.str_type,
      example: "In stock is required!",
    },

    sizes: {
      ...prop_type.str_type,
      example: "Sizes is required!",
    },

    category: {
      ...prop_type.str_type,
      example: "Category is required!",
    },

    page: {
      ...prop_type.str_type,
      example: "Page is required!",
    },

    limit: {
      ...prop_type.str_type,
      example: "Limit is required!",
    },

    search_by: {
      ...prop_type.str_type,
      example: "Search by should be a string!",
    },

    sort_type: {
      ...prop_type.str_type,
      example: "Sort type should be either asc or dsc",
    },
  },

  success: {
    token: {
      ...prop_type.str_type,
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    },

    access_token: {
      ...prop_type.str_type,
      example:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    },

    code: {
      ...prop_type.integer_type,
      example: 200,
    },

    from_cache: {
      ...prop_type.bool_type,
      example: false,
    },

    current_page: {
      ...prop_type.integer_type,
      example: 2,
    },

    limit: {
      ...prop_type.integer_type,
      example: 5,
    },

    prev_page: {
      ...prop_type.integer_type,
      example: 1,
    },

    next_page: {
      ...prop_type.integer_type,
      example: 3,
    },

    total_items: {
      ...prop_type.integer_type,
      example: 15,
    },

    total_pages: {
      ...prop_type.integer_type,
      example: 3,
    },
  },
};

export const request = {
  name: {
    ...prop_type.str_type,
    example: "Mehedi Hasan",
  },

  email: {
    ...prop_type.email_type,
    example: "mehedi@gmail.com",
  },

  new_email: {
    ...prop_type.email_type,
    example: "hasan@gmail.com",
  },

  password: {
    ...prop_type.password_type,
    example: "Z$Vj!L@ck7V",
  },

  new_password: {
    ...prop_type.password_type,
    example: "Z$Vj!L@ck7V",
  },

  gender: {
    ...prop_type.str_type,
    enum: ["man", "woman", "select"],
    default: "select",
  },

  phone: {
    ...prop_type.str_type,
  },

  image: {
    ...prop_type.image_type,
  },

  staff_role: {
    ...prop_type.str_type,
    enum: ["admin", "editor", "guest"],
    default: "guest",
  },

  user_role: {
    ...prop_type.str_type,
    enum: ["user"],
    example: "user",
  },

  country: {
    ...prop_type.str_type,
  },

  city: {
    ...prop_type.str_type,
  },

  house_number_or_name: {
    ...prop_type.str_type,
  },

  post_code: {
    ...prop_type.integer_type,
  },

  original_price: {
    ...prop_type.integer_type,
    example: 25,
  },

  discount: {
    ...prop_type.integer_type,
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

  category: {
    ...prop_type.str_type,
    enum: ["flower", "fruit", "indoor", "herb"],
  },

  token: {
    ...prop_type.str_type,
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },

  status: {
    ...prop_type.str_type,
    enum: ["active", "inactive"],
    default: "active",
  },

  documentId: {
    ...prop_type.str_type,
    format: "ObjectId",
    example: "507f191e810c19729de860ea",
  },
};
