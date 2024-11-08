function createMonthlyCalendar(optionalDate, tutors) {
  const date = optionalDate ? new Date(optionalDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // create/select sheet (based on naming scheme)
  const monthName = year + "-" + (month + 1);
  const calendarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(settings.CalendarSheet + " " + monthName) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(settings.CalendarSheet + " " + monthName);

  // clear any old data - regenerate sheet
  calendarSheet.clear();

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // headers for calendar
  calendarSheet.getRange(1, 1, 1, daysOfWeek.length).setValues([daysOfWeek]);

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0); // last day of month
  
  let currentDay = new Date(firstDayOfMonth);
  currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // go to the Sunday of the week containing the 1st
  
  let row = 2;

  const weeklySchedule = scheduleTutorsForWeek(tutors); // schedule for this week

  // input data into the sheet
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) { // complete until last sunday is done (could be next month)
    let weekData = Array(7).fill(""); // store dates

    // fill in dates + tutors
    for (let i = 0; i < daysOfWeek.length; i++) {
      const formattedDate = Utilities.formatDate(currentDay, Session.getScriptTimeZone(), "MM/dd/yyyy");
      weekData[i] = formattedDate;

      // iff weekday
      if (i >= 1 && i <= 5 && currentDay.getMonth() === month) { // mon-friday
        const dayName = daysOfWeek[i];
        const tutorsForDay = weeklySchedule[dayName];
        
        if (tutorsForDay && tutorsForDay.length > 0) {
          const tutorNames = tutorsForDay.map(tutor => tutor.getFullName()).join("\n");
          calendarSheet.getRange(row + 1, i + 1).setValue(tutorNames); // add tutor names
          // (TBD) ADD CATEGORIES HERE
        }
      }

      currentDay.setDate(currentDay.getDate() + 1); // increment day
    }

    // place data rows
    calendarSheet.getRange(row, 1, 1, daysOfWeek.length).setValues([weekData]);

    // row heights for readability
    calendarSheet.setRowHeight(row, 20); // Date row
    calendarSheet.setRowHeight(row + 1, 160); // Tutor info row
    
    row += 2; // next week (skip for tutor spots)
  }

  // widths + colors
  daysOfWeek.forEach((_, i) => calendarSheet.setColumnWidth(i + 1, 150));
  for (let r = 2; r < row; r += 2) {
    calendarSheet.getRange(r + 1, 2, 1, 5).setBackground("#E8F0FE"); // mon-fri(weekdays)
  }

  return calendarSheet;
}
