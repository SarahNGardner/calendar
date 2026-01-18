import {
  renderCalendar,
  previousMonth,
  nextMonth,
  showTodayDate,
  renderCurrentWeek,
  previousWeek,
  nextWeek
} from "./calendar.js";

import { loadGoogleApis, signInWithGoogle, signIn, initCalendarApi} from "./calendar_api.js";
import { renderCalendarSelector } from "./ui.js";



// MONTH NAV BUTTONS
document.getElementById("prev").addEventListener("click", previousMonth);
document.getElementById("next").addEventListener("click", nextMonth);

// WEEK NAV BUTTONS
document.getElementById("prev-week").addEventListener("click", previousWeek);
document.getElementById("next-week").addEventListener("click", nextWeek);



// Initial default render
renderCalendar();

async function bootstrap() {
  await loadGoogleApis();       // load gapi + GIS
  await signIn();       // load gapi + GIS
  await initCalendarApi();      // load Calendar API
  await renderCalendarSelector(); // now safe
}

bootstrap();

//Google Login

  //await initGoogleAuth();
/*
document.addEventListener("DOMContentLoaded", async () => {
  await initGoogleAuth();

  document
    .getElementById("google-signin")
    .addEventListener("click", signInWithGoogle);
});
*/
