// data.js
// Multiple courses + easy week/task helpers

const TZ = 'America/New_York';
const T = (id, kind, title, url = null, note = null, course = null) =>
  ({ id, kind, title, url, note, course });

const WEEKS = [];          // will be filled by add()
const HARD_DEADLINES = []; // global due dates across courses

function ensureWeek(ymd) {
  let w = WEEKS.find(x => x.date === ymd);
  if (!w) {
    w = { date: ymd, label: ymd, items: [] };
    WEEKS.push(w);
    WEEKS.sort((a,b) => a.date.localeCompare(b.date));
  }
  return w;
}

// ymd: 'YYYY-MM-DD'
// course: short label used by the search box
// tasks: array of T(...)
function add(ymd, course, tasks) {
  const w = ensureWeek(ymd);
  for (const t of tasks) {
    if (!t.course) t.course = course;
    w.items.push(t);
  }
}

/* ---------------------------
   GAMES AND LITERATURE
   --------------------------- */

// 2025-08-25
add('2025-08-25', 'Games & Lit', [
  T('gl-0825-intro', 'post',
    'Introduce yourself on myCourses discussion board',
    null, 'Use the labeled board for introductions.'),
  T('gl-0825-zagal', 'read',
    'Novices, Gamers, and Scholars',
    'http://gamestudies.org/0802/articles/zagal_bruckman'),
  T('gl-0825-ebert', 'read',
    'Roger Ebert was wrong: Video Games are the new Novels',
    'http://tinyurl.com/p8q29sw'),
  T('gl-0825-gasl-notagame', 'watch',
    'Games as Lit 101: Not a Game',
    'https://www.youtube.com/watch?v=vFax_DbbJls'),
  T('gl-0825-idver', 'deadline',
    'Identity verification (choose activity or Zoom)',
    null, 'Complete this week, next week, or the week after.')
]);

// 2025-08-31
add('2025-08-31', 'Games & Lit', [
  T('gl-0831-gasl-renaming', 'watch',
    'Games as Lit Musings: Renaming the Medium',
    'https://www.youtube.com/watch?v=ah4kBeP1Cus'),
  T('gl-0831-compare-story', 'read',
    'Comparing Storytelling in Games and Literature',
    'https://simonkjones.com/comparing-storytelling-in-games-literature/#more-4806'),
  T('gl-0831-board', 'post',
    'Post twice on the board',
    null, 'One original reading reaction and one reply.'),
  T('gl-0831-idver', 'deadline',
    'Identity verification (activity or Zoom)',
    null, 'This week or next week per RIT policy.')
]);

// 2025-09-07
add('2025-09-07', 'Games & Lit', [
  T('gl-0907-rules-play-ch26', 'read',
    'Rules of Play ch.26: Games as Narrative Play (skim/outline)',
    null, 'myCourses → course materials.'),
  T('gl-0907-post', 'post',
    'Board post on literary vs game storytelling',
    null, 'Answer the prompt; reply to a classmate.'),
  T('gl-0907-p1-assign', 'info',
    'Read assignment for Paper/Project #1',
    null, 'Due 10/11 at 11:59 pm.'),
  T('gl-0907-idver', 'deadline',
    'Identity verification (final week window)')
]);

// 2025-09-14
add('2025-09-14', 'Games & Lit', [
  T('gl-0914-vid-hero', 'watch',
    "The Narrative Theory of The Hero's Journey in Video Games",
    'https://www.youtube.com/watch?v=2WSVGcx-tXw&list=PLFsxoqY93w7t4a8w6rP1y7U_ZonpKAjhK&index=1'),
  T('gl-0914-monomyth', 'read',
    'The Hero’s Journey and Monomyth: Does it work for all games?',
    'https://www.gameshub.com/news/features/the-heros-journey-and-monomyth-does-it-work-for-all-games-6670/'),
  T('gl-0914-consider', 'consider',
    'Consider how games engage the hero’s journey',
    null, 'Compare Zelda, God of War, The Last of Us, RDR2.'),
  T('gl-0914-board', 'post',
    'Post twice on the board', null, 'One reaction and one reply.')
]);

