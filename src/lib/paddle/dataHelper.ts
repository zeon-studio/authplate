export function toCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      (acc as any)[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as T);
  }
  return obj as T;
}

export function toSnakeCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      (acc as any)[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as T);
  }
  return obj as T;
}
