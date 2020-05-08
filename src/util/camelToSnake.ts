export function toSnake(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toUpperCase();
}