// 2025-09-21
add('2025-09-21', 'Games & Lit', [
  T('gl-0921-pairing', 'post',
    'Pick a theme pairing and post + reply',
    null, 'Survival & Humanity or Tragedy & Fate.'),
  T('gl-0921-survival', 'consider',
    'Survival & Humanity (TLoU, The Road)'),
  T('gl-0921-fate', 'consider',
    'Tragedy & Fate (Hades, Nier, Dark Souls)')
]);

// 2025-09-28
add('2025-09-28', 'Games & Lit', [
  T('gl-0928-post', 'post',
    'Reading reaction on themes, interactivity, agency',
    null, 'Optional extra credit: reply to a classmate.')
]);

// 2025-10-05
add('2025-10-05', 'Games & Lit', [
  T('gl-1005-work-p1', 'project',
    'Work on Paper/Project #1',
    null, 'Due by 10/11 11:59 pm.')
]);

// 2025-10-12
add('2025-10-12', 'Games & Lit', [
  T('gl-1012-read-int', 'read', 'Intertextuality (myCourses)'),
  T('gl-1012-read-aha', 'read', 'AHA! Intertextuality! (myCourses)'),
  T('gl-1012-read-medium', 'read',
    'Intertextuality: Designing Games & Interactive Stories',
    'https://medium.com/narrative-and-new-media/intertextuality-c86e57e033fa'),
  T('gl-1012-nopost', 'info', 'No discussion posts this week')
]);

// 2025-10-19
add('2025-10-19', 'Games & Lit', [
  T('gl-1019-vicecity', 'read',
    'Intertextuality & Video Games: Vice City',
    'https://alanabeeblog.wordpress.com/2014/01/13/intertextuality-video-games-an-analysis-of-grand-theft-auto-vice-city/'),
  T('gl-1019-gamemusic', 'watch',
    'Game Music 101: Intertextuality',
    'https://www.youtube.com/watch?v=ZEJKZj0-FaA'),
  T('gl-1019-p5r', 'watch',
    'Intertextuality in Persona 5 Royal',
    'https://www.youtube.com/watch?v=Yzodf_wP1SM'),
  T('gl-1019-what-p5', 'optional',
    'What is Persona 5', 'https://www.reddit.com/r/Persona5/comments/185jns1/what_is_persona_5/'),
  T('gl-1019-post', 'post',
    'Reading reaction + classmate reply')
]);

// 2025-10-26
add('2025-10-26', 'Games & Lit', [
  T('gl-1026-jenkins', 'read',
    'Transmedia Storytelling 101',
    'https://henryjenkins.org/blog/2007/03/transmedia_storytelling_101.html'),
  T('gl-1026-worldbuilders', 'watch',
    'The World Builders', 'https://www.youtube.com/watch?v=ZuuEGUDJm3E'),
  T('gl-1026-worldbuilding-opt', 'optional',
    'Worldbuilding in Video Games',
    'https://www.youtube.com/watch?v=dNfOQgl-wbs'),
  T('gl-1026-post', 'post',
    'Reaction: transmedia + worldbuilding',
    null, 'No classmate reply required.')
]);

// 2025-11-02
add('2025-11-02', 'Games & Lit', [
  T('gl-1102-worldbuilding', 'read',
    'Transmedia Storytelling: The Art of World Building',
    'https://www.lukefreeman.com.au/papers/transmedia-storytelling-the-art-of-world-building/'),
  T('gl-1102-update', 'post',
    'Post a two paragraph project #2 update')
]);

// 2025-11-09
add('2025-11-09', 'Games & Lit', [
  T('gl-1109-work-p2', 'project',
    'Work on Paper/Project #2', null, 'Due 11/15 11:59 pm.')
]);

