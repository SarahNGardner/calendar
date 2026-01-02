import {
  renderCalendar,
  previousMonth,
  nextMonth,
  showTodayDate,
  renderCurrentWeek,
  previousWeek,
  nextWeek
} from "./calendar.js";

import { initGoogleAuth, signInWithGoogle } from "./calendar_api.js";
import { renderCalendarSelector } from "./ui.js";



// MONTH NAV BUTTONS
document.getElementById("prev").addEventListener("click", previousMonth);
document.getElementById("next").addEventListener("click", nextMonth);

// WEEK NAV BUTTONS
document.getElementById("prev-week").addEventListener("click", previousWeek);
document.getElementById("next-week").addEventListener("click", nextWeek);



// Initial default render
renderCalendar();

//Google Login

  //await initGoogleAuth();

document.addEventListener("DOMContentLoaded", async () => {
  await initGoogleAuth();

  document
    .getElementById("google-signin")
    .addEventListener("click", signInWithGoogle);
});

