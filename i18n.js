/*
  i18n.js — English / Kiswahili switching for the whole site.

  English lives in the HTML. Kiswahili lives in the SW dictionary below,
  keyed by "tag|text" (the element's tag plus its visible text). That means
  no data-* attributes are needed on every paragraph, and the English
  markup stays the single source of truth.

  The visitor's choice is saved in localStorage("lang") and applied before
  DOMContentLoaded, so pages load in the chosen language.
*/
(function () {
  "use strict";

  // Enable the scroll-reveal styles before the first paint. Without this
  // class the CSS leaves every element visible, so the site works with
  // JavaScript disabled.
  document.documentElement.classList.add("js-reveal");

  var STORAGE_KEY = "lang";
  var DEFAULT_LANG = "en";

  // ---------------------------------------------------------------
  // Kiswahili blocks (value = replacement innerHTML)
  // ---------------------------------------------------------------
  var SW = {
    // Navigation
    "a|Home": "Nyumbani",
    "a|About": "Kuhusu",
    "a|Skills": "Ujuzi",
    "a|Projects": "Miradi",
    "a|Education": "Elimu",
    "a|Contact": "Wasiliana",
    "a|Email": "Barua pepe",

    // Home
    "p|Hello, I'm": "Habari, mimi ni",
    "p|Aspiring Software Developer": "Msanidi programu chipukizi",
    "span|Computer Systems and Networks Student":
      '<span class="icon" aria-hidden="true">🎓</span><span>Mwanafunzi wa Mifumo ya Kompyuta na Mitandao</span>',
    "p|A student developer from Tanzania learning by building real tools, like website scrapers that collect data automatically, and security scanners that help find weak spots before attackers do.":
      "Msanidi programu mwanafunzi kutoka Tanzania anayejifunza kwa kujenga zana halisi, kama vitekaji vya tovuti vinavyokusanya data kiotomatiki, na skana za usalama zinazosaidia kupata udhaifu kabla wavamizi hawajaufikia.",
    "a|View my projects":
      '<span class="code" aria-hidden="true">&lt; /&gt;</span> Tazama miradi yangu <span aria-hidden="true">→</span>',
    "a|Contact me": '<span class="mail" aria-hidden="true">✉</span> Wasiliana nami',
    "span|Automated checks": "Ukaguzi wa kiotomatiki",
    "span|Platform modules": "Sehemu za jukwaa",
    "span|Monitoring": "Ufuatiliaji",
    "a|Explore the portfolio": 'Gundua jalada <span aria-hidden="true">↓</span>',
    "h3|About me": "Kuhusu mimi",
    "p|How a self-taught developer from Tanzania ended up building a full website-auditing platform.":
      "Jinsi msanidi programu aliyejifunza mwenyewe kutoka Tanzania alivyofikia kujenga jukwaa kamili la kukagua tovuti.",
    "span|My story": "Historia yangu",
    "a|Read more": 'Soma zaidi <span aria-hidden="true">→</span>',
    "h3|Skills": "Ujuzi",
    "p|HTML & CSS, JavaScript, Python and web security, with honest skill levels.":
      "HTML &amp; CSS, JavaScript, Python na usalama wa mtandao, pamoja na viwango vya ujuzi vya kweli.",
    "span|8 skills": "Ujuzi 8",
    "a|See toolkit": 'Tazama zana <span aria-hidden="true">→</span>',
    "h3|Projects": "Miradi",
    "p|The Oweru platform: a 23-check website scanner, a scraper, a CRM, payments and more.":
      "Jukwaa la Oweru: skana ya tovuti yenye ukaguzi 23, kitekaji, CRM, malipo na zaidi.",
    "span|5 projects": "Miradi 5",
    "a|Explore work": 'Tazama kazi <span aria-hidden="true">→</span>',
    "h2|Looking for someone who builds & checks websites?":
      'Unatafuta mtu anaye<span class="accent">jenga na kukagua</span> tovuti?',
    "p|I scan, scrape, score and fix websites, and I explain everything in plain language.":
      "Ninakagua, ninakusanya, ninapima na kurekebisha tovuti, na ninaeleza kila kitu kwa lugha rahisi.",
    "a|Start a conversation": 'Anzisha mazungumzo <span aria-hidden="true">✉</span>',
    "p|Web developer and security enthusiast from Tanzania, building tools that check, scrape and explain websites.":
      "Msanidi programu na mpenda usalama kutoka Tanzania, ninajenga zana zinazokagua, kukusanya na kueleza tovuti.",
    "h4|Pages": "Kurasa",
    "h4|More": "Zaidi",
    "h4|Elsewhere": "Mahali pengine",

    // About
    "h1|About me.": 'Kuhusu <span class="accent">mimi</span><span class="dot">.</span>',
    "p|Hello! I'm Witness, a self-taught developer from Tanzania. I build modern, fast and secure websites that help small businesses grow online.":
      "Habari! Mimi ni <strong>Witness</strong>, msanidi programu aliyejifunza mwenyewe kutoka Tanzania. Ninajenga tovuti za kisasa, zenye kasi na usalama zinazosaidia biashara ndogo kukua mtandaoni.",
    "a|Hire me": 'Niajiri <span aria-hidden="true">→</span>',
    "a|See my projects": "Tazama miradi yangu",
    "h2|Contact": "Mawasiliano",
    "h2|Software skills": "Ujuzi wa programu",
    "p|I learned to code by building real things, not just tutorials. The biggest project I have built so far is Oweru Tech Solutions, a complete platform that checks a website's health, finds its weaknesses, and politely explains to the owner what should be improved.":
      "Nilijifunza kuandika programu kwa kujenga <strong>vitu halisi</strong>, si mafunzo ya vitabu pekee. Mradi mkubwa zaidi niliowahi kujenga hadi sasa ni <strong>Oweru Tech Solutions</strong>, jukwaa kamili linalokagua afya ya tovuti, kupata udhaifu wake, na kumweleza mmiliki kwa upole kile kinachopaswa kuboreshwa.",
    "p|Along the way I learned how websites actually work: how pages load, how emails should look, how payments flow, and how to make boring technical data look beautiful and easy to read.":
      "Njiani nilijifunza jinsi tovuti zinavyofanya kazi kwa kweli: jinsi kurasa zinavyopakiwa, barua pepe zinavyopaswa kuonekana, malipo yanavyopita, na jinsi ya kufanya data ngumu za kiufundi zionekane nzuri na rahisi kusoma.",
    "p|I enjoy the path where web development meets cybersecurity: knowing how a site is built helps me understand how it can be tested and protected.":
      'Napenda njia ambapo ukuzaji wa tovuti unakutana na usalama wa mtandao: kujua jinsi tovuti <em>ilivyojengwa</em> kunanisaidia kuelewa jinsi inavyoweza <em>kupimwa na kulindwa</em>.',
    "p|When I am not coding I am usually reading about how businesses use the internet in Tanzania. Every weak website I find is a problem waiting for a solution.":
      "Nikipokuwa sijaandika programu, huwa nasoma kuhusu jinsi biashara zinavyotumia intaneti Tanzania. Kila tovuti dhaifu ninayoipata ni tatizo linalosubiri suluhisho.",
    "h2|Let's work together": "Tufanye kazi pamoja",
    "span|Featured project": "Mradi maalum",
    "figcaption|Work in progress": "Kazi inaendelea",
    "p|A website health and security platform I have been building on my own: it looks at any website, runs 23 automated checks, and explains in plain language what is wrong and what to fix first.":
      "Jukwaa la afya na usalama wa tovuti ninalolijenga mwenyewe: linatazama tovuti yoyote, linafanya ukaguzi 23 wa kiotomatiki, na kueleza kwa lugha rahisi kilicho kibaya na kile cha kurekebisha kwanza.",
    "li|Discovery and crawling. Finds real businesses from public map data, then walks through their pages.":
      "<strong>Ugunduzi na uchakato.</strong> Hupata biashara halisi kutoka data ya ramani ya umma, kisha hupitia kurasa zao.",
    "li|Health scanning. Checks security, mobile friendliness, speed and trust, then gives each site a score.":
      "<strong>Ukaguzi wa afya.</strong> Hukagua usalama, urahisi wa simu, kasi na uaminifu, kisha huipa kila tovuti alama.",
    "li|Plain-language reports. Every failed check comes with a reason and a suggested fix, not just a red cross.":
      "<strong>Ripoti za lugha rahisi.</strong> Kila ukaguzi ulioshindikana huja na sababu na suluhisho linalopendekezwa, si alama nyekundu pekee.",
    "a|See the full breakdown": 'Tazama maelezo kamili <span aria-hidden="true">→</span>',
    "p|I am open to internships, junior developer roles and freelance work. Tell me what you need and I will tell you honestly what I can build.":
      "Niko tayari kwa mafunzo kazini, nafasi za msanidi programu chipukizi na kazi huru. Niambie unachohitaji na nitakuambia kwa uaminifu kile ninachoweza kujenga.",

    // Skills
    "h1|My skills.": 'Ujuzi <span class="accent">wangu</span><span class="dot">.</span>',
    "button|View more skills": 'Ona ujuzi zaidi <span aria-hidden="true">↓</span>',
    "p|Skill levels": "Viwango vya ujuzi",
    "h2|Where I am today": "Nilipo leo",
    "p|Honest levels: every one of these is a skill I am learning and developing, not an expert claim. The bars show where I am in the journey.":
      'Viwango vya kweli: kila kimoja ni ujuzi ambao <strong>ninaendelea kuujifunza</strong>, sio madai ya utaalamu kamili. Mipau inaonyesha nilipo katika safari.',
    "p|Building clean, responsive page layouts and design systems from scratch.":
      "Kujenga mifumo safi ya kurasa zinazobadilika kwa ukubwa na mifumo ya ubunifu kuanzia mwanzo.",
    "span|Developing": "Ninaendelea",
    "p|Adding interactivity: menus, forms, animations and small tools.":
      "Kuongeza mwingiliano: menyu, fomu, uhuishaji na zana ndogo.",
    "p|Writing scrapers, scanner engines and automation scripts.":
      "Kuandika vitekaji, injini za skana na hati za kiotomatiki.",
    "p|Real applications: dashboards, login systems, invoices and email flows.":
      "Programu halisi: dashibodi, mifumo ya kuingia, ankara na mtiririko wa barua pepe.",
    "h3|Web security": "Usalama wa mtandao",
    "p|Security checks, header audits and thinking like a defender.":
      "Ukaguzi wa usalama, ukaguzi wa vichwa vya HTTP na kufikiri kama mlinzi.",
    "span|Learning": "Ninajifunza",
    "p|Databases, tables and queries, powering the Laravel apps I build.":
      "Hifadhidata, majedwali na maswali, zinaendesha programu za Laravel ninazojenga.",
    "h3|Networking fundamentals": "Misingi ya mitandao",
    "p|How computers actually reach each other: IP addresses, DNS, protocols.":
      "Jinsi kompyuta zinavyowasiliana kwa kweli: anwani za IP, DNS, itifaki.",
    "h3|Reporting": "Kutoa ripoti",
    "p|Turning technical findings into reports a business owner can actually use.":
      "Kubadilisha matokeo ya kiufundi kuwa ripoti ambazo mmiliki wa biashara anaweza kutumia.",

    // Projects
    "p|Things I've built": "Vitu nilivyojenga",
    "h1|My projects.": 'Miradi <span class="accent">yangu</span><span class="dot">.</span>',
    "p|One platform, many parts: every image below is a hand-drawn mockup of how that part works.":
      "Jukwaa moja, sehemu nyingi: kila picha hapa chini ni mchoro wa jinsi sehemu hiyo inavyofanya kazi.",
    "span|⭐ Featured project": "⭐ Mradi maalum",
    "h3|Website Scraping & Security Scanner: Oweru Tech Solutions":
      "Kiteka Tovuti &amp; Skana ya Usalama: Oweru Tech Solutions",
    "p|The flagship of the Oweru platform: a scan engine that audits any website and reports what is wrong and how to fix it. An evolving, hands-on project rather than a finished commercial product.":
      "Mradi mkuu wa jukwaa la Oweru: injini ya skana inayokagua tovuti yoyote na kuripoti kilicho kosa na jinsi ya kukirekebisha. Mradi unaobadilika na wa vitendo badala ya bidhaa kamili ya kibiashara.",
    "li|Website discovery: finds real local businesses from public map data and lists which have no website":
      "<strong>Ugunduzi wa tovuti</strong>: hupata biashara halisi za eneo kutoka data ya ramani za umma na kuorodhesha zisizo na tovuti",
    "li|Crawling: walks through the found site's pages, collecting links and content":
      "<strong>Kutembea kurasa</strong>: hupitia kurasa za tovuti iliyopatikana, kikusanya viungo na maudhui",
    "li|Business information collection: extracts contacts, services, ratings and reviews from public pages":
      "<strong>Kukusanya taarifa za biashara</strong>: hutoa mawasiliano, huduma, alama na maoni kutoka kurasa za umma",
    "li|Health scanning: runs automated checks across security, mobile friendliness, speed and trust areas for a score":
      "<strong>Ukaguzi wa afya</strong>: hufanya ukaguzi wa kiotomatiki wa usalama, urafiki kwa simu, kasi na uaminifu kwa alama",
    "li|Potential weaknesses & recommendations: each failed check explains what was found, why it matters and a suggested fix":
      "<strong>Udhaifu unaowezekana &amp; mapendekezo</strong>: kila ukaguzi ulioshindikana unaeleza kilichopatikana, kwa nini ni muhimu na suluhisho linalopendekezwa",
    "a|View code": 'Tazama msimbo <span aria-hidden="true">↗</span>',
    "h3|Business discovery engine": "Injini ya ugunduzi wa biashara",
    "p|Identifies real businesses from public map data, flags those without a website, and generates a polite outreach list automatically.":
      'Hutambua biashara halisi kutoka data ya ramani za umma, huziweka alama zisizo na tovuti, na hutengeneza orodha ya mawasiliano kwa upole kiotomatiki.',
    "h3|Scraper watchdog": "Mlinzi wa kitekaji",
    "p|Monitors businesses around the clock, re-scraping every five minutes and alerting the right team member to rating drops or negative reviews.":
      "Hufuatilia biashara saa 24, kukusanya upya kila dakika tano na kumtaarifu mwanatimu sahihi kuhusu kupungua kwa alama au maoni mabaya.",
    "span|Notifications": "Arifa",
    "h3|Sales pipeline CRM": "CRM ya mchakato wa mauzo",
    "p|A kanban-style admin board that moves each enquiry through new → qualified → proposal → won, auto-generating an invoice when a proposal is sent.":
      "Bodi ya kanban ya msimamizi inayopeleka kila ombi kupitia hatua (mpya → imehitimu → pendekezo → imeshinda), na hutengeneza ankara kiotomatiki pendekezo linapotumwa.",
    "span|Automation": "Uendeshaji wa kiotomatiki",
    "h3|Online payment flow": "Mtiririko wa malipo mtandaoni",
    "p|Handles 50% deposit invoices, PesaPal mobile-money checkout, automated PDF receipts, reconciliation, and overdue reminders.":
      "Hushughulikia ankara zenye amana ya 50%, malipo ya pesa kwa simu ya PesaPal, risiti za PDF kiotomatiki, upatanisho, na vikumbusho vya ankara zilizochelewa.",

    // Education
    "p|Learning never stops": "Kujifunza hakuishi",
    "h1|My education": 'Elimu <span class="accent">yangu</span>',
    "p|Formal study, self-directed learning, and hands-on production experience.":
      "Masomo rasmi, kujifunza mwenyewe, na uzoefu wa vitendo wa uzalishaji.",
    "p|I began my formal studies in 2024 at Ardhi University, enrolling in the Bachelor of Science in Computer Systems and Networks programme, and I continue to grow through self-directed learning and hands-on professional practice.":
      "Nilianza masomo yangu rasmi mnamo 2024 katika Chuo Kikuu cha Ardhi, nikiandikishwa katika shahada ya Mifumo ya Kompyuta na Mitandao, na naendelea kukua kupitia kujifunza mwenyewe na mazoezi ya kitaalamu.",
    "h3|Bachelor of Science in Computer Systems and Networks": "Shahada ya Mifumo ya Kompyuta na Mitandao",
    "p|A formal programme covering networking fundamentals, system administration, security principles, and the theory that underpins modern web infrastructure, studied at Ardhi University from 2024 to 2027 and currently in progress.":
      "Programu rasmi inayoshughulikia misingi ya mitandao, usimamizi wa mifumo, kanuni za usalama, na nadharia inayoendesha miundombinu ya wavuti ya kisasa, iliyosomwa katika Chuo Kikuu cha Ardhi kuanzia 2024 hadi 2027 na inaendelea.",
    "h3|Self-taught full-stack web development": "Kujifunza mwenyewe ukuzaji kamili wa wavuti",
    "p|Acquired by building production projects: responsive front ends with HTML, CSS and JavaScript; back ends with PHP and Laravel; automation with Python; and data management with MySQL, ongoing since 2023.":
      "Ilipatikana kwa kujenga miradi ya uzalishaji: mbele zinazojibadilisha na HTML, CSS na JavaScript; nyuma na PHP na Laravel; uendeshaji wa kiotomatiki na Python; na usimamizi wa data na MySQL, inaendelea tangu 2023.",
    "h3|Cybersecurity and networking fundamentals": "Misingi ya usalama wa mtandao na mitandao",
    "p|Hands-on study of security headers, common web attacks and defenses, and auditing methodology, applied through the Oweru website health scanner, currently learning and ongoing.":
      "Utafiti wa vitendo wa vichwa vya usalama, mashambulizi ya wavuti na ulinzi wake, na mbinu za ukaguzi, uliotumika kupitia skana ya afya ya tovuti ya Oweru, ninajifunza sasa na inaendelea.",
    "h3|Professional practice at Oweru Tech Solutions": "Mazoezi ya kitaalamu katika Oweru Tech Solutions",
    "p|Real-world, production-grade experience: integrating a PHP web application with a Python scanning engine, background queues, invoicing, and continuous 24/7 scraping for live users, a key milestone in my learning journey.":
      "Uzoefu wa ulimwengu halisi wa kiwango cha uzalishaji: kuunganisha programu ya wavuti ya PHP na injini ya skana ya Python, foleni za kazi, ankara, na ukusanyaji wa 24/7 kwa watumiaji hai, hatua muhimu katika safari yangu ya kujifunza.",
    "a|See the projects": 'Tazama miradi <span aria-hidden="true">→</span>',

    // Contact
    "p|Let's talk": "Tuongee",
    "h1|Get in touch": 'Wasiliana <span class="accent">nami</span>',
    "p|Fill in the form and your message lands straight in my inbox. I usually reply within a couple of days.":
      "Jaza fomu na ujumbe wako utafika moja kwa moja kwenye kikasha changu. Kwa kawaida ninajibu ndani ya siku chache.",
    "h2|Or reach me directly": "Au wasiliana nami moja kwa moja",
    "p|Prefer email? Click the button below and your email app will open with my address already filled in.":
      "Unapendelea barua pepe? Bofya kitufe kilicho chini na programu yako ya barua pepe itafunguka ikiwa na anwani yangu tayari.",
    "span|Find me online": "Nipate mtandaoni",
    "label|Name": "Jina",
    "label|Email": "Barua pepe",
    "label|Message": "Ujumbe",
    "button|Send message": 'Tuma ujumbe <span aria-hidden="true">✉</span>',
    "p|Sent securely through Web3Forms straight to my inbox, so no email app is needed. I usually reply within a couple of days.":
      "Hutumwa kwa usalama kupitia Web3Forms moja kwa moja kwenye kikasha changu, kwa hivyo hakuna programu ya barua pepe inayohitajika. Kawaida ninajibu ndani ya siku chache."
  };

  // Elements marked with data-i18n use explicit keys (stable when content changes)
  var KEYED = {
    "contact.call": "Piga simu au WhatsApp",
    "footer.legal":
      '© <span id="year"></span> Witness Pasaka Samson · Imeundwa kwa HTML, CSS &amp; JavaScript'
  };

  var ATTRS = {
    "Witness Pasaka Samson — home": "Witness Pasaka Samson — mwanzo",
    "Main navigation": "Urambazaji mkuu",
    "Back to top": "Rudi juu",
    "Your name": "Jina lako",
    "you@example.com (so I can reply)": "wewe@mfano.com (ili nikuandikie)",
    "What would you like to build or ask about?": "Ungependa kujenga au kuuliza nini?"
  };

  var TITLES = {
    "index.html": "Witness Pasaka Samson — Msanidi Programu & Mpenda Usalama",
    "about.html": "Kuhusu — Witness Pasaka Samson",
    "skills.html": "Ujuzi — Witness Pasaka Samson",
    "projects.html": "Miradi — Witness Pasaka Samson",
    "education.html": "Elimu — Witness Pasaka Samson",
    "contact.html": "Wasiliana — Witness Pasaka Samson"
  };

  var DESCRIPTIONS = {
    "index.html":
      "Jalada la Witness Pasaka Samson, msanidi programu aliyejifunza mwenyewe kutoka Tanzania anayejenga vitekaji na skana za usalama.",
    "about.html":
      "Kuhusu Witness Pasaka Samson, msanidi programu aliyejifunza mwenyewe kutoka Tanzania.",
    "skills.html":
      "Ujuzi wa Witness Pasaka Samson: HTML, CSS, JavaScript, Python, Laravel na usalama wa mtandao.",
    "projects.html":
      "Miradi ya Witness Pasaka Samson: skana ya tovuti ya Oweru, kitekaji, CRM, ankara na mlinzi wa kazi.",
    "education.html":
      "Elimu ya Witness Pasaka Samson: Shahada ya Mifumo ya Kompyuta na Mitandao katika Chuo Kikuu cha Ardhi.",
    "contact.html": "Wasiliana na Witness Pasaka Samson kwa barua pepe, simu au WhatsApp."
  };

  // Strings inserted by JavaScript (plain text, not HTML)
  var UI = {
    "Sending…": "Inatuma…",
    "Sending your message…": "Inatuma ujumbe wako…",
    "Message sent. Thank you! I'll reply to {email} soon.":
      "Ujumbe umetumwa. Asante! Nitakujibu kwa {email} hivi karibuni.",
    "Sorry, the message could not be sent. Please try again or email me directly.":
      "Samahani, ujumbe haukuweza kutumwa. Tafadhali jaribu tena au niandikie barua pepe moja kwa moja.",
    "No connection to the form service. Please check your internet and try again, or email me directly.":
      "Hakuna muunganisho kwa huduma ya fomu. Tafadhali angalia intaneti yako na ujaribu tena, au niandikie barua pepe moja kwa moja.",
    "Please enter your name. ": "Tafadhali weka jina lako. ",
    "Please enter a valid email (like name@example.com). ":
      "Tafadhali weka barua pepe sahihi (kama jina@mfano.com). ",
    "Your message needs at least 10 characters.":
      "Ujumbe wako unahitaji angalau herufi 10.",
    "The form service is not connected yet, so your email app is opening instead. Send the message from there. It reaches the same inbox.":
      "Huduma ya fomu bado haijaunganishwa, kwa hivyo programu yako ya barua pepe inafunguka badala yake. Tuma ujumbe kutoka hapo. Utafika kwenye kikasha kilekile.",
    "Switch to dark theme": "Badilisha hadi mandhari ya giza",
    "Switch to light theme": "Badilisha hadi mandhari ya mwanga",
    "Open menu": "Fungua menyu",
    "Close menu": "Funga menyu",
    "Send message": "Tuma ujumbe"
  };

  var SELECTOR = "h1,h2,h3,h4,h5,h6,p,li,a,span,label,button,strong,em,small,dt,dd,figcaption,blockquote,td,th";
  var blocks = [];
  var keyed = [];
  var attrStore = [];
  var titleStore = null;
  var descStore = null;

  function readLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === "sw" ? "sw" : DEFAULT_LANG;
    } catch (error) {
      return DEFAULT_LANG;
    }
  }

  var lang = readLang();

  function collect() {
    var nodes = document.body.querySelectorAll(SELECTOR);

    // Keyed elements first (they may sit inside blocks we leave alone)
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var name = el.getAttribute("data-i18n");
      if (!Object.prototype.hasOwnProperty.call(KEYED, name)) return;
      keyed.push({ el: el, key: name, en: el.innerHTML });
    });

    nodes.forEach(function (el) {
      if (el.hasAttribute("data-i18n")) return;
      if (el.closest(".skip-link") || el.closest(".logo") || el.closest(".footer-bottom")) return;
      if (el.closest("[aria-hidden='true']")) return;
      if (el.parentElement && el.parentElement.closest(SELECTOR)) return;

      var clone = el.cloneNode(true);
      clone.querySelectorAll("[aria-hidden='true']").forEach(function (n) {
        n.parentNode.removeChild(n);
      });
      var text = (clone.textContent || "").replace(/\s+/g, " ").trim();
      if (!/[A-Za-z]/.test(text) || text.length < 2) return;

      var key = el.tagName.toLowerCase() + "|" + text;
      if (!Object.prototype.hasOwnProperty.call(SW, key)) return;
      blocks.push({ el: el, key: key, en: el.innerHTML });
    });

    // Attributes (placeholders, labels) and document metadata
    document.querySelectorAll("[placeholder],[aria-label],[title]").forEach(function (el) {
      ["placeholder", "aria-label", "title"].forEach(function (name) {
        var value = el.getAttribute(name);
        if (!value || !Object.prototype.hasOwnProperty.call(ATTRS, value)) return;
        attrStore.push({ el: el, name: name, en: value });
      });
    });

    titleStore = { el: document.title };
    var descEl = document.querySelector('meta[name="description"]');
    descStore = descEl ? { el: descEl, en: descEl.getAttribute("content") || "" } : null;
  }

  function fileName() {
    var path = window.location.pathname.split("/").pop();
    return path && path.indexOf(".html") > -1 ? path : "index.html";
  }

  function setYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function apply(next) {
    lang = next;

    blocks.forEach(function (item) {
      item.el.innerHTML = lang === "sw" ? SW[item.key] : item.en;
    });

    keyed.forEach(function (item) {
      item.el.innerHTML = lang === "sw" ? KEYED[item.key] : item.en;
    });

    attrStore.forEach(function (item) {
      item.el.setAttribute(item.name, lang === "sw" ? ATTRS[item.en] : item.en);
    });

    if (titleStore) {
      document.title = lang === "sw" ? TITLES[fileName()] || titleStore.el : titleStore.el;
    }
    if (descStore) {
      descStore.el.setAttribute(
        "content",
        lang === "sw" ? DESCRIPTIONS[fileName()] || descStore.en : descStore.en
      );
    }

    document.documentElement.setAttribute("lang", lang === "sw" ? "sw" : "en");
    document.documentElement.setAttribute("data-lang", lang);
    setYear();
    syncSwitcher();

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* the language still applies for this visit */
    }

    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function syncSwitcher() {
    var options = document.querySelectorAll(".lang-option");
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var active = option.getAttribute("data-lang") === lang;
      option.setAttribute("aria-pressed", String(active));
      option.classList.toggle("is-active", active);
    }
    var group = document.querySelector(".lang-switch");
    if (group) group.setAttribute("aria-label", lang === "sw" ? "Lugha" : "Language / Lugha");
  }

  window.I18N = {
    get lang() {
      return lang;
    },
    t: function (text) {
      if (lang !== "sw") return text;
      return Object.prototype.hasOwnProperty.call(UI, text) ? UI[text] : text;
    },
    set: function (next) {
      apply(next === "sw" ? "sw" : "en");
    },
    toggle: function () {
      apply(lang === "sw" ? "en" : "sw");
    }
  };

  function boot() {
    collect();
    apply(lang);

    var options = document.querySelectorAll(".lang-option");
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function () {
        window.I18N.set(this.getAttribute("data-lang"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
