export interface CommonResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data?: T;
  }
  