import type { ZodMiniType } from "zod/mini";

/**
 * What `url` answers, read through `schema`, or null when it can't be
 * reached, refuses, or answers something the schema doesn't recognise.
 */
export const fetchParsed = async <T>(
  url: string,
  schema: ZodMiniType<T>,
  init?: RequestInit
): Promise<T | null> => {
  try {
    const response = await fetch(url, init);

    if (!response.ok) {
      return null;
    }

    const parsed = schema.safeParse(await response.json());

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
