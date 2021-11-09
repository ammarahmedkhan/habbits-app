export const data = {
  cal: function (
    subject,
    description,
    location,
    begin,
    stop,
    rem_evt_repeat,
    rem_evt_days
  ) {
    var file_path = "calfile.ics";
    var SEPARATOR = navigator.appVersion.indexOf("Win") !== -1 ? "\r\n" : "\n";
    var rRule;
    if (rem_evt_repeat === "DAILY") {
      rRule = "RRULE:FREQ=" + rem_evt_repeat + ";INTERVAL=1";
    } else if (rem_evt_repeat === "WEEKLY") {
      rRule = "RRULE:FREQ=" + rem_evt_repeat + ";BYDAY=" + rem_evt_days.join();
    } else {
      rRule = "RRULE:FREQ=" + rem_evt_repeat;
    }

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

    var start_time = "";
    var end_time = "";

    start_time = "T" + start_hours + start_minutes + start_seconds;
    end_time = "T" + end_hours + end_minutes + end_seconds;

    var start = start_year + start_month + start_day + start_time;
    var end = end_year + end_month + end_day + end_time;
    //console.log(start, end);

    var file_path = "calfile.ics";
    var SEPARATOR = navigator.appVersion.indexOf("Win") !== -1 ? "\r\n" : "\n";

    var cal = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:habbits",
      "BEGIN:VEVENT",
      "CLASS:PUBLIC",
      "DESCRIPTION:" + description,
      "DTSTART:" + start,
      "DTEND:" + end,
      rRule,
      "LOCATION:" + location,
      "SUMMARY:" + subject,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    /*
    console.log(
      subject,
      description,
      location,
      begin,
      stop,
      rem_evt_repeat,
      rem_evt_days
    );
    
      [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//ical.marudot.com//iCal Event Maker",
        "CALSCALE:GREGORIAN",
        "BEGIN:VTIMEZONE",
        "TZID:Asia/Karachi",
        "LAST-MODIFIED:20201011T015911Z",
        "TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Karachi",
        "X-LIC-LOCATION:Asia/Karachi",
        "BEGIN:STANDARD",
        "TZNAME:PKT",
        "TZOFFSETFROM:+0500",
        "TZOFFSETTO:+0500",
        "DTSTART:19700101T000000",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        "DTSTAMP:20210818T083745Z",
        "UID:20210818T083745Z-1607645181@marudot.com",
        "DTSTART;TZID=Asia/Karachi:20210722T120000",
        "RRULE:FREQ=WEEKLY;BYDAY=SU,MO,TU,FR,SA",
        "DTEND;TZID=Asia/Karachi:20210722T130000",
        "SUMMARY:test",
        "DESCRIPTION:read books",
        "END:VEVENT",
        "END:VCALENDAR"
      ];
    */
    var calEvent = cal.join(SEPARATOR);
    var href = "data:text/calendar;charset=utf8," + escape(calEvent);
    //var blob = new Blob([calEvent]);
    var link = document.createElement("a");
    link.href = href;
    link.download = file_path;
    link.click();
    //    window.open(link);
  }
};
