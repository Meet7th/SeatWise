export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface ApiError {
  code: number;
  data: null;
  message: string;
  details?: { field?: string };
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
