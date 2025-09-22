(() => {
  const tz = "America/New_York";
  const today = new Date();
  const weeksEl = document.getElementById("weeks");
  const classInput = document.getElementById("classFilter");
  const courseList = document.getElementById("courseList");

  const icon = (k) =>
    ({
      watch: "📺",
      read: "📖",
      consider: "💭",
      post: "📝",
      project: "🧠",
      optional: "✨",
      info: "ℹ️",
      deadline: "⏰",
    }[k] || "•");
  const getState = () =>
    JSON.parse(localStorage.getItem("worktodo.v1") || "{}");
  const setState = (s) =>
    localStorage.setItem("worktodo.v1", JSON.stringify(s));

  const ymdToday = () => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const formatDateYMD = (ymd) =>
    new Date(ymd + "T00:00:00").toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  const isSoon = (ymd) => {
    const d = new Date(ymd + "T00:00:00");
    const diff = (d - today) / 86400000;
    return diff >= 0 && diff <= 7;
  };

  const importFileBtn = document.getElementById("importICSFile");

  // simple persistence for imported UID set
  const getImported = () =>
    JSON.parse(localStorage.getItem("worktodo.importedUIDs") || "[]");
  const setImported = (uids) =>
    localStorage.setItem("worktodo.importedUIDs", JSON.stringify(uids));

  // hook up ICS file import
  importFileBtn.addEventListener("click", () =>
    document.getElementById("icsFile").click()
  );
  document.getElementById("icsFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let startDate = prompt("Enter start date (YYYY-MM-DD) to import from:", "");
    if (startDate) {
      startDate = startDate.trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        alert("Invalid date format. Please use YYYY-MM-DD.");
        return;
      }
    }
    const { weeksAdded, tasksAdded, uids } = window.importICSFromText(
      text,
      "myCourses",
      startDate
    );
    setImported([...new Set([...getImported(), ...uids])]);
    alert(`Imported ${tasksAdded} task(s) across ${weeksAdded} week(s).`);
    render();
  });

  // Table of course URLs for myCourses 
  // 1160862
  const COURSEID = {
    'Games & Lit': '1166199',
    'Sci & Tech Policies': '1162195',
    'Data Journalism': '1164981',
    'AI in Society': '1167927',
    'Language of Medicine': '1162213',
    'Soc Conseq Tech': '1160862',
  };

  function allCourses() {
    const set = new Set();
    for (const w of window.WEEKS) {
      for (const it of w.items) {
        if (it.course) set.add(it.course);
      }
    }
    return Array.from(set).sort();
  }
  function populateCourseList() {
    courseList.innerHTML = "";
    for (const c of allCourses()) {
      const opt = document.createElement("option");
      opt.value = c;
      courseList.appendChild(opt);
    }
  }

  // Add toggle for hiding/showing completed articles
  // Persist completed/collapsed toggles in localStorage
  function getToggles() {
    return JSON.parse(localStorage.getItem("worktodo.toggles") || "{}");
  }
  function setToggles(toggles) {
    localStorage.setItem("worktodo.toggles", JSON.stringify(toggles));
  }
  const toggles = getToggles();
  let showCompletedArticles = toggles.showCompletedArticles !== undefined ? toggles.showCompletedArticles : true;
  let expanded = toggles.expanded !== undefined ? toggles.expanded : true;
  const toggleCompletedBtn = document.createElement('button');
  toggleCompletedBtn.textContent = 'Hide Completed Weeks';
  toggleCompletedBtn.onclick = () => {
    showCompletedArticles = !showCompletedArticles;
    toggleCompletedBtn.textContent = showCompletedArticles ? 'Hide Completed Weeks' : 'Show Completed Weeks';
    setToggles({
      ...getToggles(),
      showCompletedArticles,
      expanded
    });
    render();
  };
  document.addEventListener('DOMContentLoaded', () => {
    const controlsDiv = document.querySelector('.controls');
    if (controlsDiv) {
      controlsDiv.insertBefore(toggleCompletedBtn, controlsDiv.firstChild);
    }
  });

  function render() {
    populateCourseList();
    weeksEl.innerHTML = "";
    const state = getState();
    const filter = document.querySelector(".tag.active")?.dataset.filter || "";
    const classQuery = (classInput.value || "").trim().toLowerCase();

    let anyWeekShown = false;
    for (const w of window.WEEKS) {
      const isPast = new Date(w.date + "T00:00:00") < today;
      const isToday = w.date === ymdToday();
      const soon = isSoon(w.date);

      // Filter tasks for this week
      const filteredTasks = w.items.filter((it) => {
        if (filter === "past" && !isPast) return false;
        if (classQuery && !(it.course || "").toLowerCase().includes(classQuery))
          return false;
        return true;
      });
      const done = filteredTasks.every((it) => !!state[it.id]);
      if (!showCompletedArticles && done) continue;
      anyWeekShown = true;

      const week = document.createElement("article");
      week.className = "week" + (isToday ? " current" : "") + (done ? " done" : "");

      const open = filteredTasks.some(it => !state[it.id]);
      const badges = [];
      // Only add one badge: Due Soon if soon, otherwise Open if open, but not Open if Overdue
      if (soon) {
        badges.push('<span class="pill warn">Due Soon</span>');
      } else if (open && !isPast) {
        badges.push('<span class="pill good">Open</span>');
      }
      if (done) badges.push('<span class="pill ok">Done</span>');
  if (isPast && open && !isToday) badges.push('<span class="pill danger">Overdue</span>');
      if (isToday) badges.push('<span class="pill ok">Today</span>');

      const openByDefault = soon || isToday || (!isPast && filter !== "past");
      const allChecked = filteredTasks.length > 0 && filteredTasks.every(it => !!state[it.id]);
          week.innerHTML = `
            <details ${openByDefault ? "open" : ""}>
              <summary>
                <header>
                  <div class="week-header-grid">
                    <h2 style="margin:0;grid-area:title;">${formatDateYMD(w.date)}</h2>
                    <label style="user-select:none;grid-area:checkbox;">
                      <input type="checkbox" class="toggle-all" ${allChecked ? "checked" : ""} aria-label="Check/uncheck all">
                    </label>
                    <div class="meta" style="grid-area:items;margin-top:0.25em;"><span class="stat">${filteredTasks.length} item(s)</span></div>
                    <div class="badges" style="grid-area:status;">${badges.join("")}</div>
                  </div>
                </header>
              </summary>
              <div class="items"></div>
            </details>`;

      // Wire up check/uncheck all logic
      week.querySelector('.toggle-all').addEventListener('change', (e) => {
        const checked = e.target.checked;
        const s = getState();
        for (const it of filteredTasks) {
          if (checked) s[it.id] = true;
          else delete s[it.id];
        }
        setState(s);
        render();
      });

      const itemsEl = week.querySelector(".items");

      for (const it of filteredTasks) {
        const done = !!state[it.id];
        const row = document.createElement("div");
        row.className = "task" + (done ? " done" : "");
        // Make class pill clickable and link to myCourses if available
        let classPill = "";
        if (it.course && COURSEID[it.course]) {
          classPill = `<a href="https://mycourses.rit.edu/course/d2l/le/content/${COURSEID[it.course]}/Home" class="course" style="text-decoration:none;" target="_blank" rel="noopener">${it.course}</a>`;
        } else if (it.course) {
          classPill = `<span class="course">${it.course}</span>`;
        }
        const link = it.url
          ? `<a href="${it.url}" target="_blank" rel="noopener">${it.title}</a>`
          : `<span class="title">${it.title}</span>`;
        row.innerHTML = `
          <input type="checkbox" id="${it.id}" ${
          done ? "checked" : ""
        } aria-label="toggle ${it.title}">
          <div>
            <div class="title">${icon(it.kind)} ${link} ${classPill}</div>
            ${it.note ? `<div class="note">${it.note}</div>` : ""}
            <small>${it.kind.charAt(0).toUpperCase() + it.kind.slice(1)}</small>
          </div>`;
        row.querySelector("input").addEventListener("change", (e) => {
          const s = getState();
          if (e.target.checked) s[it.id] = true;
          else delete s[it.id];
          setState(s);
          render();
        });
        itemsEl.appendChild(row);
      }

      weeksEl.appendChild(week);
    }
    // If no weeks are shown, show all weeks regardless of toggle
    if (!anyWeekShown) {
      weeksEl.innerHTML = "";
      for (const w of window.WEEKS) {
        const isPast = new Date(w.date + "T00:00:00") < today;
        const isToday = w.date === ymdToday();
        const soon = isSoon(w.date);
        const filteredTasks = w.items.filter((it) => true);
        const done = filteredTasks.every((it) => !!state[it.id]);
        const week = document.createElement("article");
        week.className = "week" + (isToday ? " current" : "") + (done ? " done" : "");
        // ...existing code for badges, header, items...
        // For brevity, you may want to refactor this into a helper function
        // ...existing code...
        weeksEl.appendChild(week);
      }
    }

    updateProgress();
  }

  function updateProgress() {
    const total = window.WEEKS.reduce((n, w) => n + w.items.length, 0);
    const done = Object.keys(getState()).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    document.getElementById("fill").style.width = pct + "%";
    document.getElementById(
      "stat"
    ).textContent = `${done} of ${total} done (${pct}%)`;
  }

  document.querySelectorAll(".tag").forEach((t) =>
    t.addEventListener("click", () => {
      document
        .querySelectorAll(".tag")
        .forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      render();
    })
  );

  let tHandle;
  classInput.addEventListener("input", () => {
    clearTimeout(tHandle);
    tHandle = setTimeout(render, 150);
  });

  document.getElementById("exportProgress").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "work-open-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById("downloadICS").addEventListener("click", () => {
    const ics = window.buildICS(window.WEEKS, window.HARD_DEADLINES);
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "games-lit-key-dates.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Move Hide Completed checkbox into .controls
  const controlsDiv = document.querySelector('.controls');
  const hideCompletedLabel = document.createElement('label');
  hideCompletedLabel.style.display = 'flex';
    // Move Hide Completed Weeks button into .controls, replacing the checkbox
    // Use the already declared toggleCompletedBtn from above
    // Move Hide Completed Weeks button to the top of controls
    controlsDiv.insertBefore(toggleCompletedBtn, controlsDiv.firstChild);

  // Replace Expand All and Collapse All with a single toggle button
  // let expanded = true; // Remove redeclaration, use the one from above
  const expandToggleBtn = document.createElement('button');
  expandToggleBtn.textContent = 'Collapse All';
  expandToggleBtn.onclick = () => {
    expanded = !expanded;
    expandToggleBtn.textContent = expanded ? 'Collapse All' : 'Expand All';
    setToggles({
      ...getToggles(),
      showCompletedArticles,
      expanded
    });
    document.querySelectorAll('.week details').forEach(d => {
      if (expanded) d.setAttribute('open', '');
      else d.removeAttribute('open');
    });
  };
  // Remove old buttons and add new toggle
  const expandBtn = document.getElementById('expandAll');
  const collapseBtn = document.getElementById('collapseAll');
  if (expandBtn) expandBtn.remove();
  if (collapseBtn) collapseBtn.remove();
  controlsDiv.insertBefore(expandToggleBtn, controlsDiv.firstChild);

  render();
})();
