export type SnakeToCamelString<S extends string> =
  S extends `${infer A}_${infer B}${infer C}`
    ? `${Lowercase<A>}${Uppercase<B>}${SnakeToCamelString<C>}`
    : Lowercase<S>;

export function snakeToCamelString<S extends string>(
  snake: S,
): SnakeToCamelString<S> {
  return snake.replace(
    /(_\w)/g,
    (substring) => substring[1]?.toUpperCase() ?? "",
  ) as SnakeToCamelString<S>;
}

export type CamelToSnakeString<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First> ? `_${Lowercase<First>}` : First}${CamelToSnakeString<Rest>}`
    : S;

export function camelToSnakeString<S extends string>(
  string: S,
): CamelToSnakeString<S> {
  return string.replace(
    /[A-Z]/g,
    (substring) => `_${substring.toLowerCase()}`,
  ) as CamelToSnakeString<S>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export type SnakeToCamelJson<Json> = Json extends (infer Item)[]
  ? SnakeToCamelJson<Item>[]
  : Json extends Record<string, unknown>
    ? {
        [Key in keyof Json as SnakeToCamelString<
          Key & string
        >]: SnakeToCamelJson<Json[Key]>;
      }
    : Json;

export function snakeToCamelJson<Json>(json: Json): SnakeToCamelJson<Json> {
  if (Array.isArray(json)) {
    return json.map((item) => snakeToCamelJson(item)) as SnakeToCamelJson<Json>;
  }

  if (isObject(json)) {
    return Object.entries(json).reduce(
      (acc, [key, value]) => {
        acc[snakeToCamelString(key)] = snakeToCamelJson(value);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as SnakeToCamelJson<Json>;
  }

  return json as SnakeToCamelJson<Json>;
}

export type CamelToSnakeJson<Json> = Json extends (infer Item)[]
  ? CamelToSnakeJson<Item>[]
  : Json extends Record<string, unknown>
    ? {
        [Key in keyof Json as CamelToSnakeString<
          Key & string
        >]: CamelToSnakeJson<Json[Key]>;
      }
    : Json;

export function camelToSnakeJson<Json>(json: Json): CamelToSnakeJson<Json> {
  if (Array.isArray(json)) {
    return json.map((item) => camelToSnakeJson(item)) as CamelToSnakeJson<Json>;
  }

  if (isObject(json)) {
    return Object.entries(json).reduce(
      (acc, [key, value]) => {
        acc[camelToSnakeString(key)] = camelToSnakeJson(value);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as CamelToSnakeJson<Json>;
  }

  return json as CamelToSnakeJson<Json>;
}
