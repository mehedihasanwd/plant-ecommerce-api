interface ICreateKeyForDocument {
  key:
    | "staff"
    | "user"
    | "product"
    | "category"
    | "coupon"
    | "order"
    | "review";

  value: string;
}

interface ICreateKeyForCollection {
  key:
    | "staffs"
    | "users"
    | "products"
    | "categories"
    | "coupons"
    | "orders"
    | "reviews";
  page: number;
  limit: number;
  skip: number;
  sort_type: "asc" | "dsc";
  search_by?: string;
}

interface ICreateKeyForItems extends ICreateKeyForCollection {
  status: "active" | "inactive" | "all";
}

export const createKeyForDocument = ({
  key,
  value,
}: ICreateKeyForDocument): string => {
  return `${key}::${value}`;
};

export const createKeyForCollection = ({
  key,
  page,
  skip,
  limit,
  sort_type,
  search_by,
}: ICreateKeyForCollection) => {
  const cache_key: string = search_by
    ? `${key}::page(${page})::limit(${limit})::skip(${skip})::sort_type(${sort_type})::search_by(${search_by})`
    : `${key}::page(${page})::limit(${limit})::skip(${skip})::sort_type(${sort_type})`;

  return cache_key;
};

export const createKeyForItems = ({
  key,
  page,
  limit,
  skip,
  sort_type,
  search_by,
  status,
}: ICreateKeyForItems) => {
  const cache_key: string = search_by
    ? `${key}::page(${page})::limit(${limit})::skip(${skip})::sort_type(${sort_type})::search_by(${search_by})::status(${status})`
    : `${key}::page(${page})::limit(${limit})::skip(${skip})::sort_type(${sort_type})::status(${status})`;

  return cache_key;
};
