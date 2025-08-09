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
      submitTimetable[days[r]] = [];
      for (let c = 0; c < 6; c++) {
        const idx = r * 6 + c;
        let val = inputs[idx].value.trim();
        if (!val) {
          val = "NIL";
          inputs[idx].value = val;
          inputs[idx].style.backgroundColor = "#f0f0f0";
        }
        submitTimetable[days[r]].push(val);
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
  