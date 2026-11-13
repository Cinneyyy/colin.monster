function parseDateTime(dt) {
    //example `dt` value: DTSTART;TZID=Europe/Berlin:20261027T140000

    let dateTime;
    let timeZone;
    if(dt.includes(':')) {
        const timeSplit = dt.split(':');
        timeZone = timeSplit[0].split('=').at(1);
        dateTime = timeSplit[1];
    }
    else {
        timeZone = "";
        dateTime = dt;
    }

    const year = parseInt(dateTime.substring(0, 4));
    const month = parseInt(dateTime.substring(4, 6));
    const day = parseInt(dateTime.substring(6, 8));

    const hour = parseInt(dateTime.substring(9, 11));
    const min = parseInt(dateTime.substring(11, 13));

    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        min: min,
        timeZone: timeZone,
    };
}

function parseEvent(summary, location, dateTime, repeat, exemptions, events) {
    const timeParsed = parseDateTime(dateTime);

    //summary = _ShortenSubjectName(summary);

    // Damn, very hardcoded.
    if(repeat.includes("WEEKLY")) {
        const exemptionsParsed = exemptions.map(ex => parseDateTime(ex));
        const untilParsed = parseDateTime(repeat.split("UNTIL=")[1]);

        while(true) {
            if(timeParsed.year > untilParsed.year && timeParsed.month > untilParsed.month && timeParsed.day > untilParsed.day) {
                break;
            }

            // .includes might work here, but I cannot be bothered to check rn.
            if(exemptionsParsed.findIndex(e => e.year === timeParsed.year && e.month === timeParsed.month && e.day === timeParsed.day) === -1) {
                const evt = {
                    date: generateDateObj(new Date(timeParsed.year, timeParsed.month-1, timeParsed.day)),
                    time: {
                        hour: timeParsed.hour,
                        min: timeParsed.min,
                    },
                    name: summary,
                    room: location,
                };

                events.push(evt);
            }

            timeParsed.day += 7;
            const numDaysInMonth = daysInMonth(timeParsed.month-1, timeParsed.year);
            if(timeParsed.day > numDaysInMonth) {
                timeParsed.day -= numDaysInMonth;

                if(timeParsed.month == 12-1) {
                    timeParsed.month = 0;
                    timeParsed.year++;
                }
                else {
                    timeParsed.month++;
                }
            }
        }
    }
    else {
        const evt = {
            date: generateDateObj(new Date(timeParsed.year, timeParsed.month-1, timeParsed.day)),
            time: {
                hour: timeParsed.hour,
                min: timeParsed.min,
            },
            name: summary,
            room: location,
        };

        events.push(evt);
    }
}

async function loadWebCal(id, events) {
    const response = await fetch(`https://pi.colin.monster/${id}`);
    if(!response.ok) {
        return false;
    }

    const cal = (await response.text()).split(/\r?\n/);
    if(cal.length === 0) {
        return false;
    }

    let buildingEvt = false;
    let currSummary = "";
    let currLocation = "";
    let currTime = "";
    let currRepeat = "";
    let currExemptions = [];

    for(let i = 0; i < cal.length; i++) {
        if(buildingEvt) {
            if(cal[i].startsWith("END:VEVENT")) {
                parseEvent(currSummary, currLocation, currTime, currRepeat, currExemptions, events)

                buildingEvt = false;
                currSummary = "";
                currLocation = "";
                currTime = "";
                currRepeat = "";
                currExemptions = [];

                continue;
            }
        }

        if(cal[i].startsWith("BEGIN:VEVENT")) {
            buildingEvt = true;
        }
        else if(cal[i].startsWith("DTSTART")) {
            currTime = cal[i].substring(cal[i].indexOf(";")+1);
        }
        else if(cal[i].startsWith("SUMMARY:")) {
            currSummary = cal[i].substring(cal[i].indexOf(":")+1).replace(/\\(?<char>.)/, "$<char>");
        }
        else if(cal[i].startsWith("LOCATION:")) {
            currLocation = cal[i].substring(cal[i].indexOf(":")+1).replace(/\\(?<char>.)/, "$<char>");
        }
        else if(cal[i].startsWith("RRULE")) {
            currRepeat = cal[i].substring(cal[i].indexOf(":")+1);
        }
        else if(cal[i].startsWith("EXDATE")) {
            currExemptions.push(cal[i].substring(cal[i].indexOf(";")+1));
        }
    }

    return true;
}

