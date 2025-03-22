export interface ISuccessReturnData<T = unknown> {
  success: boolean;
  msg?: string;
  data: T;
}
