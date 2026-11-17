import { MoonTab } from "./moon-tab";
import { SabbatsTab } from "./sabbats-tab";
import { useBook } from "./use-book";

/** The moon tonight and the Wheel of the Year, on one page. */
const MoonAndSabbats = () => {
  const { now, setState, state, timeZone } = useBook();

  return (
    <main className="page">
      <MoonTab now={now} timeZone={timeZone} southern={state.southern} />
      <SabbatsTab
        now={now}
        timeZone={timeZone}
        southern={state.southern}
        onSouthern={(on) =>
          setState((current) => ({ ...current, southern: on }))
        }
      />
    </main>
  );
};

export default MoonAndSabbats;
