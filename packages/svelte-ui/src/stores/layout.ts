import { restore, createEvent } from "effector";

const MOBILE_BREAKPOINT = 800;

type Layout = "mobile" | "desktop";

const match = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
function getLayout({ matches }) {
  return matches ? "mobile" : "desktop";
}

const updateLayout = createEvent<Layout>();
const layout$ = restore<Layout>(updateLayout, getLayout(match));

match.addEventListener("change", (m) => updateLayout(getLayout(m)));

export { layout$ };
