import type { Pool } from "pg";

import type { HallEntry } from "../src/realms/court-of-draconia/api";
import type {
  Affinity,
  Element,
  Role,
  Tier,
} from "../src/realms/court-of-draconia/rules";
import type { SessionAccount } from "./session";

interface DraconoidRow {
  id: string;
  owner_name: string;
  name: string;
  element: Element;
  affinity: Affinity;
  role: Role;
  tier: Tier;
  created_at: Date;
}

const COLUMNS =
  "id::text as id, owner_name, name, element, affinity, role, tier, created_at";

const entryOf = (row: DraconoidRow): HallEntry => ({
  affinity: row.affinity,
  at: row.created_at.toISOString(),
  element: row.element,
  id: row.id,
  name: row.name,
  owner: row.owner_name,
  role: row.role,
  tier: row.tier,
});

/** The newest `limit` draconoids, newest first. */
export const readHall = async (
  pool: Pool,
  limit: number
): Promise<HallEntry[]> => {
  const { rows } = await pool.query<DraconoidRow>(
    `select ${COLUMNS} from court_of_draconia_draconoids
     order by created_at desc, id desc
     limit $1`,
    [limit]
  );

  return rows.map(entryOf);
};

/** The draconoid `userId` made, or null for none. */
export const readMine = async (
  pool: Pool,
  userId: string
): Promise<HallEntry | null> => {
  const { rows } = await pool.query<DraconoidRow>(
    `select ${COLUMNS} from court_of_draconia_draconoids where user_id = $1`,
    [userId]
  );

  const [row] = rows;

  return row ? entryOf(row) : null;
};

export interface DraconoidFields {
  name: string;
  element: Element;
  affinity: Affinity;
  role: Role;
}

/**
 * Makes `account`'s draconoid, or remakes it: a new one starts at bronze,
 * and a remade one keeps its tier, its number and when it was first made.
 */
export const saveDraconoid = async (
  pool: Pool,
  account: SessionAccount,
  fields: DraconoidFields
): Promise<HallEntry> => {
  const { rows } = await pool.query<DraconoidRow>(
    `insert into court_of_draconia_draconoids (user_id, owner_name, name, element, affinity, role)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (user_id) do update set
       owner_name = excluded.owner_name,
       name = excluded.name,
       element = excluded.element,
       affinity = excluded.affinity,
       role = excluded.role,
       updated_at = now()
     returning ${COLUMNS}`,
    [
      account.id,
      account.name,
      fields.name,
      fields.element,
      fields.affinity,
      fields.role,
    ]
  );

  const [row] = rows;

  if (!row) {
    throw new Error("Saving a draconoid returned no row");
  }

  return entryOf(row);
};

/** Lets go of `userId`'s draconoid; nothing when they have none. */
export const removeMine = async (pool: Pool, userId: string): Promise<void> => {
  await pool.query(
    "delete from court_of_draconia_draconoids where user_id = $1",
    [userId]
  );
};

/** Takes draconoid `id` down; false when there is no such draconoid. */
export const removeDraconoid = async (
  pool: Pool,
  id: string
): Promise<boolean> => {
  const { rowCount } = await pool.query(
    "delete from court_of_draconia_draconoids where id = $1",
    [id]
  );

  return (rowCount ?? 0) > 0;
};
