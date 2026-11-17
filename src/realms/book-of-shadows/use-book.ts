import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "../../lib/language";
import { openBook } from "./carry-over";
import { chartMatch, lunarMatch, numbersMatch } from "./compat";
import { firstNameOf } from "./compat-panel";
import { lunarYearOf } from "./lunar-zodiac";
import {
  EMPTY_PROFILE,
  birthNumbers,
  chartFor,
  readBirth,
  saveState,
} from "./profile";
import type { BookState, Profile } from "./profile";
import { localTimeZone, wallTimeAt } from "./time";

/** How often "now" moves on. */
const REFRESH_MS = 10 * 60_000;

/**
 * The Book of Shadows as every one of its pages reads it: the book saved in
 * this browser (or carried over from Mini Games, on the first page), saved
 * again on every change, and what it adds up to: your birth and chart,
 * your soulmate's, and how the two of you match. Only one page is open at
 * a time, so each reads the saved book when it opens.
 */
export const useBook = () => {
  const [state, setState] = useState<BookState>(openBook);
  const french = useLanguage() === "fr";
  // Every "today" in the book is this moment, moved on now and then so a
  // book left open past midnight turns the page.
  const [now, setNow] = useState(() => new Date());
  const timeZone = localTimeZone();
  const thisYear = wallTimeAt(now, timeZone).year;
  const { profile, partner } = state;

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), REFRESH_MS);

    return () => window.clearInterval(timer);
  }, []);

  const birth = useMemo(
    () => readBirth(profile, timeZone),
    [profile, timeZone]
  );

  const theirBirth = useMemo(
    () => readBirth(partner, timeZone),
    [partner, timeZone]
  );

  const chart = useMemo(() => (birth ? chartFor(birth) : null), [birth]);

  const theirChart = useMemo(
    () => (theirBirth ? chartFor(theirBirth) : null),
    [theirBirth]
  );

  const theirName = firstNameOf(partner.name);

  // How you match someone else, three ways, once both have a birth date.
  const matches = useMemo(() => {
    if (!birth || !chart || !theirBirth || !theirChart) {
      return null;
    }

    return {
      chart: chartMatch(chart, theirChart, theirName, french),
      "lunar-zodiac": lunarMatch(
        lunarYearOf(birth.day),
        lunarYearOf(theirBirth.day),
        french
      ),
      numbers: numbersMatch(
        birthNumbers(birth, profile.name, thisYear),
        birthNumbers(theirBirth, partner.name, thisYear),
        theirName,
        french
      ),
    };
  }, [
    birth,
    chart,
    theirBirth,
    theirChart,
    theirName,
    profile.name,
    partner.name,
    thisYear,
    french,
  ]);

  const editor = (key: "profile" | "partner") => (fields: Partial<Profile>) =>
    setState((current) => ({
      ...current,
      [key]: { ...current[key], ...fields },
    }));

  const clearer = (key: "profile" | "partner") => () =>
    setState((current) => ({ ...current, [key]: { ...EMPTY_PROFILE } }));

  return {
    birth,
    chart,
    clearer,
    editor,
    matches,
    now,
    setState,
    state,
    theirBirth,
    theirChart,
    theirName,
    thisYear,
    timeZone,
  };
};

/** Where each of the book's pages lives, for links between them. */
export const BOOK_PATHS = {
  birthChart: "/book-of-shadows/birth-chart",
  compatibility: "/book-of-shadows/compatibility",
  moon: "/book-of-shadows/moon",
  profile: "/book-of-shadows",
  sky: "/book-of-shadows/sky",
  tarot: "/book-of-shadows/tarot",
} as const;
