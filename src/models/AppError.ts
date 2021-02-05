export class AppError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export function isAppErrorOf(
  target: unknown,
  code: string
): target is AppError {
  if (!(target instanceof AppError)) {
    return false;
  }

  if (target.code !== code) {
    return false;
  }

  return true;
}
