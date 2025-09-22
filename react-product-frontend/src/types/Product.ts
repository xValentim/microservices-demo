export interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  price: string;  // Agora é string simples
  categories: string[];
}

// Nova estrutura da API
export interface ProductsApiResponse {
  products: Product[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  query?: string;
  error?: string;
}
