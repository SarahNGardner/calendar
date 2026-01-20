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
import { renderCalendarSelector, showCalendarOptions } from "./ui.js";



// MONTH NAV BUTTONS
document.getElementById("prev").addEventListener("click", previousMonth);
document.getElementById("next").addEventListener("click", nextMonth);

// WEEK NAV BUTTONS
document.getElementById("prev-week").addEventListener("click", previousWeek);
document.getElementById("next-week").addEventListener("click", nextWeek);

//Show Calendars
document.getElementById("show-calendar-selector").addEventListener("click", showCalendarOptions)
// Initial default render
renderCalendar();

async function bootstrap() {
  await loadGoogleApis();

  try {
    // Attempt silent sign-in
    await signIn();

    await initCalendarApi();
    await renderCalendarSelector();

    hideSignInButton();
  } catch {
    console.log("ℹ️ Not signed in yet");
    showSignInButton();
  }
}

bootstrap();

function showSignInButton() {
document.getElementById("google-signin").addEventListener("click", async () => {
  try {
    await signIn({ interactive: true });

    await initCalendarApi();
    await renderCalendarSelector();

    hideSignInButton();
  } catch (err) {
    console.error("Sign-in failed", err);
  }
});
}

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
