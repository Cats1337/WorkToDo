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

  const importBtn = document.getElementById("importICS");
  const importFileBtn = document.getElementById("importICSFile");
  const icsUrlInput = document.getElementById("icsUrl");

  // simple persistence for imported UID set
  const getImported = () =>
    JSON.parse(localStorage.getItem("worktodo.importedUIDs") || "[]");
  const setImported = (uids) =>
    localStorage.setItem("worktodo.importedUIDs", JSON.stringify(uids));

  // hook up ICS URL import
  importBtn.addEventListener("click", async () => {
    const url = (icsUrlInput.value || "").trim();
    if (!url) return alert("Paste a valid .ics URL");
    try {
      const { weeksAdded, tasksAdded, uids } = await window.importICSFromUrl(
        url,
        "myCourses"
      );
      setImported([...new Set([...getImported(), ...uids])]);
      alert(`Imported ${tasksAdded} task(s) across ${weeksAdded} week(s).`);
      render();
    } catch (e) {
      console.error(e);
      alert(
        "Import failed. Some .ics URLs block CORS. Use the file import if needed."
      );
    }
  });

  // hook up ICS file import
  importFileBtn.addEventListener("click", () =>
    document.getElementById("icsFile").click()
  );
  document.getElementById("icsFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const { weeksAdded, tasksAdded, uids } = window.importICSFromText(
      text,
      "myCourses"
    );
    setImported([...new Set([...getImported(), ...uids])]);
    alert(`Imported ${tasksAdded} task(s) across ${weeksAdded} week(s).`);
    render();
  });

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

  function render() {
    populateCourseList();
    weeksEl.innerHTML = "";
    const state = getState();
    const filter = document.querySelector(".tag.active")?.dataset.filter || "";
    const classQuery = (classInput.value || "").trim().toLowerCase();

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

      if (isPast && filteredTasks.length === 0) continue;

      const week = document.createElement("article");
      week.className = "week" + (isToday ? " current" : "");

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
        const link = it.url
          ? `<a href="${it.url}" target="_blank" rel="noopener">${it.title}</a>`
          : `<span class="title">${it.title}</span>`;
        row.innerHTML = `
          <input type="checkbox" id="${it.id}" ${
          done ? "checked" : ""
        } aria-label="toggle ${it.title}">
          <div>
            <div class="title">${icon(it.kind)} ${link} ${
          it.course ? `<span class="course">${it.course}</span>` : ""
        }</div>
            ${it.note ? `<div class="note">${it.note}</div>` : ""}
            <small>${it.kind}</small>
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

  document.getElementById("expandAll").addEventListener("click", () => {
    document
      .querySelectorAll(".week details")
      .forEach((d) => d.setAttribute("open", ""));
  });
  document.getElementById("collapseAll").addEventListener("click", () => {
    document
      .querySelectorAll(".week details")
      .forEach((d) => d.removeAttribute("open"));
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

  render();
})();
