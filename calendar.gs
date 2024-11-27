function createMonthlyCalendar(optionalDate, tutors) {
  const date = optionalDate ? new Date(optionalDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const time = date.getTime();
  
  // create/select sheet (based on naming scheme)
  const monthName = year + "-" + (month < 10 ? '0' + month : month);
  const calendarSheetName = settings.CalendarSheet + monthName;
  const calendarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(calendarSheetName) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(calendarSheetName);

  // clear any old data - regenerate sheet
  calendarSheet.clear();

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // headers for calendar
  calendarSheet.getRange(1, 1, 1, daysOfWeek.length).setValues([daysOfWeek]);

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0); // last day of month
  
  let currentDay = new Date(firstDayOfMonth);
  currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Go to the Sunday of the week containing the 1st

  let row = 2;

  // Generate the monthly tutor schedule with the correct number of tutors per day
  const temp = generateTutorSchedule(tutors, 4, 5); // 3 tutors per day, 5 on Thursday
  const weeklySchedule = temp[0];
  // Logger.log(weeklySchedule);
  var badDays = temp[1];

  // Input data into the sheet
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) { // Complete until the last Sunday is done
    let weekData = Array(7).fill(""); // Store dates

    // Fill in dates + tutors
    for (let i = 0; i < daysOfWeek.length; i++) {
      const formattedDate = Utilities.formatDate(currentDay, Session.getScriptTimeZone(), "MM/dd/yyyy");
      weekData[i] = formattedDate;

      const weekIndex = Math.floor((currentDay.getDate() - 1) / 7); // Determine the correct week's schedule
      const dayName = daysOfWeek[i];
      const tutorsForDay = weeklySchedule[weekIndex]?.[dayName] || []; // Get tutors for this day or empty array

      if (currentDay.getMonth() === date.getMonth()) { // Only populate dates in the current month
        if (tutorsForDay.length > 0) {
          const tutorNames = tutorsForDay.map(tutor => tutor.getFullName()).join("\n"); // Get full names and join with line breaks
          const tutorCategories = getMissingCategories(tutorsForDay);
          calendarSheet.getRange(row + 1, i + 1).setValue(tutorNames + "\nMissing: " + tutorCategories).setWrap(true);
        }
      }

      currentDay.setDate(currentDay.getDate() + 1); // Increment day
    }

    // Place date row
    calendarSheet.getRange(row, 1, 1, daysOfWeek.length).setValues([weekData]);

    // Adjust row heights for readability
    calendarSheet.setRowHeight(row, 20); // Date row
    calendarSheet.setRowHeight(row + 1, 160); // Tutor info row
    
    row += 2; // Move to next week's rows
  }

    // widths + colors
    daysOfWeek.forEach((_, i) => calendarSheet.setColumnWidth(i + 1, 150));
    for (let r = 2; r < row; r += 2) {
      calendarSheet.getRange(r + 1, 2, 1, 5).setBackground("#E8F0FE"); // mon-fri(weekdays)
    }

    alertMessage("Could not get enough tutors for : " + (badDays.length == 0 ? "No days :)" : badDays.join(", ")));

    return calendarSheet;
}
