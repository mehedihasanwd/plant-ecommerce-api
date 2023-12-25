interface IGetPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  prev_page: number | null;
  next_page: number | null;
  limit: number;
}

export const getPagination = ({
  current_page,
  total_pages,
  total_items,
  prev_page,
  next_page,
  limit,
}: IGetPagination) => {
  let pagination = {};

  if (prev_page && !next_page) {
    pagination = {
      total_pages,
      current_page,
      prev_page,
      limit,
      total_items,
    };
  }

  if (!prev_page && next_page) {
    pagination = {
      total_pages,
      current_page,
      next_page,
      limit,
      total_items,
    };
  }

  if (prev_page && next_page) {
    pagination = {
      total_pages,
      current_page,
      prev_page,
      next_page,
      limit,
      total_items,
    };
  }

  if (!prev_page && !next_page) {
    pagination = {
      total_pages,
      current_page,
      limit,
      total_items,
    };
  }

  return pagination;
};
