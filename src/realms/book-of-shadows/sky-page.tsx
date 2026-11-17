import { SkyTab } from "./sky-tab";
import { useBook } from "./use-book";

/** Where the planets are now. */
const Sky = () => {
  const { now, timeZone } = useBook();

  return (
    <main className="page">
      <SkyTab now={now} timeZone={timeZone} />
    </main>
  );
};

export default Sky;
