import { BirthCardPanel } from "./birth-card-panel";
import { ChartTab } from "./chart-tab";
import { LunarZodiacTab } from "./lunar-zodiac-tab";
import { NumbersTab } from "./numbers-tab";
import { BirthDetails } from "./profile-tab";
import { useBook } from "./use-book";

/**
 * Everything your birth says, on one page, under the birth details every
 * reading in the book is drawn from: your chart, your numbers, your animal
 * in the lunar zodiac with your tarot birth card beside it.
 */
const BirthChart = () => {
  const { birth, chart, clearer, editor, now, state, thisYear, timeZone } =
    useBook();

  return (
    <main className="page">
      <BirthDetails
        who="you"
        profile={state.profile}
        onChange={editor("profile")}
        onClear={clearer("profile")}
      />
      {birth && chart ? (
        <>
          <ChartTab chart={chart} />
          <NumbersTab
            birth={birth}
            name={state.profile.name}
            thisYear={thisYear}
          />
        </>
      ) : null}
      <LunarZodiacTab
        birth={birth}
        birthTime={state.profile.birthTime}
        beside={
          birth ? (
            <BirthCardPanel birth={birth} className="panel--narrow" />
          ) : null
        }
        now={now}
        timeZone={timeZone}
      />
    </main>
  );
};

export default BirthChart;
