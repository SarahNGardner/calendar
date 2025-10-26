const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthName = date.toLocaleString("default", { month: "long" });
  monthYear.textContent = `${monthName} ${year}`;

  daysContainer.innerHTML = "";

  for (let i = 0; i < firstDay.getDay(); i++) {
    const blank = document.createElement("div");
    daysContainer.appendChild(blank);
  }

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

function showTodayDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString(undefined, options);
  document.getElementById("today-date").textContent = formattedDate;
}


prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);

function toggleColor() {
    if ( document.querySelector("#month").style.backgroundColor === "red") {
        document.querySelector("#month").style.backgroundColor = "blue";
    }
    else {
        document.querySelector("#month").style.backgroundColor = "red";
    }
 }


 function toggleView(selected) {
    const elementsToHide = document.querySelectorAll('.displays');
    elementsToHide.forEach(element => {
        element.hidden = true;
    });
    console.log("hi");
    document.getElementById(selected + "Two").hidden = false;
    
 }

////WEEK VIEW STUFF////

let currentWeekStart = getStartOfWeek(new Date());

// Helper to get the Sunday (or Monday) of a given week
function getStartOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay(); // Sunday = 0
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function renderWeek(startDate = currentWeekStart) {
  const weekDaysContainer = document.getElementById("week-days");
  const weekRange = document.getElementById("week-range");

  weekDaysContainer.innerHTML = "";

  const options = { month: "short", day: "numeric" };
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  // Display range text (e.g. "Oct 6 – Oct 12, 2025")
  const rangeText = `${startDate.toLocaleDateString(undefined, options)} – ${endDate.toLocaleDateString(undefined, options)}, ${endDate.getFullYear()}`;
  weekRange.textContent = rangeText;

  // Create 7 day cells
  for (let i = 0; i < 7; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);

    const dayDiv = document.createElement("div");
    dayDiv.textContent = day.getDate();

    // Highlight today
    const today = new Date();
    if (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    weekDaysContainer.appendChild(dayDiv);
  }
}

function previousWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderWeek();
}

function nextWeek() {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderWeek();
}

function renderCurrentWeek() {
  currentWeekStart = getStartOfWeek(new Date());
  renderWeek();
}



 ///TESTING///
