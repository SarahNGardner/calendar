// calendar_api.js

const CLIENT_ID = MY_CLIENT_ID
const API_KEY = MY_API_KEY
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
let tokenClient;
let gapiLoaded = false;
let gisLoaded = false;
let initialized = false;

import { renderCalendarSelector } from "./ui.js";


export function initGoogleAuth() {
  return new Promise((resolve) => {
    // Load GAPI client
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

        // 🔑 Attach token to gapi
        gapi.client.setToken(tokenResponse);

        // 🔑 Now safe to render UI
        await renderCalendarSelector();
      },
    });

    gisLoaded = true;
    maybeReady(resolve);
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
  const response = await gapi.client.calendar.calendarList.list();
  return response.result.items;
}

function maybeReady(resolve) {
  if (gapiLoaded && gisLoaded) resolve();
}

export function signInWithGoogle() {
  tokenClient.requestAccessToken({ prompt: "consent" });
}
