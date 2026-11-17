import { useEffect, useState } from "react";

import { currentAccount } from "../../lib/account";
import type { Account } from "../../lib/account";
import type { Hall } from "./api";
import { fetchHall } from "./hall-api";

export interface HallState {
  /** Who is signed in: null for nobody, undefined while asking or when the server can't be reached. */
  account: Account | null | undefined;
  /** The hall: undefined while asking, null when the server can't be reached. */
  hall: Hall | null | undefined;
  /** Asks again, after a change. */
  reload: () => Promise<void>;
}

/**
 * The last answer, kept while the site is open: a Court page opened after
 * another shows it at once, then the fresh one when it comes.
 */
let lastSeen: Pick<HallState, "account" | "hall"> = {
  account: undefined,
  hall: undefined,
};

/** The hall and who is asking, read when the page opens. */
export const useHall = (): HallState => {
  const [account, setAccount] = useState(lastSeen.account);
  const [hall, setHall] = useState(lastSeen.hall);

  useEffect(() => {
    let current = true;

    const load = async () => {
      const [who, seen] = await Promise.all([currentAccount(), fetchHall()]);

      lastSeen = { account: who, hall: seen };

      if (current) {
        setAccount(who);
        setHall(seen);
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, []);

  const reload = async () => {
    const seen = await fetchHall();

    lastSeen = { ...lastSeen, hall: seen };
    setHall(seen);
  };

  return { account, hall, reload };
};
