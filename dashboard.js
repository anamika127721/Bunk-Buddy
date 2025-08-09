function goToPage(num) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById("page" + num).style.display = "block";
  }
  
  // Login with localStorage check
  function login() {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
  
    if (storedData && user === storedData.username && pass === storedData.password) {
      goToPage(4);
      document.getElementById("popup").style.display = "flex";
    } else {
      alert("Invalid credentials. Please try again or sign up first.");
    }
  }
  
  // Signup - store in localStorage
  document.getElementById("signupBtn").addEventListener("click", function() {
    const signupData = {
      username: document.getElementById("signupUsername").value.trim(),
      password: document.getElementById("signupPassword").value.trim(),
      branch: document.getElementById("branch").value.trim(),
      semester: document.getElementById("semester").value.trim(),
      gender: document.getElementById("gender").value
    };
    if (!signupData.username || !signupData.password) {
      alert("Please enter username and password.");
      return;
    }
    localStorage.setItem("userData", JSON.stringify(signupData));
    goToPage(3);
    createTimetableGrid();
  });
  
  // Create timetable grid with MON-FRI labels and 6 periods
  function createTimetableGrid() {
    const days = ["MON", "TUE", "WED", "THU", "FRI"];
    const grid = document.getElementById("timetableGrid");
    grid.innerHTML = ""; // Clear old grid if any
    grid.style.gridTemplateColumns = "repeat(7, 1fr)"; // 1 day label + 6 inputs
  
    for (let r = 0; r < days.length; r++) {
      // Day label cell
      const dayLabel = document.createElement("div");
      dayLabel.textContent = days[r];
      dayLabel.style.fontWeight = "600";
      dayLabel.style.display = "flex";
      dayLabel.style.justifyContent = "center";
      dayLabel.style.alignItems = "center";
      dayLabel.style.backgroundColor = "#ffe0cc";
      dayLabel.style.borderRadius = "8px";
      dayLabel.style.padding = "8px 0";
      grid.appendChild(dayLabel);
  
      // 6 input cells
      for (let c = 0; c < 6; c++) {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `R${r + 1}C${c + 1}`;
        grid.appendChild(input);
      }
    }
  }

   // Submit timetable - save timetable in localStorage by day name, fill empty with "NIL"
   function submitTimetable() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const grid = document.getElementById("timetableGrid");
    const inputs = grid.querySelectorAll("input");
  
    const timetable = {};
  
    for (let r = 0; r < days.length; r++) {
      timetable[days[r]] = [];
      for (let c = 0; c < 6; c++) {
        const idx = r * 6 + c;
        let val = inputs[idx].value.trim();
        if (!val) {
          val = "NIL";
          inputs[idx].value = val;
          inputs[idx].style.backgroundColor = "#f0f0f0";
        }
        timetable[days[r]].push(val);
      }
    }
  
    localStorage.setItem("timetable", JSON.stringify(timetable));
  
    goToPage(4);
    document.getElementById("popup").style.display = "flex";
  }
  
  
  // Submit timetable - save timetable in localStorage by day name, fill empty with "NIL"
  function submitTimetable() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const grid = document.getElementById("timetableGrid");
    const inputs = grid.querySelectorAll("input");
  
    const timetable = {};
  
    for (let r = 0; r < days.length; r++) {
      timetable[days[r]] = [];
      for (let c = 0; c < 6; c++) {
        const idx = r * 6 + c;
        let val = inputs[idx].value.trim();
        if (!val) {
          val = "NIL";
          inputs[idx].value = val;
          inputs[idx].style.backgroundColor = "#f0f0f0";
        }
        timetable[days[r]].push(val);
      }
    }
  
    localStorage.setItem("timetable", JSON.stringify(timetable));
  
    goToPage(4);
    document.getElementById("popup").style.display = "flex";
  }
  
  // Close popup
  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }
  
  // Initialize: start at login page and create timetable grid for page 3
  goToPage(1);
  createTimetableGrid();
  
  function showSubjectsForDay() {
    // Map short day to full day name matching keys in timetable
    const dayMap = {
      "MON": "Monday",
      "TUE": "Tuesday",
      "WED": "Wednesday",
      "THU": "Thursday",
      "FRI": "Friday"
    };
  
    const dayShort = document.getElementById("daySelect").value;
    if (!dayShort || !dayMap[dayShort]) {
      alert("Please select a valid day.");
      return;
    }
  
    const dayFull = dayMap[dayShort];
    const timetable = JSON.parse(localStorage.getItem("timetable"));
    if (!timetable || !timetable[dayFull]) {
      alert("No timetable data found for " + dayFull);
      return;
    }
  
    const subjects = timetable[dayFull];
    const tbody = document.querySelector("#subjectsTable tbody");
    tbody.innerHTML = "";  // Clear any previous rows
  
    // Fill table rows with period number and subject
    subjects.forEach((subject, index) => {
      const tr = document.createElement("tr");
  
      const periodTd = document.createElement("td");
      periodTd.textContent = index + 1;  // Period number starting at 1
  
      const subjectTd = document.createElement("td");
      subjectTd.textContent = subject;
  
      tr.appendChild(periodTd);
      tr.appendChild(subjectTd);
      tbody.appendChild(tr);
      addSubjectClickListeners();
    });
  }
  
  function addSubjectClickListeners() {
    const subjectCells = document.querySelectorAll("#subjectsTable tbody td:nth-child(2)");
    subjectCells.forEach(td => {
      td.addEventListener("click", () => {
        td.classList.toggle("present");
      });
    });
  }
  
  let bunkPercentage = parseInt(localStorage.getItem("bunkPercentage")) || 0;

function addSubjectClickListeners() {
  const subjectCells = document.querySelectorAll("#subjectsTable tbody td:nth-child(2)");
  subjectCells.forEach(td => {
    td.addEventListener("click", () => {
      td.classList.toggle("present");
      if (td.classList.contains("present")) {
        bunkPercentage += 5; // increase by 5%
      } else {
        bunkPercentage -= 5; // decrease by 5% if unselected
      }
      // Keep it between 0 and 100
      bunkPercentage = Math.max(0, Math.min(100, bunkPercentage));
    });
  });
}

const excuses = [
    "My dog ate my timetable.",
    "I was abducted by aliens 👽",
    "Heavy rains... inside my room ☔",
    "Overslept while thinking about attending.",
    "My WiFi refused to let me leave the house."
];
function generateExcuse() {
    let excuse = excuses[Math.floor(Math.random() * excuses.length)];
    typeWriter("excuse", excuse);
}

function bunkForecast() {
    let chance = Math.floor(Math.random() * 100) + 1;
    let icon = chance > 70 ? "☀️" : chance > 40 ? "⛅" : "🌧️";
    let message = `Today's bunk chance: ${chance}% ${icon}`;
    typeWriter("forecast", message);
}

function analyzeMood() {
    const moods = [
        "Ghost of Classroom 👻",
        "Occasional Visitor 🚌",
        "Teacher’s Pet 🍎",
        "Netflix Scholar 📺"
    ];
    let mood = moods[Math.floor(Math.random() * moods.length)];
    typeWriter("mood", `Your current mood: ${mood}`);
}

function typeWriter(elementId, text) {
    let element = document.getElementById(elementId);
    element.textContent = "";
    let i = 0;
    let interval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i > text.length) clearInterval(interval);
    }, 50);
}