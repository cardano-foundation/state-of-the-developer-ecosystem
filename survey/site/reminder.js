// A reminder to answer the survey later: a calendar event, as a file for
// calendar apps or a Google Calendar link, or an email to oneself. All are
// made in the browser, and respondents can change the event's date in their
// calendar.

const MINUTE = 60 * 1000;
const QUARTER = 15 * MINUTE;
const HOUR = 60 * MINUTE;

/** The event, 15 minutes long: tomorrow at about this time, or two hours before the survey closes. */
export function reminderTime(now, close) {
  const tomorrow = Math.ceil((now + 24 * HOUR) / QUARTER) * QUARTER;
  const latest = Math.floor((close - 2 * HOUR) / QUARTER) * QUARTER;
  const start = Math.max(now, Math.min(tomorrow, latest));
  return { start, end: start + QUARTER };
}

/** The event as an iCalendar file (RFC 5545), with an alert when it starts. */
export function icsFile({ start, end, title, details, url, uid, stamp }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cardano Foundation//State of the Developer Ecosystem//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${utc(stamp)}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${text(title)}`,
    `DESCRIPTION:${text(details)}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${text(title)}`,
    "TRIGGER:PT0S",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** The event in Google Calendar, to save there. */
export function googleCalendarUrl({ start, end, title, details }) {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.search = new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${utc(start)}/${utc(end)}`, details });
  return url.href;
}

/** An email to oneself, in the respondent's email app. */
export function mailtoUrl({ title, details }) {
  return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(details)}`;
}

// ----------------------------------------------------------------------------

/** A time in UTC: 20261020T143000Z. */
const utc = (time) => new Date(time).toISOString().replace(/[-:]|\.\d{3}/g, "");

/** A text value, escaped. */
const text = (value) => value.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

/** A line in lines of at most 75 bytes, the next ones starting with a space. */
function fold(line) {
  const encoder = new TextEncoder();
  const parts = [];
  let part = "";
  for (const char of line) {
    const limit = parts.length === 0 ? 75 : 74;
    if (encoder.encode(part + char).length > limit) {
      parts.push(part);
      part = "";
    }
    part += char;
  }
  parts.push(part);
  return parts.join("\r\n ");
}
