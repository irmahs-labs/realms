import { BirthCardPanel } from "./birth-card-panel";
import { ChartTab } from "./chart-tab";
import { LunarZodiacTab } from "./lunar-zodiac-tab";
import { NeedsBirth } from "./needs-birth";
import { NumbersTab } from "./numbers-tab";
import { useBook } from "./use-book";

/**
 * Everything your birth says, on one page: your chart, your numbers, your
 * animal in the lunar zodiac and your tarot birth cards.
 */
const BirthChart = () => {
  const { birth, chart, now, state, thisYear, timeZone } = useBook();

  return (
    <main className="page">
      {birth && chart ? (
        <>
          <ChartTab chart={chart} />
          <NumbersTab
            birth={birth}
            name={state.profile.name}
            thisYear={thisYear}
          />
        </>
      ) : (
        <NeedsBirth />
      )}
      <LunarZodiacTab
        birth={birth}
        birthTime={state.profile.birthTime}
        now={now}
        timeZone={timeZone}
      />
      {birth ? <BirthCardPanel birth={birth} /> : null}
    </main>
  );
};

export default BirthChart;
