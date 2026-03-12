import { type ApiResponse, PATHS } from "../api";
import type {
  BrandsPageDTO,
  ColorwaysPageDTO,
  FetchedProductDTO,
  InventoryDTO,
  ModelsPageDTO,
} from "../dtos";
import type { HttpClient } from "../http/types";
import {
  fromBrandDTO,
  fromColorwayDTO,
  fromFetchedProductDTO,
  fromListProductDTO,
  fromModelDTO,
  toCreateProductDTO,
} from "../mappers";
import type {
  BrandsPageModel,
  ColorwaysPageModel,
  CreateProductModel,
  InventoryModel,
  ModelsPageModel,
  ProductModel,
  UserModel,
} from "../models";

export const listAvailableBrands = async (
  http: HttpClient,
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<BrandsPageModel> => {
  const data = await http.get<{ message: BrandsPageDTO }>(
    PATHS.PRODUCT.LIST_AVAILABLE_BRANDS(size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return { ...data.message, products: data.message.products.map(fromBrandDTO) };
};

export const listAvailableModels = async (
  http: HttpClient,
  brand: string,
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<ModelsPageModel> => {
  if (!brand) throw new Error("Missing required parameter: brand");

  const data = await http.get<{ message: ModelsPageDTO }>(
    PATHS.PRODUCT.LIST_AVAILABLE_MODELS(brand, size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return { ...data.message, products: data.message.products.map(fromModelDTO) };
};

export const listAvailableColorways = async (
  http: HttpClient,
  brand: string,
  model: string,
  size: number,
  page: number,
  searchKey: string,
  signal: AbortSignal,
): Promise<ColorwaysPageModel> => {
  if (!brand) throw new Error("Missing required parameter: brand");
  if (!model) throw new Error("Missing required parameter: model");

  const data = await http.get<{ message: ColorwaysPageDTO }>(
    PATHS.PRODUCT.LIST_AVAILABLE_COLORWAYS(brand, model, size, page, searchKey),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    products: data.message.products.map(fromColorwayDTO),
  };
};

export const uploadProduct = async (
  http: HttpClient,
  newProduct: CreateProductModel,
): Promise<ApiResponse> => {
  const dto = toCreateProductDTO(newProduct);
  const { images, ...payload } = dto;

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  images.forEach((image) => {
    formData.append("images", image.file);
  });

  return await http.post(PATHS.PRODUCT.UPLOAD_PRODUCT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listProducts = async (
  http: HttpClient,
  uid: UserModel["id"],
  size: number,
  page: number,
  signal: AbortSignal,
): Promise<InventoryModel> => {
  if (!uid) throw new Error("Missing required parameter: uid");

  const data = await http.get<{ message: InventoryDTO }>(
    PATHS.PRODUCT.LIST_PRODUCTS(uid, size, page),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    products: data.message.products.map(fromListProductDTO),
  };
};

export const listSavedProducts = async (
  http: HttpClient,
  size: number,
  page: number,
  signal: AbortSignal,
): Promise<InventoryModel> => {
  const data = await http.get<{ message: InventoryDTO }>(
    PATHS.PRODUCT.LIST_SAVED_PRODUCTS(size, page),
    {
      signal,
    },
  );

  if (data.message.next) {
    data.message.next = page + 1;
  }

  return {
    ...data.message,
    products: data.message.products.map(fromListProductDTO),
  };
};

export const getProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
  signal: AbortSignal,
): Promise<ProductModel> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  const data = await http.get<{ message: FetchedProductDTO }>(
    PATHS.PRODUCT.GET_PRODUCT(pid),
    {
      signal,
    },
  );

  return fromFetchedProductDTO(data.message);
};

export const deleteProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await http.delete(PATHS.PRODUCT.DELETE_PRODUCT(pid));
};

export const likeProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await http.post(PATHS.PRODUCT.LIKE_PRODUCT, { product_id: pid });
};

export const unlikeProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await http.post(PATHS.PRODUCT.UNLIKE_PRODUCT, { product_id: pid });
};

export const saveProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await http.post(PATHS.PRODUCT.SAVE_PRODUCT, { product_id: pid });
};

export const unsaveProduct = async (
  http: HttpClient,
  pid: ProductModel["id"],
): Promise<ApiResponse> => {
  if (!pid) throw new Error("Missing required parameter: pid");

  return await http.delete(PATHS.PRODUCT.UNSAVE_PRODUCT(pid));
};
