// calendar.js
import { getEventsForCalendars } from "./calendar_api.js"; // keep this if needed

// ---------- MONTHLY CALENDAR ----------

export let currentDate = new Date();

export function renderCalendar(date = currentDate) {
  const daysContainer = document.getElementById("days");
  const monthYear = document.getElementById("month-year");

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthName = date.toLocaleString("default", { month: "long" });
  monthYear.textContent = `${monthName} ${year}`;

  daysContainer.innerHTML = "";

  // Leading blanks
  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement("div");
    daysContainer.appendChild(blank);
  }

  // Actual days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;

    
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    daysContainer.appendChild(dayDiv);
  }
}

export function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

export function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

export function showTodayDate() {
  const today = new Date();
  const formatted = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("today-date").textContent = formatted;
}

// ---------- WEEKLY VIEW ----------

export let currentWeekStart = getStartOfWeek(new Date());

export function getStartOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay(); // Sunday = 0
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export async function renderWeek(startDate = currentWeekStart) {
  const weekDaysContainer = document.getElementById("week-days");
  const weekRange = document.getElementById("week-range");

  weekDaysContainer.innerHTML = "";

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  weekRange.textContent =
    `${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}`;

  // 1️⃣ Fetch events
const events = await getEventsForCalendars(
  [...selectedCalendarIds],
  startDate.toISOString(),
  endDate.toISOString()
);

  console.log("Selected calendars:", [...selectedCalendarIds]);

  console.log("Google events:", events);


  const eventsByDate = groupEventsByDate(events);

  for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day-cell");

      const dateLabel = document.createElement("div");
      dateLabel.textContent = day.getDate();
      dateLabel.classList.add("date-label");
      dayDiv.appendChild(dateLabel);

      // 🔹 Filter events for this day
      const dayEvents = events.filter(event => {
        const eventStart = new Date(
          event.start.dateTime || event.start.date
        );
        return eventStart.toDateString() === day.toDateString();
      });

      // 🔹 Render events
      dayEvents.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.textContent = event.summary || "(No title)";
        dayDiv.appendChild(eventDiv);
      });

      weekDaysContainer.appendChild(dayDiv);
  }
}

export function renderCurrentWeek() {
  currentWeekStart = getStartOfWeek(new Date());
  renderWeek();
}

export function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderWeek();
}

export function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderWeek();
}

function groupEventsByDate(events) {
  return events.reduce((acc, event) => {
    const date =
      event.start.date || // all-day event
      event.start.dateTime.split("T")[0];

    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});
}

//user selected calendar
let selectedCalendarIds = new Set(["primary"]);


export function setSelectedCalendars() {
  selectedCalendarIds = new Set(
    Array.from(
      document.querySelectorAll(
        "#calendar-selector input[type=checkbox]:checked"
      )
    ).map(cb => cb.value)
  );

  renderWeek(); // refresh view
}