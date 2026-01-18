// calendar_api.js

const CLIENT_ID = CONFIG.CLIENT_ID_KEY;
const API_KEY = CONFIG.API_KEY;
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
let tokenClient;
let gapiLoaded = false;
let gisLoaded = false;
let initialized = false;

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
      callback: () => {
        console.log("✅ OAuth callback fired");
      },
    });
  });
}

export function signIn() {
  return new Promise((resolve) => {
    tokenClient.callback = (tokenResponse) => {
      gapi.client.setToken(tokenResponse);
      console.log("✅ Token set");
      resolve();
    };
    tokenClient.requestAccessToken({ prompt: "consent" });
  });
}



export async function initCalendarApi() {
  if (initialized) return;

  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });

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
