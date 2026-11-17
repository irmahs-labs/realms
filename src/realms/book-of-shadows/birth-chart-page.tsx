import { navigate } from "../../lib/router";
import { BirthCardPanel } from "./birth-card-panel";
import { ChartTab } from "./chart-tab";
import { LunarZodiacTab } from "./lunar-zodiac-tab";
import { NeedsBirth } from "./needs-birth";
import { NumbersTab } from "./numbers-tab";
import { BOOK_PATHS, useBook } from "./use-book";

const openProfile = () => navigate(BOOK_PATHS.profile);

/**
 * Everything your birth says, on one page: your chart, your numbers, your
 * animal in the lunar zodiac and your tarot birth cards.
 */
const BirthChart = () => {
  const { birth, chart, now, state, thisYear, timeZone } = useBook();

  if (!birth || !chart) {
    return (
      <main className="page">
        <NeedsBirth onOpen={openProfile} />
      </main>
    );
  }

  return (
    <main className="page">
      <ChartTab chart={chart} />
      <NumbersTab birth={birth} name={state.profile.name} thisYear={thisYear} />
      <LunarZodiacTab
        birth={birth}
        birthTime={state.profile.birthTime}
        now={now}
        timeZone={timeZone}
        onOpenProfile={openProfile}
      />
      <BirthCardPanel day={birth.day} />
    </main>
  );
};

export default BirthChart;
