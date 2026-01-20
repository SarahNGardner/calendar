import {
  renderCalendar,
  previousMonth,
  nextMonth,
  showTodayDate,
  renderCurrentWeek,
  previousWeek,
  nextWeek
} from "./calendar.js";

const signOutBtn = document.getElementById('google-signout');

import { loadGoogleApis, signInWithGoogle, signIn, initCalendarApi, getUserInfo, signOut} from "./calendar_api.js";
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
    await signIn();
      
    signOutBtn.style.display = 'block';
    signOutBtn.onclick = signOut;  
      
    await initCalendarApi();
    
    // FETCH AND SHOW USER
    const user = await getUserInfo();
    if (user) {
       console.log(`Signed in as: ${user.name} (${user.email})`);
       const profileContainer = document.getElementById('user-profile');
       profileContainer.style.display = 'flex';
       document.getElementById('user-avatar').src = user.picture;
       // Example: document.getElementById('user-display').innerText = `Hello, ${user.given_name}`;
    }

    await renderCalendarSelector();
    //hideSignInButton();
  } catch (err) {
    console.log("ℹ️ Not signed in yet", err);
    //showSignInButton();
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
