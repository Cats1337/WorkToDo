(function(){
  function dtstamp(){
    const pad = n => String(n).padStart(2,'0');
    const d = new Date();
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z';
  }
  const toICSDate = dtLocalISO => dtLocalISO.replace(/[-:]/g,'').slice(0,15);

  window.buildICS = (WEEKS, HARD_DEADLINES) => {
    const lines = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//WorkToDo//GamesLit//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH'
    ];
    for(const w of WEEKS){
      lines.push('BEGIN:VEVENT');
      lines.push('UID:'+'wk-'+w.date+'@worktodo');
      lines.push('DTSTAMP:'+dtstamp());
      lines.push('SUMMARY:Weekly tasks for '+w.date);
      lines.push('DESCRIPTION:open the planner to complete tasks for this week');
      lines.push('DTSTART;TZID=America/New_York:'+toICSDate(w.date+'T09:00:00'));
      lines.push('DURATION:PT1H');
      lines.push('END:VEVENT');
    }
    for(const d of HARD_DEADLINES){
      lines.push('BEGIN:VEVENT');
      lines.push('UID:'+d.id+'@worktodo');
      lines.push('DTSTAMP:'+dtstamp());
      lines.push('SUMMARY:'+d.title);
      lines.push('DESCRIPTION:'+d.desc);
      lines.push('DTSTART;TZID=America/New_York:'+toICSDate(d.dt));
      lines.push('DURATION:PT1H');
      lines.push('PRIORITY:1');
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  };
})();
