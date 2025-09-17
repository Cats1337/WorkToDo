(function(){
  // Minimal .ics parser for VEVENT blocks
  function unfold(lines){
    const out = [];
    for(let i=0;i<lines.length;i++){
      let L = lines[i];
      while(i+1 < lines.length && (lines[i+1].startsWith(' ') || lines[i+1].startsWith('\t'))){
        L += lines[i+1].slice(1);
        i++;
      }
      out.push(L);
    }
    return out;
  }
  function parseICS(text){
    const lines = unfold(text.split(/\r?\n/));
    const events = [];
    let cur = null;

    for(const raw of lines){
      const line = raw.trim();
      if(line === 'BEGIN:VEVENT'){ cur = {}; continue; }
      if(line === 'END:VEVENT'){ if(cur) events.push(cur); cur = null; continue; }
      if(!cur) continue;

      // key;params:value
      const idx = line.indexOf(':');
      if(idx === -1) continue;
      const kv = line.slice(0, idx);
      const val = line.slice(idx+1);

      const key = kv.split(';')[0].toUpperCase();

      if(key === 'UID') cur.uid = val;
      if(key === 'SUMMARY') cur.summary = val;
      if(key === 'DESCRIPTION') cur.description = val;
      if(key === 'URL' || key === 'X-ALT-DESC') cur.url = val;

      if(key === 'DTSTART' || key === 'DTSTART;TZID'){
        cur.dtstartRaw = val;
      }
      if(key === 'DUE' || key === 'DTEND'){ // fallback if DTSTART missing
        if(!cur.dtstartRaw) cur.dtstartRaw = val;
      }
    }
    return events.filter(e => e.dtstartRaw && e.summary);
  }

  function normalizeToLocalDate(icsDt){
    // Accept forms: YYYYMMDD, YYYYMMDDTHHMMSSZ, YYYYMMDDTHHMMSS
    const s = icsDt.trim();
    if(/^\d{8}$/.test(s)){
      // all-day
      return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
    }
    // try timezone-aware
    let d;
    if(s.endsWith('Z')){
      d = new Date(
        `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(9,11)}:${s.slice(11,13)}:${s.slice(13,15)}Z`
      );
    } else if(/^\d{8}T\d{6}$/.test(s)){
      d = new Date(
        `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}T${s.slice(9,11)}:${s.slice(11,13)}:${s.slice(13,15)}`
      );
    } else {
      // last resort
      d = new Date(s);
    }
    if(isNaN(d)) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const da = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${da}`;
    // We ignore clock time since your planner groups by day
  }

  function ensureWeek(weeks, ymd){
    let wk = weeks.find(w => w.date === ymd);
    if(!wk){
      wk = { date: ymd, label: ymd, items: [] };
      weeks.push(wk);
      // keep weeks sorted
      weeks.sort((a,b) => a.date.localeCompare(b.date));
      return { week: wk, created: true };
    }
    return { week: wk, created: false };
  }

  // Convert events to your task shape and merge
  function mergeEventsIntoWeeks(weeks, events, courseLabel){
    const beforeWeeks = weeks.length;
    let tasksAdded = 0;
    const importedUIDs = [];

    for(const ev of events){
      const ymd = normalizeToLocalDate(ev.dtstartRaw);
      if(!ymd) continue;

      const { week, created } = ensureWeek(weeks, ymd);

      // skip duplicates by UID if already present in this week
      const exists = week.items.some(it => it.uid === ev.uid);
      if(exists) continue;

      const title = ev.summary;
      const url = ev.url || null;
      const note = ev.description ? ev.description.substring(0, 500) : null;

      // id for localStorage: prefix with uid if present, else summary+date
      const idBase = ev.uid || `${title}-${ymd}`;
      const safeId = idBase.replace(/[^a-z0-9_-]/gi,'').toLowerCase();

      const task = {
        id: `ics-${safeId}`,
        kind: 'deadline',
        title,
        url,
        note,
        course: courseLabel || 'myCourses',
        uid: ev.uid || null
      };

      week.items.push(task);
      tasksAdded++;
      if(ev.uid) importedUIDs.push(ev.uid);
    }

    return {
      weeksAdded: weeks.length - beforeWeeks,
      tasksAdded,
      uids: importedUIDs
    };
  }

  function importICSFromText(text, courseLabel, startDate) {
    const events = parseICS(text);
    let filteredEvents = events;
    if (startDate) {
      filteredEvents = events.filter(ev => {
        const ymd = normalizeToLocalDate(ev.dtstartRaw);
        return ymd && ymd >= startDate;
      });
    }
    return mergeEventsIntoWeeks(window.WEEKS, filteredEvents, courseLabel);
  }

  window.importICSFromText = importICSFromText;
})();
