import { hall, hallEntry } from "./api";
import type { DraconoidRequest, Hall, HallEntry } from "./api";

/**
 * The page's side of the hall: everything goes through the site's own
 * server, which knows who is asking from the shared sign-in cookie.
 */
const HALL = "/api/court-of-draconia/hall";
const MINE = "/api/court-of-draconia/me";

/** The hall, or null when the server can't be reached. */
export const fetchHall = async (): Promise<Hall | null> => {
  try {
    const response = await fetch(HALL);

    if (!response.ok) {
      return null;
    }

    const parsed = hall.safeParse(await response.json());

    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export type Done<T> = { ok: true; value: T } | { ok: false; message: string };

/** The server's refusal, a sentence, or ours when it gave none. */
const refusal = async (response: Response, fallback: string) =>
  (await response.text()) || fallback;

/** Makes or remakes the visitor's draconoid. */
export const saveMine = async (
  draconoid: DraconoidRequest
): Promise<Done<HallEntry>> => {
  try {
    const response = await fetch(MINE, {
      body: JSON.stringify(draconoid),
      headers: { "content-type": "application/json" },
      method: "PUT",
    });

    if (!response.ok) {
      return {
        message: await refusal(response, "Your draconoid wasn't saved."),
        ok: false,
      };
    }

    const parsed = hallEntry.safeParse(await response.json());

    return parsed.success
      ? { ok: true, value: parsed.data }
      : { message: "The hall's answer made no sense.", ok: false };
  } catch {
    return { message: "The hall can't be reached right now.", ok: false };
  }
};

/** Sends a DELETE and says whether it went through. */
const remove = async (path: string, fallback: string): Promise<Done<null>> => {
  try {
    const response = await fetch(path, { method: "DELETE" });

    return response.ok
      ? { ok: true, value: null }
      : { message: await refusal(response, fallback), ok: false };
  } catch {
    return { message: "The hall can't be reached right now.", ok: false };
  }
};

/** Lets the visitor's draconoid go. */
export const letGoMine = () => remove(MINE, "Your draconoid wasn't let go.");

/** Takes someone's draconoid down: admins only. */
export const takeDown = (id: string) =>
  remove(
    `/api/court-of-draconia/draconoids/${encodeURIComponent(id)}`,
    "That draconoid wasn't taken down."
  );
