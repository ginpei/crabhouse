import { useEffect } from "react";

// // eslint-disable-next-line @typescript-eslint/no-empty-function
// export const noop: () => void = () => {};

export function useErrorLog(error: Error | null): void {
  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);
}

export class AppError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}