function fixWeekStart(dayOfWeek) {
    return (dayOfWeek + 6) % 7; // offset since sunday is the first day for some reason.
}

function generateDateObj(date) {
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        weekday: fixWeekStart(date.getDay()),
    };
}

function getEventTranslation(time) {
    const minTranslate = 10.0;
    const maxTranslate = 1660.0;

    const t = (time.hour + time.min / 60.0) / 24.0;
    const transPercent = t * (maxTranslate - minTranslate) + minTranslate;
    return `${transPercent}%`;
}

function buildEvent(name, time, room) {
    return `` +
        `<div class="event" style="transform: translateY(${getEventTranslation(time)})">` +
            `<h3 class="name">${name}</h3>` +
            `<h3 class="time">${time.hour.toString().padStart(2, "0")}:${time.min.toString().padStart(2, "0")}</h3>` +
            `<h3 class="room">${room}</h3>` +
        `</div>`;
}

function getWeekStartDateObj(jsDate) {
    const newJsDate = new Date(jsDate);
    newJsDate.setDate(jsDate.getDate() - fixWeekStart(jsDate.getDay()));
    return generateDateObj(newJsDate);
}

function isDateInWeek(date, weekStart) {
    const jsDate = new Date(date.year, date.month, date.day);
    const dateWeekStart = getWeekStartDateObj(jsDate);
    return dateWeekStart.day === weekStart.day && dateWeekStart.month === weekStart.month && dateWeekStart.year === weekStart.year;
}

function loadEvents(events, weekStart) {
    const containers = [];
    for(let i = 0; i < 7; i++) {
        const container = document.getElementById(`day-${i}`).children[1];
        container.innerHTML = "";
        containers.push(container);
    }

    for(const evt of events) {
        if(!isDateInWeek(evt.date, weekStart)) {
            continue;
        }

        const evtHtml = buildEvent(evt.name, evt.time, evt.room);
        containers[evt.date.weekday].innerHTML += evtHtml;
    }
}

function daysInMonth(month, year) {
    return new Date(year, month+1, 0).getDate();
}

function getNextWeek(date) {
    return generateDateObj(new Date(date.year, date.month, date.day + 7));
}

function getMonthName(month) {
    return ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",][month % 12].substring(0, 3);
}

function getWeekDayName(weekday) {
    return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",][weekday % 7].substring(0, 3);
}

function loadWeek(events, date) {
    const weekStart = getWeekStartDateObj(new Date(date.year, date.month, date.day));
    const nextWeek = getNextWeek(weekStart);

    const isMultiMonth = nextWeek.month !== weekStart.month;
    document.getElementById("date-display").textContent = isMultiMonth
        ? `${weekStart.day.toString().padStart(2, "0")} ${getMonthName(weekStart.month)} ${weekStart.year} - ${nextWeek.day.toString().padStart(2, "0")} ${getMonthName(nextWeek.month)} ${nextWeek.year}`
        : `${weekStart.day.toString().padStart(2, "0")} - ${nextWeek.day} ${getMonthName(weekStart.month)} ${weekStart.year}`;

    for(let i = 0; i < 7; i++) {
        document.getElementById(`day-${i}`).children[0].innerText = `${getWeekDayName(i)} ${((weekStart.day + i - 1) % daysInMonth(weekStart.month, weekStart.year) + 1).toString().padStart(2, "0")}`
    }

    loadEvents(events, weekStart);
}

let now;
let today;
let weekStart;
function writeWeekData(newDate) {
    now = newDate;
    today = generateDateObj(now);
    weekStart = getWeekStartDateObj(now);
    console.log(today);
    console.log(weekStart);
}

writeWeekData(new Date());

function prevWeek() {
    now.setDate(now.getDate() - 7);
    writeWeekData(now);
    loadWeek(events, today);
}

function nextWeek() {
    now.setDate(now.getDate() + 7);
    writeWeekData(now);
    loadWeek(events, today);
}

let events = [];


async function load() {
    const calId = localStorage.getItem("webCalId");
    if(calId !== null) {
        await loadWebCal(calId, events);
        document.getElementById("cal-id-input").value = calId;
    }

    loadWeek(events, today);
}

async function reload() {
    events = [];

    const calId = document.getElementById("cal-id-input").value;
    if(calId === "") {
        localStorage.removeItem("webCalId");
        loadWeek(events, today);
        return;
    }

    const result = await loadWebCal(calId, events);
    if(result) {
        localStorage.setItem("webCalId", calId);
    }

    loadWeek(events, today);
}

loadWeek([], today);
load();
