// <script id="fw_script" src="http://lvh.me:3000/embed.js" data-theatre="one"></script>
// <div id="fourth_wall"></div>

// https://stackoverflow.com/questions/41699451/snippets-identifier-has-already-been-declared
{
  let FW_HTTP, FW_MAIN_URL;

  const FW_CURRENT_SCRIPT = document.currentScript;
  const FW_DEV_MODE = FW_CURRENT_SCRIPT.getAttribute("data-development");
  const FW_DATA_TYPE = FW_CURRENT_SCRIPT.getAttribute("data-type") || "shows";
  const FW_DATA_VIEW = FW_CURRENT_SCRIPT.getAttribute("data-view");
  const FW_DATA_CATEGORY = FW_CURRENT_SCRIPT.getAttribute("data-category");
  const FW_DATA_START_DATE = FW_CURRENT_SCRIPT.getAttribute("data-start-date");
  const FW_DATA_START_DOW = FW_CURRENT_SCRIPT.getAttribute("data-start-dow") || 1;
  const FW_DATA_LOCAL = FW_CURRENT_SCRIPT.getAttribute("data-local") == "true"; // Trick to force boolean
  let FW_TIMEZONE = "Central Time (US & Canada)"; // Default timezone. Update from API further down
  let FW_EMBED_LOADING_CLASS = "fw-embed-loading";

  let RENDER_VIEW = "calendar";
  if (FW_DATA_VIEW === "cards" && (!FW_DATA_TYPE || FW_DATA_TYPE === "shows")) {
    RENDER_VIEW = "cards";
  } else if ((!FW_DATA_VIEW || FW_DATA_VIEW === "cards") && FW_DATA_TYPE === "classes") {
    RENDER_VIEW = "cards";
  }

  if (FW_DEV_MODE) {
    FW_HTTP = "http";
    FW_MAIN_URL = "lvh.me:3000";
  } else {
    FW_HTTP = "https";
    FW_MAIN_URL = "crowdwork.com";
  }

  const SCRIPTS = [
    `${FW_HTTP}://${FW_MAIN_URL}/embed/bootstrap-modal.min.js`,
    `${FW_HTTP}://${FW_MAIN_URL}/embed/bootstrap-modal.min.css`,
    "https://cdn.jsdelivr.net/npm/fullcalendar@6.0.2/index.global.min.js",
    `${FW_HTTP}://${FW_MAIN_URL}/embed/embed.min.css?v=8`, // Load mine last
  ];

  const modalHTML = `
    <div id="fwCalendarModal" class="fw-modal fw-fade" tabindex="-1" aria-labelledby="calendarModalLabel" aria-hidden="true">
        <div class="fw-modal-dialog fw-modal-lg fw-modal-dialog-centered fw-modal-dialog-scrollable">
            <div class="fw-modal-content">
                <div class="fw-modal-header">
                    <div class="fw-modal-header-text">
                        <h3 id="calendarModalLabel" class="fw-modal-title"></h3>
                        <p class="fw-modal-subtitle"><span class="fw-modal-date"></span> <span class="fw-modal-cost"></span></p>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="fw-modal" aria-label="Close"></button>
                </div>
                <div class="fw-modal-body">
                    <div class="left">
                        <div>
                            <img class="fw-modal-img img-fluid" src="#" alt="">
                        </div>
                    </div>
                    <div class="right">
                        <div class="fw-modal-description"></div>
                    </div>
                </div>
                <div class="fw-modal-footer">
                    <a class="btn btn-primary fw-modal-btn-purchase" href="#" ${
                      FW_DATA_LOCAL ? "" : ' target="_blank"'
                    }>Purchase Tickets</a>
                </div>
            </div>
        </div>
    </div>
  `;

  const generateID = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const FW_EMBED_UUID = generateID(12);

  const getEmbeddedElement = () => {
    let el = document.getElementById(FW_EMBED_UUID);

    if (!el) {
      // Create wrapper for Wix/others to ensure full-width
      let elWrapper = document.createElement("div");
      elWrapper.style["width"] = "100%";
      elWrapper.style["position"] = "relative";

      el = document.createElement("div");
      el.id = FW_EMBED_UUID;
      el.className = "fw-embed";

      if (document.body.contains(FW_CURRENT_SCRIPT)) {
        FW_CURRENT_SCRIPT.parentNode.insertBefore(elWrapper, FW_CURRENT_SCRIPT);
        elWrapper.appendChild(el);
      } else {
        // This script has been loaded into the <head> section (i.e. Wix)
        document.body.appendChild(elWrapper);
        document.body.insertBefore(el, null);
      }
    }

    return el;
  };

  const getLoadingOverlayEl = () => {
    let calendarEl = getEmbeddedElement();
    let el = calendarEl.querySelector(`.${FW_EMBED_LOADING_CLASS}`);

    if (!el) {
      let loadingDiv = document.createElement("div");
      loadingDiv.classList.add(FW_EMBED_LOADING_CLASS);

      let spinnerDiv = document.createElement("div");
      spinnerDiv.classList.add("spinner");
      loadingDiv.appendChild(spinnerDiv);

      calendarEl.insertBefore(loadingDiv, calendarEl.children[0]);
      el = loadingDiv;
    }

    return el;
  };

  // Before scripts load, show text...
  const insertLoadingEl = () => {
    let calendarEl = getEmbeddedElement();

    let h = document.createElement("H1");
    h.style.textAlign = "center";
    h.style.padding = "32px 16px";
    h.style.width = "100%";
    let t = document.createTextNode("Loading...");
    h.appendChild(t);
    calendarEl.appendChild(h);

    return h;
  };

  const assetLoader = (files, callback) => {
    let count = files.length;

    const urlCallback = (url) => {
      return function () {
        // console.log(url + ' has loaded (' + --count + ' more files remaining).');
        --count;
        if (count < 1) {
          callback();
        }
      };
    };

    const loadScript = (url) => {
      let s = document.createElement("script");
      s.setAttribute("src", url);
      s.onload = urlCallback(url);
      document.head.appendChild(s);
    };

    const loadStyle = (url) => {
      let s = document.createElement("link");
      s.setAttribute("href", url);
      s.setAttribute("type", "text/css");
      s.setAttribute("rel", "stylesheet");
      s.onload = urlCallback(url);
      document.head.appendChild(s);
    };

    for (let file of files) {
      if (file.slice(-2) == "js") {
        loadScript(file);
      } else {
        loadStyle(file);
      }
    }
  };

  const load = () => {
    // Insert loading message
    const loadingEl = insertLoadingEl();

    // Load dependencies and this initialize
    assetLoader(SCRIPTS, function () {
      main();
    });

    // Once scripts have been loaded, load/insert everything else
    const main = async () => {
      // Hide loading...
      loadingEl.style.display = "none";

      const getAPI = async (startStr, endStr) => {
        // Get theatre name
        let fw_theatre = FW_CURRENT_SCRIPT.getAttribute("data-theatre");

        // Insert Modal HTML
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        let showEvents = [];

        let fetchString = `${FW_HTTP}://${fw_theatre}.${FW_MAIN_URL}/api/v1/${FW_DATA_TYPE}?cache=${new Date().getTime()}`;

        if (FW_DATA_CATEGORY) {
          fetchString += `&category=${encodeURIComponent(FW_DATA_CATEGORY)}`;
        }

        if (startStr || endStr) {
          fetchString += `&start=${startStr}&end=${endStr}`;
        }

        try {
          const res = await fetch(fetchString);
          const showJson = await res.json();

          // Loop through each show
          Object.keys(showJson["data"]).forEach((key, index) => {
            let show = showJson["data"][key];
            let showDates = showJson["data"][key]["dates"];

            // Display until specific date requested
            if (RENDER_VIEW === "cards") {
              let _beginningOfToday = new Date();
              _beginningOfToday.setHours(0, 0, 0, 0);
              if (new Date(showJson["data"][key]["display_until"]) < _beginningOfToday) return;
            }

            // Each show has a dates array. Loop through each one and add to calendar event object
            let _alreadyInserted = false;
            for (let i = 0; i < showDates.length; i++) {
              // If we've already added the show, jump out of the loop
              if (RENDER_VIEW === "cards" && _alreadyInserted) break;
              _alreadyInserted = true;

              let description = "No description given.";
              if (show["description"]["body"]) {
                description = show["description"]["body"];
              }

              // Shim for dev/prod
              let imgURL = show["img"]["url"];
              if (FW_DEV_MODE) {
                imgURL = `${FW_HTTP}://${FW_MAIN_URL}${show["img"]["url"]}`;
              }

              FW_TIMEZONE = show["timezone"];

              showEvents.push({
                title: show["name"],
                start: showDates[i],
                description: description,
                img: imgURL,
                cost: show["cost"]["formatted"],
                show_url: show["url"],
                grouped_dates: show["grouped_dates"],
                next_date: show["next_date"] || showDates[showDates.length - 1], // Default to last date if no "next_date"
              });
            }
          });
        } catch (err) {
          console.log(err);
        }

        return showEvents;
      };

      const renderCards = (showEvents) => {
        let cardEl = getEmbeddedElement();

        cardEl.classList.add("fw-cards");

        // Manually check for size of container
        let _breakpoint = "";
        let _clientWidth = cardEl.clientWidth;

        if (_clientWidth <= 991) {
          _breakpoint = "fw-bp-md";
        }

        if (_clientWidth <= 767) {
          _breakpoint = "fw-bp-sm";
        }

        showEvents.forEach((e) => {
          let _upcomingDate = e.next_date || e.end;
          let _startDate = new Date(_upcomingDate);

          // Format date
          let formattedDate = _startDate.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: e.timezone, // Previously: 'UTC'
          });

          let formattedTime = _startDate.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            // timeZoneName: 'short',
            timeZone: e.timezone, // Previously: 'UTC'
          });

          // Format description
          let _cleanDesc = e.description.replace(/(<([^>]+)>)/gi, "");
          let _lengthDesc = 200;
          let _finalDesc =
            _cleanDesc.length > _lengthDesc ? _cleanDesc.substring(0, _lengthDesc - 3) + "..." : _cleanDesc;

          cardEl.innerHTML += `<a href="${e.show_url}" target="_blank" rel="noopener" class="${_breakpoint}">
                                <div class="fw-card">
                                    <div class="img-wrapper">
                                        ${e.cost ? `<div class="badge cost">${e.cost}</div>` : ""}
                                        <img class="card-img-top" src="${e.img}" alt="${e.title}">
                                    </div>
                                    <div class="card-body">
                                        <div class="card-date">${_upcomingDate ? `${formattedDate} @ ${formattedTime}` : "No upcoming date"}</div>
                                        <div class="card-title">${e.title}</div>
                                        <hr>
                                        <div class="card-subtitle description">
                                            ${_finalDesc}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `;
        });
      };

      const renderCalender = () => {
        let calendarEl = getEmbeddedElement();
        calendarEl.classList.add("fw-calendar");

        let calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: getCalendarView(),
          initialDate: FW_DATA_START_DATE,
          headerToolbar: {
            left: "prev",
            center: "title",
            right: "next",
          },
          // Useful: initialDate, gotoDate, fixedWeekCount, showNonCurrentDates, validRange, dateAlignment
          // events: showEvents,
          events: function (fetchInfo, successCallback, failureCallback) {
            const getAsyncAPI = async () => {
              let startDate = fetchInfo.startStr; // adjustMonths(fetchInfo.startStr, -1);
              let endDate = fetchInfo.endStr; // adjustMonths(fetchInfo.endStr, 1);
              let events = await getAPI(startDate, endDate);
              // calendar.render();
              successCallback(events);
            };

            getAsyncAPI();
          },
          height: "auto",
          timeZone: FW_TIMEZONE,
          nowIndicator: true,
          nextDayThreshold: "08:00:00", // https://fullcalendar.io/docs/nextDayThreshold
          firstDay: FW_DATA_START_DOW, // Our default: Monday, FC default: Sunday
          eventContent: function (arg) {
            let arrayOfDomNodes = [];

            // Build time
            let timeText = document.createElement("div");
            if (arg.timeText) {
              timeText.innerHTML = arg.timeText;
              timeText.classList = "fc-event-time";
            }

            // Build title
            let titleText = document.createElement("div");
            if (arg.event._def.title) {
              titleText.innerHTML = arg.event._def.title;
              titleText.classList = "fc-event-title fc-sticky";
            }

            // Append together
            let eventText = document.createElement("div");
            eventText.appendChild(timeText);
            eventText.appendChild(titleText);

            // Build image
            let imgEventWrap = document.createElement("div");
            if (arg.event.extendedProps.img) {
              let imgEvent = '<img width="32" height="32" src="' + arg.event.extendedProps.img + '">';
              imgEventWrap.classList = "fc-event-img";
              imgEventWrap.innerHTML = imgEvent;
            }

            arrayOfDomNodes = [imgEventWrap, eventText];

            return { domNodes: arrayOfDomNodes };
          },
          eventClick: function (info) {
            // https://fullcalendar.io/docs/v4/timeZone
            // let _startDate = Date.parse(info.event.start.toUTCString());
            let _startDate = info.event.start;

            let formattedDate = _startDate.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            });

            let formattedTime = _startDate.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              // timeZoneName: 'short',
              timeZone: "UTC",
            });

            // https://stackoverflow.com/a/28630757
            // var isoDate = new Date(_startDate.getTime() - _startDate.getTimezoneOffset() * 60000).toISOString().split('.')[0];
            let isoDate = new Date(_startDate.getTime()).toISOString().split(".")[0];
            let _show_url = info.event.extendedProps.show_url + `?date=${isoDate}`; // 2022-02-24T00:00:00

            let _classPrefix = "";
            if (FW_DATA_TYPE === "classes") _classPrefix = "Class starts ";

            let dateStr = `${_classPrefix}${formattedDate} @ ${formattedTime}`;

            if (info.event.extendedProps.grouped_dates.grouped) {
              dateStr = dateStr + info.event.extendedProps.grouped_dates.message;
            }

            // Set modal info
            document.querySelector("#fwCalendarModal .fw-modal-title").textContent = info.event.title;
            document.querySelector("#fwCalendarModal .fw-modal-date").textContent = dateStr;

            // Sometimes there isn't a price if all tiers are password-protected
            if (info.event.extendedProps.cost) {
              document.querySelector("#fwCalendarModal .fw-modal-cost").textContent =
                " â€¢ " + info.event.extendedProps.cost;
            }

            document.querySelector("#fwCalendarModal .fw-modal-img").setAttribute("src", info.event.extendedProps.img);
            document.querySelector("#fwCalendarModal .fw-modal-description").innerHTML =
              info.event.extendedProps.description;
            document.querySelector("#fwCalendarModal .fw-modal-btn-purchase").setAttribute("href", _show_url);

            let calendarModal = new bootstrap.Modal(document.getElementById("fwCalendarModal"));
            calendarModal.show();
          },
          viewDidMount: function () {
            // changePageHandler();
            let loadingOverlayEl = getLoadingOverlayEl();
            loadingOverlayEl.classList.add("show");
          },
          eventTimeFormat: {
            hour: "numeric",
            minute: "2-digit",
            meridiem: "short",
          },
          loading: function (isLoading, view) {
            // Add loading overlay for API/paging
            // Inject here to ensure FullCalendar has fully finished init

            let loadingOverlayEl = getLoadingOverlayEl();

            if (isLoading) {
              loadingOverlayEl.classList.add("show");
            } else {
              loadingOverlayEl.classList.remove("show");
            }
          },
        });

        calendar.render();

        // Update Calendar on mobile
        window.onresize = function () {
          calendar.changeView(getCalendarView());
          // listHeightShim();
        };
      };

      const getCalendarView = () => {
        // if (document.body.scrollWidth <= 767) {
        let el = getEmbeddedElement();
        if (el.clientWidth <= 767) {
          return "listMonth";
        } else {
          return "dayGridMonth";
        }
      };

      // Load everything here
      if (RENDER_VIEW === "cards") {
        let showEvents = await getAPI();

        console.log("showEvents: ", showEvents);

        // Sort since API doesn't return in order
        showEvents.sort(function (a, b) {
          return new Date(a.next_date) - new Date(b.next_date);
        });

        renderCards(showEvents);
      } else {
        // API is hit in FullCalendar
        renderCalender();
      }
    };
  };

  let _bodyLoaded = false;
  const checkIfLoaded = () => {
    if (typeof document.body !== "undefined") {
      _bodyLoaded = true;
    }

    if (_bodyLoaded) {
      load();
    }
  };

  checkIfLoaded(); // Run on load
  const checkIfLoadedInterval = setInterval(() => {
    if (_bodyLoaded) {
      clearInterval(checkIfLoadedInterval);
    } else {
      checkIfLoaded();
    }
  }, 1000);

  const adjustMonths = (dateStr, monthsToAdd) => {
    const date = new Date(dateStr);
    date.setDate(1); // Set to the first day of the month
    date.setMonth(date.getMonth() + monthsToAdd);

    // Handle end of month case
    return date.toISOString().split("T")[0];
  };

  // load();
}
