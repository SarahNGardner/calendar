// ui.js
import {
  renderCalendar,
  previousMonth,
  nextMonth,
  showTodayDate,
  renderCurrentWeek,
  previousWeek,
  nextWeek,
  renderWeek
} from "./calendar.js";

import { getUserCalendars } from "./calendar_api.js";
import { setSelectedCalendars } from "./calendar.js";



export function toggleColor() {
  const monthEl = document.querySelector("#month");
  monthEl.style.backgroundColor =
    monthEl.style.backgroundColor === "red" ? "blue" : "red";
}

export function toggleView(selected) {
  const elementsToHide = document.querySelectorAll('.displays');
  elementsToHide.forEach(el => el.hidden = true);
  console.log(document.getElementById(selected + "Two"))
  document.getElementById(selected + "Two").hidden = false;
}

document.getElementById("monthly").addEventListener("click", () => toggleView("monthly"));

document.getElementById("weekly").addEventListener("click", async () => {
  toggleView("weekly");
  await renderWeek();
});

document.getElementById("daily").addEventListener("click", () => {
    toggleView("daily");
    showTodayDate();
});


//calendar selector
export async function renderCalendarSelector() {
  const container = document.getElementById("calendar-selector");
  container.innerHTML = "";

  const calendars = await getUserCalendars();

  calendars.forEach(cal => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = cal.primary; // default
    checkbox.value = cal.id;

    checkbox.addEventListener("change", () => {
      setSelectedCalendars();
    });

    const colorDot = document.createElement("span");
    colorDot.style.backgroundColor = cal.backgroundColor;
    colorDot.style.display = "inline-block";
    colorDot.style.width = "10px";
    colorDot.style.height = "10px";
    colorDot.style.borderRadius = "50%";
    colorDot.style.marginRight = "6px";

    label.appendChild(checkbox);
    label.appendChild(colorDot);
    label.append(cal.summary);

    container.appendChild(label);
  });
}


