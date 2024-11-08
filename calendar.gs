function createMonthlyCalendar(optionalDate) {
  const date = optionalDate ? new Date(optionalDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Create or select the calendar sheet
  const monthName = year + "-" + (month + 1);
  const calendarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Calendar " + monthName) || 
                        SpreadsheetApp.getActiveSpreadsheet().insertSheet("Calendar " + monthName);

  // Clear existing content in the sheet
  calendarSheet.clear();

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Set up headers for each day of the week
  calendarSheet.getRange(1, 1, 1, daysOfWeek.length).setValues([daysOfWeek]);

  // Set up the date rows
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  let currentDay = new Date(firstDayOfMonth);
  currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Start from Sunday
  
  let row = 2;
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) {
    let weekData = Array(7).fill("");
    for (let i = 0; i < daysOfWeek.length; i++) {
      weekData[i] = Utilities.formatDate(currentDay, Session.getScriptTimeZone(), "MM/dd/yyyy");
      currentDay.setDate(currentDay.getDate() + 1);
    }
    calendarSheet.getRange(row, 1, 1, daysOfWeek.length).setValues([weekData]);
    
    // Set row height for dates and tutor info
    calendarSheet.setRowHeight(row, 20); // Date row
    calendarSheet.setRowHeight(row + 1, 160); // Tutor info row

    row += 2; // Move to the next week
  }
  // Adjust column widths and color backgrounds for tutor rows
  daysOfWeek.forEach((_, i) => calendarSheet.setColumnWidth(i + 1, 150));
  for (let r = 2; r < row; r += 2) {
    calendarSheet.getRange(r + 1, 2, 1, 5).setBackground("#E8F0FE"); // Monday-Friday cells for tutors
  }
}

/*function createMonthlyCalendar(optionalDate) {
  const date = optionalDate ? new Date(optionalDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Create or select the calendar sheet named by month and year
  const monthName = year + "-" + (month + 1);
  const calendarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(settings.CalendarSheet + " " + monthName) || SpreadsheetApp.getActiveSpreadsheet().insertSheet(settings.CalendarSheet + " " + monthName);

  // Clear any existing content in the sheet
  calendarSheet.clear();

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Set up headers for each day of the week
  calendarSheet.getRange(1, 1, 1, daysOfWeek.length).setValues([daysOfWeek]);

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0); // Last day of the current month
  
  let currentDay = new Date(firstDayOfMonth);
  currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Move to the Sunday of the week containing the 1st
  
  let row = 2;

  // Retrieve tutors and organize them by day availability
  const tutors = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName(settings.FormResponsesSheet)
                  .getDataRange()
                  .getValues()
                  .slice(1) // Skip header row
                  .map(row => new Tutor(row)); 

  const weeklySchedule = scheduleTutorsForWeek(tutors); // Schedule tutors by day

  // Populate the calendar with dates and tutor info
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) { // Loop until the last day or trailing Sunday
    let weekData = Array(7).fill(""); // Array to store dates for the week

    // Fill in dates and tutors
    for (let i = 0; i < daysOfWeek.length; i++) {
      const formattedDate = Utilities.formatDate(currentDay, Session.getScriptTimeZone(), "MM/dd/yyyy");
      weekData[i] = formattedDate;

      // Add tutor info if it's a weekday (Monday to Friday)
      if (i >= 1 && i <= 5 && currentDay.getMonth() === month) { // Monday to Friday, only within current month
        const dayName = daysOfWeek[i];
        const tutorsForDay = weeklySchedule[dayName];
        
        if (tutorsForDay && tutorsForDay.length > 0) {
          const tutorNames = tutorsForDay.map(tutor => tutor.getFullName()).join("\n");
          calendarSheet.getRange(row + 1, i + 1).setValue(tutorNames); // Set tutor names under the date
        }
      }

      currentDay.setDate(currentDay.getDate() + 1); // Move to the next day
    }

    // Place the dates row in the calendar sheet
    calendarSheet.getRange(row, 1, 1, daysOfWeek.length).setValues([weekData]);

    // Set row height for dates and tutor info
    calendarSheet.setRowHeight(row, 20); // Date row
    calendarSheet.setRowHeight(row + 1, 160); // Tutor info row
    
    row += 2; // Move to the next week
  }

  // Adjust column widths and color backgrounds for tutor rows
  daysOfWeek.forEach((_, i) => calendarSheet.setColumnWidth(i + 1, 150));
  for (let r = 2; r < row; r += 2) {
    calendarSheet.getRange(r + 1, 2, 1, 5).setBackground("#E8F0FE"); // Monday-Friday cells for tutors
  }

  return calendarSheet;
}
*/
