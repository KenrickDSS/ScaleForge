export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | Buffer
  | Map<unknown, unknown>
  | Set<unknown>
  | Array<Value>
  | { [key: string]: Value };

/**
 * Transforms JavaScript scalars and objects into JSON
 * compatible objects.
 */
export function serialize(value: Value): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }

  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', __v: Array.from(value.values()) };
  }

  if (value instanceof Map) {
    return {
      __t: 'Map',
      __v: Array.from(value.entries()).map(
        ([k, v]) => [serialize(k as Value), serialize(v as Value)]
      ),
    };
  }

  if (value instanceof Set) {
    return {
      __t: 'Set',
      __v: Array.from(value).map((item) => serialize(item as Value)),
    };
  }

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item));
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in value) {
      result[key] = serialize(value[key]);
    }
    return result;
  }

  return value;
}

/**
 * Transforms JSON compatible scalars and objects into JavaScript
 * scalar and objects.
 */
export function deserialize<T = unknown>(value: unknown): T {
  if (typeof value === 'object' && value !== null) {
    const obj = value as any;

    if (obj.__t === 'Date') {
      return new Date(obj.__v) as T;
    }

    if (obj.__t === 'Buffer') {
      return Buffer.from(obj.__v) as T;
    }

    if (obj.__t === 'Map') {
      return new Map(
        obj.__v.map(([k, v]: [unknown, unknown]) => [
          deserialize(k as Value),
          deserialize(v as Value),
        ])
      ) as T;
    }

    if (obj.__t === 'Set') {
      return new Set(obj.__v.map((item: unknown) => deserialize(item as Value))) as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item: unknown) => deserialize(item as Value)) as T;
    }

    const result: Record<string, unknown> = {};
    for (const key in obj) {
      result[key] = deserialize(obj[key] as Value);
    }
    return result as T;
  }

  return value as T;
}