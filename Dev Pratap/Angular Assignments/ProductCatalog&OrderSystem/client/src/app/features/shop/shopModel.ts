export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  image?: string;
  images?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  data: Product[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
