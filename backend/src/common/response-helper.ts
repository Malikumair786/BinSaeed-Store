import { CommonResponse } from "./common-response.interface";

export function createResponse<T>(
  success: boolean,
  status: number,
  message: string,
  data?: T
): CommonResponse<T> {
  return {
    success,
    status,
    message,
    data,
  };
}
