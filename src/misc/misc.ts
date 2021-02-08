import { useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: () => void = () => {};

/**
 * Join class names
 */
export function jcn(...names: (string | undefined | null)[]): string {
  return names.filter((v) => v).join(" ");
}

export function useErrorLog(error: Error | null): void {
  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [error]);
}
