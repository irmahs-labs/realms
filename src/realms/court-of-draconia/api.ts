import * as z from "zod/mini";

import { AFFINITIES, ELEMENTS, MAX_NAME, ROLES, TIERS } from "./rules";

/**
 * What the page and the server say to each other about draconoids. Each
 * account has one draconoid, saved on the server so the hall can show it to
 * everyone.
 */

/** PUT /api/court-of-draconia/me: the draconoid as made. Its tier is the server's to give. */
export const draconoidRequest = z.object({
  affinity: z.enum(AFFINITIES),
  element: z.enum(ELEMENTS),
  name: z.string().check(z.maxLength(MAX_NAME * 4)),
  role: z.enum(ROLES),
});

export type DraconoidRequest = z.infer<typeof draconoidRequest>;

/** A draconoid in the hall: never its maker's account, only their short name. */
export const hallEntry = z.object({
  affinity: z.enum(AFFINITIES),
  /** When it was first made, as an ISO date. */
  at: z.string(),
  element: z.enum(ELEMENTS),
  /** Its own number in the hall, for an admin to take it down by. */
  id: z.string(),
  name: z.string(),
  /** Who made it, as everyone sees them: "Irma H.". */
  owner: z.string(),
  role: z.enum(ROLES),
  tier: z.enum(TIERS),
});

export type HallEntry = z.infer<typeof hallEntry>;

/** GET /api/court-of-draconia/hall: everyone's draconoids, newest first, and the asker's own. */
export const hall = z.object({
  /** The asker may take draconoids down. */
  admin: z.boolean(),
  draconoids: z.array(hallEntry),
  /** The asker's own draconoid; null when they have none or are signed out. */
  mine: z.nullable(hallEntry),
});

export type Hall = z.infer<typeof hall>;

/** How many draconoids the hall shows at once, newest first. */
export const HALL_SIZE = 300;