// 2025-11-16
add('2025-11-16', 'Games & Lit', [
  T('gl-1116-post', 'post',
    'Reading reaction + reply', null, 'Answer one or two prompts.')
]);

// 2025-11-23
add('2025-11-23', 'Games & Lit', [
  T('gl-1123-final', 'project', 'Work on final project'),
  T('gl-1129-revisions', 'deadline',
    'Revisions for P1 and/or P2 due by 11/29')
]);

// 2025-11-30
add('2025-11-30', 'Games & Lit', [
  T('gl-1130-wrap', 'info', 'Course wrap-up, details TBA')
]);

// 2025-12-07
add('2025-12-07', 'Games & Lit', [
  T('gl-1207-final-due', 'deadline',
    'Final project due by 12/10 11:59 pm',
    null, 'Post on the showcase board.')
]);

// Global deadlines for Games & Lit
HARD_DEADLINES.push(
  { id:'gl-due-p1', title:'Games & Lit Paper/Project #1 due', dt:'2025-10-11T23:59:00', desc:'Submit by 11:59 pm ET.' },
  { id:'gl-due-p2', title:'Games & Lit Paper/Project #2 due', dt:'2025-11-15T23:59:00', desc:'Submit by 11:59 pm ET.' },
  { id:'gl-due-final', title:'Games & Lit Final Project due', dt:'2025-12-10T23:59:00', desc:'Post on the showcase board.' }
);


/* -----------------------------------------
   SOCIAL CONSEQUENCES OF TECHNOLOGY (SCT)
   ----------------------------------------- */

// Abbrev readings, you can expand notes as needed.

// Week #1 — 2025-08-25
add('2025-08-25', 'Soc Conseq Tech', [
  T('sct-0825-intro', 'info', 'First day, introductions and overview'),
  T('sct-0825-optimist', 'consider', 'Tech optimist vs pessimist vs realist'),
  T('sct-0825-oberdiek-1-8', 'read',
    'Oberdiek & Tiles, Technological Culture and its Problems (pp.1-8)')
]);

// Week #2 — 2025-09-01
add('2025-09-01', 'Soc Conseq Tech', [
  T('sct-0901-oberdiek-9-22', 'read',
    'Oberdiek & Tiles, Conflicting Visions of Technology (pp.9-22)'),
  T('sct-0901-oberdiek-23-44', 'read',
    'Oberdiek & Tiles, Facts, Values and Efficiency (pp.23-44)')
]);

// Week #3 — 2025-09-08
add('2025-09-08', 'Soc Conseq Tech', [
  T('sct-0908-marx', 'read',
    'Marx, Does Improved Technology Mean Progress? (pp.33-41)'),
  T('sct-0908-weinberg', 'read',
    'Weinberg, Can Technology Replace Social Engineering? (pp.7-10)'),
  T('sct-0908-snow', 'read',
    'Snow, Soylent and Oculus Could Fix the Prison System (pp.1-9)'),
  T('sct-0908-zuckerman', 'read',
    'Zuckerman, Perils of Using Technology to Solve Others’ Problems (pp.1-13)')
]);

// Week #4 — 2025-09-15
add('2025-09-15', 'Soc Conseq Tech', [
  T('sct-0915-winner-artifacts', 'read',
    'Winner, Do Artifacts have Politics? (pp.121-136)'),
  T('sct-0915-berry', 'read', 'Berry, Why I am not Going to Buy a Computer (pp.500-503)'),
  T('sct-0915-schumacher', 'read', 'Schumacher, Buddhist Economics (pp.56-66)')
]);

// Samples for later weeks, continue similarly:
add('2025-09-22', 'Soc Conseq Tech', [
  T('sct-0922-winner-autonomous', 'read',
    'Winner, Frankenstein’s Problem Autonomous Technology (pp.139-166)'),
  T('sct-0922-joy', 'read', 'Joy, Why the Future Doesn’t Need Us (pp.1-19)'),
  T('sct-0922-kurzweil', 'read', 'Kurzweil, Promise and Peril (pp.35-62)')
]);

