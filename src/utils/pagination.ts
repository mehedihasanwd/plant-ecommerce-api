interface ICollection {
  collection:
    | "staffs"
    | "users"
    | "categories"
    | "products"
    | "orders"
    | "reviews"
    | "coupons";
}

interface IGetPagination extends ICollection {
  current_page: number;
  total_pages: number;
  total_items: number;
  prev_page: number | null;
  next_page: number | null;
  limit: number;
}

interface IGetPaginationLinks
  extends Omit<IGetPagination, "total_pages" | "total_items">,
    ICollection {}

export const getPagination = ({
  current_page,
  total_pages,
  total_items,
  prev_page,
  next_page,
  limit,
  collection,
}: IGetPagination) => {
  const prop_name: string = `total_${collection}`;

  let pagination: {
    total_pages: number;
    current_page: number;
    prev_page?: number;
    next_page?: number;
    limit: number;
    [key: string]: any;
  } = {
    total_pages,
    current_page,
    [prop_name]: total_items,
    limit,
    prev_page: undefined,
    next_page: undefined,
  };

  if (prev_page && !next_page) {
    pagination = {
      total_pages,
      current_page,
      prev_page,
      [prop_name]: total_items,
      limit,
    };
  }

  if (!prev_page && next_page) {
    pagination = {
      total_pages,
      current_page,
      next_page,
      [prop_name]: total_items,
      limit,
    };
  }

  if (prev_page && next_page) {
    pagination = {
      total_pages,
      current_page,
      prev_page,
      next_page,
      [prop_name]: total_items,
      limit,
    };
  }

  if (!prev_page && !next_page) {
    pagination = {
      total_pages,
      current_page,
      [prop_name]: total_items,
      limit,
    };
  }

  return pagination;
};

export const getPaginationLinks = ({
  current_page,
  prev_page,
  next_page,
  limit,
  collection,
}: IGetPaginationLinks): { self: string; prev?: string; next?: string } => {
  let links: { self: string; prev?: string; next?: string } = {
    self: "",
    prev: undefined,
    next: undefined,
  };

  if (prev_page && next_page) {
    links = {
      self: `/${collection}?page=${current_page}&limit=${limit}`,
      prev: `/${collection}?page=${prev_page}&limit=${limit}`,
      next: `/${collection}?page=${next_page}&limit=${limit}`,
    };
  }

  if (prev_page && !next_page) {
    links = {
      self: `/${collection}?page=${current_page}&limit=${limit}`,
      prev: `/${collection}?page=${prev_page}&limit=${limit}`,
    };
  }

  if (!prev_page && next_page) {
    links = {
      self: `/${collection}?page=${current_page}&limit=${limit}`,
      next: `/${collection}?page=${next_page}&limit=${limit}`,
    };
  }

  if (!prev_page && !next_page) {
    links = {
      self: `/${collection}?page=${current_page}&limit=${limit}`,
    };
  }

  return links;
};
