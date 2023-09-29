import { AxiosError } from 'axios';

type ErrorWithMessage = {
  message: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const toErrorWithMessage = (maybeError: unknown) => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

const createErrorObject = (error: unknown) => {
  if (error instanceof AxiosError) {
    return { error: (error.response?.data?.error as string) || error.message };
  }
  return { error: 'Unknown error' };
};

export type DataOrError<T> = Promise<
  | {
      data: T;
      error?: undefined;
    }
  | {
      error: string;
      data?: undefined;
    }
>;

export { getErrorMessage, createErrorObject };