add('2025-09-29', 'Soc Conseq Tech', [
  T('sct-0929-inequality-ames', 'read',
    'Ames, Laptops Alone Can’t Bridge the Digital Divide (pp.1-14)'),
  T('sct-0929-inequality-eubanks', 'read',
    'Eubanks, Automating Inequality (pp.1-13)'),
  T('sct-0929-luddism-1', 'deadline',
    'Luddism as an Epistemology Paper #1 due 10PM')
]);


/* ---------------------
   LANGUAGE OF MEDICINE
   --------------------- */

add('2025-08-25', 'Language of Medicine', [
  T('lom-0825-orientation', 'info', 'Course orientation week')
]);

add('2025-09-04', 'Language of Medicine', [
  T('lom-0904-siv', 'deadline',
    'Student Information Verification deadline 5:00 PM')
]);

// Progress markers
add('2025-09-22', 'Language of Medicine', [
  T('lom-wk4-6-apr', 'info',
    'Weeks 4–6 APRs if <10% completed')
]);
add('2025-10-13', 'Language of Medicine', [
  T('lom-wk7-progress', 'info', 'By Week 7, complete 7 chapters')
]);
add('2025-10-20', 'Language of Medicine', [
  T('lom-wk8-10-apr', 'info', 'Weeks 8–10 APRs if <30% completed')
]);
add('2025-12-11', 'Language of Medicine', [
  T('lom-1211-final', 'deadline',
    'All work and final exam due by 11:00 PM')
]);


/* ---------------
   AI IN SOCIETY
   --------------- */

add('2025-08-26', 'AI in Society', [
  T('ais-0826-welcome', 'info', 'Welcome, What is AI? What is STS?')
]);
add('2025-08-28', 'AI in Society', [
  T('ais-0828-hw1', 'deadline', 'Homework #1 (Ch.1–2)')
]);

add('2025-09-02', 'AI in Society', [
  T('ais-0902-power-hype', 'info', 'AI, power, and hype')
]);

add('2025-09-09', 'AI in Society', [
  T('ais-0909-intelligence-trust', 'info',
    'AI, intelligence, authenticity, trust'),
  T('ais-0909-hw2', 'deadline', 'Homework #2')
]);

add('2025-09-16', 'AI in Society', [
  T('ais-0916-guest-bersani', 'info',
    'Guest: Alison Bersani; Homework #3; Semester project ideas due'),
]);

add('2025-09-23', 'AI in Society', [
  T('ais-0923-automation', 'info', 'AI, automation, and people'),
  T('ais-0923-hw4', 'deadline', 'Homework #4 (Ch.3)')
]);

add('2025-10-09', 'AI in Society', [
  T('ais-1009-midterm', 'deadline', 'Midterm assignment due in class')
]);

add('2025-10-28', 'AI in Society', [
  T('ais-1028-creativity', 'info', 'AI, creativity, and copyright'),
  T('ais-1028-hw7', 'deadline', 'Homework #7 (Ch.5)')
]);

add('2025-11-04', 'AI in Society', [
  T('ais-1104-the-end', 'info', 'AI and the end?'),
  T('ais-1104-hw8', 'deadline', 'Homework #8 (Ch.6)')
]);

add('2025-11-11', 'AI in Society', [
  T('ais-1111-regulation', 'info', 'Accountability, Regulation, Rights'),
  T('ais-1111-hw9', 'deadline', 'Homework #9 (Ch.7)')
]);

add('2025-11-25', 'AI in Society', [
  T('ais-1125-presentations', 'info', 'Semester Project Presentations')
]);

add('2025-12-02', 'AI in Society', [
  T('ais-1202-presentations', 'info', 'Semester Project Presentations'),
  T('ais-1202-hw10', 'deadline', 'Homework #10')
]);


/* ----------------
   DATA JOURNALISM
   ---------------- */

add('2025-09-26', 'Data Journalism', [
  T('dj-0926-idea1', 'deadline',
    'Story-idea exercise #1 due by 11:00 a.m.',
    'https://data.ny.gov/')
]);

