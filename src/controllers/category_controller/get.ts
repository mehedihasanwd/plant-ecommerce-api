import { RequestHandler } from "express";
import {
  pagination,
  response,
  cache_expiration,
  create_cache_key,
  isValidParamId,
} from "../../utils";
import { redis_service, category_service } from "../../services";
import { category_type } from "../../types";

export const getCategoryById: RequestHandler = async (req, res, next) => {
  const _id = req.params?.categoryId as string;

  if (!isValidParamId(_id)) {
    return response.responseErrorMessage(res, 401, {
      error: "Invalid category id! please try again using a valid one",
    });
  }

  const cache_key: string = create_cache_key.createKeyForDocument({
    key: "category",
    value: _id,
  });

  try {
    const cached_category: string | null =
      await redis_service.getDocumentFromCache({ key: cache_key });

    if (cached_category) {
      const parsed_category: category_type.THydratedCategoryDocument =
        JSON.parse(cached_category);

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        code: 200,
        category: parsed_category,
        links: {
          self: `/categories/ca/${_id}`,
          category: `/categories/ca/${_id}`,
        },
      });
    }

    const category: category_type.THydratedCategoryDocument | null =
      await category_service.findCategoryByProp({ key: "_id", value: _id });

    if (!category) {
      return response.responseErrorMessage(res, 404, {
        error: "Category not found!",
      });
    }

    // save category in cache (for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: category,
      EX: cache_expiration.setCacheExpiration({ day: 2 }),
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      code: 200,
      category,
      links: {
        self: `/categories/ca/${_id}`,
        category: `/categories/ca/${_id}`,
      },
    });
  } catch (e) {
    return next(e);
  }
};

