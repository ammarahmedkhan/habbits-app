import React from "react";
import ReactDOM, { render } from "react-dom";

export class IcsFormatter extends React.Component {
  constructor(props) {
    super(props);
    var SEPARATOR_temp =
      navigator.appVersion.indexOf("Win") !== -1 ? "\r\n" : "\n";
    var object = {
      SEPARATOR: SEPARATOR_temp,
      calendarEvents: [],
      calendarStart: ["BEGIN:VCALENDAR", "VERSION:2.0"].join(SEPARATOR_temp),
      calendarEnd: SEPARATOR_temp + "END:VCALENDAR"
    };
    this.state = object;
    var icsFormatterObj = this.props.props.state;
    //console.log(this.props.props.state.rem_desc);

    var title = icsFormatterObj.rem_title;
    var place = icsFormatterObj.rem_place;
    var begin = icsFormatterObj.rem_evt_start;
    var end = icsFormatterObj.rem_evt_end;
    var description = icsFormatterObj.rem_desc;
    var rem_evt_repeat = icsFormatterObj.rem_evt_repeat;
    var rem_evt_days = icsFormatterObj.rem_evt_days;
    this.addEvent(
      title,
      description,
      place,
      begin,
      end,
      //begin.toUTCString(),
      //end.toUTCString(),
      rem_evt_repeat,
      rem_evt_days
    );

    //    this.download();
    //    this.download = this.download.bind(this);
    //    setTimeout(300, function () {
    //      this.download("ourSecretMeeting");
    //    });
  }
  events = () => {
    return this.state.calendarEvents;
  };
  calendar = () => {
    var object = this.state;
    return (
      object.calendarStart +
      object.SEPARATOR +
      object.calendarEvents.join(object.SEPARATOR) +
      object.calendarEnd
    );
  };

  addEvent = (
    subject,
    description,
    location,
    begin,
    stop,
    rem_evt_repeat,
    rem_evt_days
  ) => {
    if (
      typeof subject === "undefined" ||
      typeof description === "undefined" ||
      typeof location === "undefined" ||
      typeof begin === "undefined" ||
      typeof stop === "undefined"
    ) {
      return false;
    }

    //TODO add time and time zone? use moment to format?
    var start_date = new Date(begin);
    var end_date = new Date(stop);

    var start_year = ("0000" + start_date.getFullYear().toString()).slice(-4);
    var start_month = ("00" + (start_date.getMonth() + 1).toString()).slice(-2);
    var start_day = ("00" + start_date.getDate().toString()).slice(-2);
    var start_hours = ("00" + start_date.getHours().toString()).slice(-2);
    var start_minutes = ("00" + start_date.getMinutes().toString()).slice(-2);
    var start_seconds = ("00" + start_date.getMinutes().toString()).slice(-2);

    var end_year = ("0000" + end_date.getFullYear().toString()).slice(-4);
    var end_month = ("00" + (end_date.getMonth() + 1).toString()).slice(-2);
    var end_day = ("00" + end_date.getDate().toString()).slice(-2);
    var end_hours = ("00" + end_date.getHours().toString()).slice(-2);
    var end_minutes = ("00" + end_date.getMinutes().toString()).slice(-2);
    var end_seconds = ("00" + end_date.getMinutes().toString()).slice(-2);

    // Since some calendars don't add 0 second events, we need to remove time if there is none...
    var start_time = "";
    var end_time = "";
    if (start_minutes + start_seconds + end_minutes + end_seconds !== 0) {
      start_time = "T" + start_hours + start_minutes + start_seconds;
      end_time = "T" + end_hours + end_minutes + end_seconds;
    }

    var start = start_year + start_month + start_day + start_time;
    var end = end_year + end_month + end_day + end_time;
    var state = this.state;

    var rRule;
    if (rem_evt_repeat === "DAILY") {
      rRule = "RRULE:FREQ=" + rem_evt_repeat + ";INTERVAL=1";
    } else if (rem_evt_repeat === "WEEKLY") {
      rRule = "RRULE:FREQ=" + rem_evt_repeat + ";BYDAY=" + rem_evt_days.join();
    } else {
      rRule = "RRULE:FREQ=" + rem_evt_repeat;
    }

    var calendarEvent = [
      "BEGIN:VEVENT",
      "CLASS:PUBLIC",
      "DESCRIPTION:" + description,
      "DTSTART;VALUE=DATE:" + start,
      "DTEND;VALUE=DATE:" + end,
      rRule,
      "LOCATION:" + location,
      "SUMMARY;LANGUAGE=en-us:" + subject,
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    ].join(state.SEPARATOR);

    state.calendarEvents.push(calendarEvent);
    this.setState(state);
    return state.calendarEvents;
  };

  download = (filename, ext) => {
    if (this.state.calendarEvents < 1) {
      return false;
    }
    ext = typeof ext !== "undefined" ? ext : ".ics";
    filename = typeof filename !== "undefined" ? filename : "calendar";
    var object = this.state;
    var calendar =
      object.calendarStart +
      object.SEPARATOR +
      object.calendarEvents.join(object.SEPARATOR) +
      object.calendarEnd;
    window.open(
      "data:text/calendar;charset=utf8," + escape(calendar),
      "_parent",
      "download"
    );
  };
  render = () => {
    console.log("render calendar");
    this.download();
    return <div></div>;
  };
}

export default IcsFormatter;
