export function ok<T>(data: T) {
  return { code: 0, message: "", data };
}

export function err(code: number, message: string) {
  return { code, message, data: null };
}
