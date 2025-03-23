export interface ISuccessReturnData<T = unknown> {
  success: boolean;
  msg?: string;
  data: T;
}

export interface IErrorReturnData {
  success: boolean;
  msg: string;
  errors?: { path: string; message: string }[];
}
