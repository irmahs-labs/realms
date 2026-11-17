import { useLanguage } from "../../lib/language";
import { BirthDetails, WitchCard } from "./profile-tab";
import { DailyCard, TodayPanel } from "./today-panel";
import { useBook } from "./use-book";
import { WitchQuizCard } from "./witch-quiz-card";

/** The book's first page: today, and you. */
const Profile = () => {
  const language = useLanguage();

  const {
    birth,
    chart,
    clearer,
    editor,
    now,
    setState,
    state,
    thisYear,
    timeZone,
  } = useBook();

  return (
    <main className="page">
      <div className="layout">
        <TodayPanel
          now={now}
          timeZone={timeZone}
          southern={state.southern}
          language={language}
        />
        <DailyCard
          now={now}
          pull={state.dailyCard}
          onPull={(pull) =>
            setState((current) => ({ ...current, dailyCard: pull }))
          }
        />
      </div>
      <BirthDetails
        who="you"
        profile={state.profile}
        onChange={editor("profile")}
        onClear={clearer("profile")}
      />
      <WitchCard
        who="you"
        profile={state.profile}
        birth={birth}
        chart={chart}
        thisYear={thisYear}
      />
      <WitchQuizCard />
    </main>
  );
};

export default Profile;
