export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
}