export const getCategories: RequestHandler = async (req, res, next) => {
  const current_page: number = Number(req.query?.page || "1");
  const limit: number = Number(req.query?.limit || "8");
  const sort_type = req.query?.sort_type as
    | "asc"
    | "dsc"
    | "active"
    | "inactive";
  const search_by = req.query?.search_by as string | undefined;
  const skip: number = (current_page - 1) * limit;
  const prev_page: number | null = current_page > 1 ? current_page - 1 : null;

  const cache_key: string = `categories::page(${current_page})::skip(${skip})::limit(${limit})::sort_type(${sort_type})::search_by(${search_by})`;

  try {
    const cached_document: string | null =
      await redis_service.getDocumentFromCache({
        key: cache_key,
      });

    if (cached_document) {
      const parsed_categories: Array<category_type.THydratedCategoryDocument> =
        JSON.parse(cached_document);

      const total_categories: number = await category_service.countCategories({
        search_by,
      });

      const total_pages: number = Math.ceil(total_categories / limit);

      const next_page: number | null =
        current_page < total_pages ? current_page + 1 : null;

      const get_pagenation = pagination.getPagination({
        current_page,
        total_pages,
        total_items: total_categories,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      const get_pagination_links = pagination.getPaginationLinks({
        current_page,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        categories: parsed_categories,
        pagination: get_pagenation,
        links: get_pagination_links,
      });
    }

    const categories: Array<category_type.THydratedCategoryDocument> | null =
      await category_service.findCategories({
        skip,
        limit,
        sort_type: sort_type ? sort_type : "asc",
        search_by,
      });

    if (!categories) {
      return response.responseErrorMessage(res, 404, {
        error: "Categories not found!",
      });
    }

    const total_categories: number = await category_service.countCategories({
      search_by,
    });

    const total_pages: number = Math.ceil(total_categories / limit);

    const next_page: number | null =
      current_page < total_pages ? current_page + 1 : null;

    const get_pagenation = pagination.getPagination({
      current_page,
      total_pages,
      total_items: total_categories,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    const get_pagination_links = pagination.getPaginationLinks({
      current_page,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    // save categories in cache (for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: categories,
      EX: cache_expiration.setCacheExpiration({ day: 2 }),
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      categories,
      pagination: get_pagenation,
      links: get_pagination_links,
    });
  } catch (e) {
    return next(e);
  }
};

export const getActiveCategories: RequestHandler = async (req, res, next) => {
  const current_page: number = Number(req.query?.page || "1");
  const limit: number = Number(req.query?.limit || "8");
  const sort_type = req.query?.sort_type as "asc" | "dsc";
  const search_by = req.query?.search_by as string | undefined;
  const skip: number = (current_page - 1) * limit;
  const prev_page: number | null = current_page > 1 ? current_page - 1 : null;

  const cache_key: string = create_cache_key.createKeyForItems({
    key: "categories",
    page: current_page,
    skip,
    limit,
    sort_type,
    search_by,
    status: "active",
  });

  try {
    const cached_document: string | null =
      await redis_service.getDocumentFromCache({
        key: cache_key,
      });

    if (cached_document) {
      const parsed_categories: Array<category_type.THydratedCategoryDocument> =
        JSON.parse(cached_document);

      const total_categories: number = await category_service.countCategories({
        search_by,
      });

      const total_pages: number = Math.ceil(total_categories / limit);

      const next_page: number | null =
        current_page < total_pages ? current_page + 1 : null;

      const get_pagenation = pagination.getPagination({
        current_page,
        total_pages,
        total_items: total_categories,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      const get_pagination_links = pagination.getPaginationLinks({
        current_page,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        categories: parsed_categories,
        pagination: get_pagenation,
        links: get_pagination_links,
      });
    }

    const categories: Array<category_type.THydratedCategoryDocument> | null =
      await category_service.findCategoriesByStatus({
        skip,
        limit,
        sort_type: sort_type ? sort_type : "asc",
        search_by,
        status: "active",
      });

    if (!categories) {
      return response.responseErrorMessage(res, 404, {
        error: "Categories not found!",
      });
    }

    const total_categories: number = await category_service.countCategories({
      search_by,
    });

    const total_pages: number = Math.ceil(total_categories / limit);

    const next_page: number | null =
      current_page < total_pages ? current_page + 1 : null;

    const get_pagenation = pagination.getPagination({
      current_page,
      total_pages,
      total_items: total_categories,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    const get_pagination_links = pagination.getPaginationLinks({
      current_page,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    // save categories in cache (for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: categories,
      EX: cache_expiration.setCacheExpiration({ day: 2 }),
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      categories,
      pagination: get_pagenation,
      links: get_pagination_links,
    });
  } catch (e) {
    return next(e);
  }
};

export const getInactiveCategories: RequestHandler = async (req, res, next) => {
  const current_page: number = Number(req.query?.page || "1");
  const limit: number = Number(req.query?.limit || "8");
  const sort_type = req.query?.sort_type as "asc" | "dsc";
  const search_by = req.query?.search_by as string | undefined;
  const skip: number = (current_page - 1) * limit;
  const prev_page: number | null = current_page > 1 ? current_page - 1 : null;

  const cache_key: string = create_cache_key.createKeyForItems({
    key: "categories",
    page: current_page,
    skip,
    limit,
    sort_type,
    search_by,
    status: "inactive",
  });

  try {
    const cached_document: string | null =
      await redis_service.getDocumentFromCache({
        key: cache_key,
      });

    if (cached_document) {
      const parsed_categories: Array<category_type.THydratedCategoryDocument> =
        JSON.parse(cached_document);

      const total_categories: number = await category_service.countCategories({
        search_by,
      });

      const total_pages: number = Math.ceil(total_categories / limit);

      const next_page: number | null =
        current_page < total_pages ? current_page + 1 : null;

      const get_pagenation = pagination.getPagination({
        current_page,
        total_pages,
        total_items: total_categories,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      const get_pagination_links = pagination.getPaginationLinks({
        current_page,
        prev_page,
        next_page,
        limit,
        collection: "categories",
      });

      return response.responseSuccessData(res, 200, {
        from_cache: true,
        categories: parsed_categories,
        pagination: get_pagenation,
        links: get_pagination_links,
      });
    }

    const categories: Array<category_type.THydratedCategoryDocument> | null =
      await category_service.findCategoriesByStatus({
        skip,
        limit,
        sort_type: sort_type ? sort_type : "asc",
        search_by,
        status: "active",
      });

    if (!categories) {
      return response.responseErrorMessage(res, 404, {
        error: "Categories not found!",
      });
    }

    const total_categories: number = await category_service.countCategories({
      search_by,
    });

    const total_pages: number = Math.ceil(total_categories / limit);

    const next_page: number | null =
      current_page < total_pages ? current_page + 1 : null;

    const get_pagenation = pagination.getPagination({
      current_page,
      total_pages,
      total_items: total_categories,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    const get_pagination_links = pagination.getPaginationLinks({
      current_page,
      prev_page,
      next_page,
      limit,
      collection: "categories",
    });

    // save categories in cache (for 2 days)
    await redis_service.saveToCache({
      key: cache_key,
      document: categories,
      EX: cache_expiration.setCacheExpiration({ day: 2 }),
    });

    return response.responseSuccessData(res, 200, {
      from_cache: false,
      categories,
      pagination: get_pagenation,
      links: get_pagination_links,
    });
  } catch (e) {
    return next(e);
  }
};
