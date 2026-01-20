// calendar_api.js

const CLIENT_ID = CONFIG.CLIENT_ID_KEY;
const API_KEY = CONFIG.API_KEY;
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const PEOPLE_DISCOVERY_DOC = "https://www.googleapis.com/piper/v1/discover/people.json";
let tokenClient;
let gapiLoaded = false;
let gisLoaded = false;
let initialized = false;
let isSignedIn = false;
let resolveSignInPromise;


import { renderCalendarSelector } from "./ui.js";
import "./config.js";

/*
export function initGoogleAuth() {
  return new Promise((resolve) => {
    gapi.load("client", async () => {
      await gapi.client.init({
        apiKey: API_KEY,
       });
      gapiLoaded = true;
      maybeReady(resolve);
    });

    // Init OAuth token client
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      callback: async (tokenResponse) => {
        console.log("✅ Signed in with Google");
        gapi.client.setToken(tokenResponse);
        resolve();
        //await renderCalendarSelector();
      },
    });
    tokenClient.requestAccessToken({ prompt: "consent" });

    gisLoaded = true;
    maybeReady(resolve);
  });
}
*/

export function loadGoogleApis() {
  return new Promise((resolve) => {
    gapi.load("client", async () => {
      await gapi.client.init({ apiKey: API_KEY });
      resolve();
    });

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      callback: (tokenResponse) => {
        if (!tokenResponse || !tokenResponse.access_token) {
          isSignedIn = false;
          return;
        }

        // --- PERSISTENCE LOGIC ---
        localStorage.setItem('google_access_token', tokenResponse.access_token);
        // Save expiry (current time + expires_in seconds)
        const expiry = Date.now() + (tokenResponse.expires_in * 1000);
        localStorage.setItem('token_expiry', expiry);
        // -------------------------

        gapi.client.setToken(tokenResponse);
        isSignedIn = true;

        console.log("✅ OAuth callback fired & saved to storage");
        
        // Resolve the promise that signIn() is waiting for
        if (resolveSignInPromise) resolveSignInPromise(tokenResponse);
      },
    });
  });
}

export function signIn({ interactive = false } = {}) {
  return new Promise((resolve, reject) => {
    const storedToken = localStorage.getItem('google_access_token');
    const expiry = localStorage.getItem('token_expiry');

    // 1. Check if we have a valid non-expired token in storage
    if (storedToken && expiry && Date.now() < expiry) {
      console.log("✅ Found valid session in storage, skipping popup");
      
      const tokenObj = { access_token: storedToken };
      gapi.client.setToken(tokenObj);
      isSignedIn = true;
      
      resolve(tokenObj); 
      return; // Exit here, do not run the code below
    }

    // 2. If no valid token, we proceed with the Google Auth flow
    console.log("ℹ️ No valid session, requesting new token...");
    resolveSignInPromise = resolve; // Store resolve to be called by the tokenClient callback

    tokenClient.requestAccessToken({
      prompt: interactive ? "consent" : ""
    });
  });
}



function updateAuthUI(signedIn) {
  document.getElementById("signin-btn").hidden = signedIn;
  document.getElementById("signout-msg").hidden = !signedIn;
}


export async function initCalendarApi() {
  if (initialized) return;

  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC, PEOPLE_DISCOVERY_DOC],
  });

  // Re-apply the token if we have one, just in case .init() cleared it
  const storedToken = localStorage.getItem('google_access_token');
  if (storedToken) {
    gapi.client.setToken({ access_token: storedToken });
  }

  initialized = true;
  console.log("✅ Calendar API initialized");
}

/*export async function getEvents(timeMin, timeMax) {
    
  await initCalendarApi(); 
    
  const response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.result.items || [];
} */

export async function getEventsForCalendars(
  calendarIds,
  timeMin,
  timeMax
) {
  await initCalendarApi();
  const ids = Array.from(calendarIds);

  const requests = calendarIds.map(id =>
    gapi.client.calendar.events.list({
      calendarId: id,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    })
  );

  const responses = await Promise.all(requests);
  return responses.flatMap(res => res.result.items || []);
}


export async function getUserCalendars() {
  console.log("Fetching calendars")
  const response = await gapi.client.calendar.calendarList.list();
  return response.result.items;
}

function maybeReady(resolve) {
  if (gapiLoaded && gisLoaded) resolve();
}

export function signInWithGoogle() {
  tokenClient.requestAccessToken({ prompt: "consent" });
}
