import { MAJOR_ARCANA } from "./tarot";
import type { TarotCard } from "./tarot";

/**
 * Your tarot birth cards, from your birth date, as tarot readers count
 * them: add the month, the day and the year ("1990-07-15": 7 + 15 + 1990 =
 * 2012), then add the digits until the number is 22 or less (2 + 0 + 1 + 2
 * = 5, The Hierophant). 22 is The Fool. A two-digit card also has a second,
 * its digits added once more (19, The Sun, and 10, the Wheel of Fortune).
 */

const digitSum = (n: number): number =>
  [...String(n)].reduce((sum, digit) => sum + Number(digit), 0);

/** The birth number, 1 to 22, from a day key ("1990-07-15"). */
export const birthNumber = (day: string): number => {
  const [year = 0, month = 0, date = 0] = day.split("-").map(Number);
  let total = year + month + date;

  while (total > 22) {
    total = digitSum(total);
  }

  return total;
};

/** A major arcana card by its number, 22 standing for The Fool (0). */
const majorNumbered = (n: number): TarotCard | null =>
  MAJOR_ARCANA[n === 22 ? 0 : n] ?? null;

/** Your birth card, and its pair when the number has two digits. */
export const birthCards = (day: string): TarotCard[] => {
  const number = birthNumber(day);
  const first = majorNumbered(number);
  const second = number >= 10 ? majorNumbered(digitSum(number)) : null;

  return [first, second].filter((card): card is TarotCard => card !== null);
};