add('2025-10-03', 'Data Journalism', [
  T('dj-1003-viz1', 'deadline',
    'Data visualization #1 due by 11:00 a.m.')
]);

add('2025-10-24', 'Data Journalism', [
  T('dj-1024-idea2', 'deadline',
    'Story-idea exercise #2 due by 11:00 a.m.',
    'https://data.ny.gov/')
]);

add('2025-11-06', 'Data Journalism', [
  T('dj-1106-viz2', 'deadline',
    'Data visualization #2 due by 12:15 p.m.')
]);

add('2025-12-05', 'Data Journalism', [
  T('dj-1205-spotlight', 'deadline',
    'Spotlight movie essay due by 10:00 a.m.')
]);


/* ------------------------------
   SCIENCE & TECHNOLOGY POLICIES
   ------------------------------ */

add('2025-09-19', 'Sci & Tech Policies', [
  T('stp-0919-powerful', 'watch', 'Powerful: Energy for Everyone (2010)'),
  T('stp-0919-refs', 'deadline', 'Individual References Packet due')
]);

add('2025-09-22', 'Sci & Tech Policies', [
  T('stp-0922-energy-trans', 'read', 'Stokes & Breetz 2018'),
  T('stp-0922-onen-2021', 'read', 'Office of Nuclear Energy 2021')
]);

add('2025-09-26', 'Sci & Tech Policies', [
  T('stp-0926-ice-on-fire', 'watch', 'Ice on Fire (2019)'),
  T('stp-0926-aa2', 'deadline', 'Analysis Activity #2 due')
]);

add('2025-09-29', 'Sci & Tech Policies', [
  T('stp-0929-climate-env', 'read',
    'Artificial Leaf (2023), Bionic Leaf (2022), NPR CO2 Pipelines (2023), Shakelford & Mattioli (2021)')
]);

add('2025-10-03', 'Sci & Tech Policies', [
  T('stp-1003-workday', 'info', 'Group Project Work Day'),
  T('stp-1003-quiz2', 'deadline', 'Quiz 2')
]);

add('2025-10-06', 'Sci & Tech Policies', [
  T('stp-1006-health', 'read',
    'Growing Organs (2018), McDonnell et al (2021), GAO (2020)')
]);

add('2025-10-10', 'Sci & Tech Policies', [
  T('stp-1010-workday', 'info', 'Group Project Work Day'),
  T('stp-1010-aa3', 'deadline', 'Analysis Activity #3')
]);

add('2025-10-17', 'Sci & Tech Policies', [
  T('stp-1017-proposal', 'deadline', 'Group Project Proposal Packet due')
]);

add('2025-10-24', 'Sci & Tech Policies', [
  T('stp-1024-progress', 'deadline', 'Individual Progress Report + Quiz 3')
]);

add('2025-10-27', 'Sci & Tech Policies', [
  T('stp-1027-midterm-wrap', 'info',
    'Wrap-up on DNA; Midterm Exam this week')
]);

add('2025-10-31', 'Sci & Tech Policies', [
  T('stp-1031-drones', 'watch', 'Invasion of the Drones (2016)')
]);

add('2025-11-07', 'Sci & Tech Policies', [
  T('stp-1107-deepfakes', 'watch',
    'Deepfakes and National Security + MIT test (optional)'),
  T('stp-1107-subsection', 'deadline',
    'Individual Presentation Subsection Packet due'),
  T('stp-1107-quiz4', 'deadline', 'Quiz 4')
]);

add('2025-11-14', 'Sci & Tech Policies', [
  T('stp-1114-weapons-of-influence', 'watch',
    'Hacking your Mind: Weapons of Influence (2019)'),
  T('stp-1114-aa4', 'deadline', 'Analysis Activity #4 + Quiz 5')
]);

// export globals
window.WEEKS = WEEKS;
window.HARD_DEADLINES = HARD_DEADLINES;
