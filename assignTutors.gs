const MAX_TUTORS_PER_DAY = 3;

function scheduleTutorsForWeek(tutors) {
  const schedule = {
    "Monday": [],
    "Tuesday": [],
    "Wednesday": [],
    "Thursday": [],
    "Friday": []
  };
  
  tutors.forEach(tutor => {
    let assigned = false;
    tutor.days.some(day => {
      if (schedule[day] && schedule[day].length < MAX_TUTORS_PER_DAY) {
        schedule[day].push(tutor);
        assigned = true;
        return true;
      }
      return false;
    });
  });
  
  return schedule;
}

function assignTutorsToCalendar(optionalDate, tutors) {
  const date = optionalDate ? new Date(optionalDate) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  
  // Create or select the calendar sheet
  const monthName = year + "-" + (month + 1);

  const calendarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Calendar " + monthName) || 
                        SpreadsheetApp.getActiveSpreadsheet().insertSheet("Calendar " + monthName);
                        
  let scheduledTutors = {};

  // Helper function to find the day of the week for each cell in the row
  function getDayName(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
  }

  for (let row = 2; row <= calendarSheet.getDataRange().length; row += 2) {
    const weekDates = calendarSheet.getRange(row, 1, 1, 7).getValues()[0];
    
    for (let i = 0; i < weekDates.length; i++) {
      const dateCell = weekDates[i];
      if (dateCell) {
        const dayName = getDayName(dateCell);

        // Get tutors for this day, limit to 3
        let tutorsForDay = tutors.filter(tutor => tutor.days.includes(dayName)).slice(0, 3);
        
        // Collect tutor names and categories for display
        const tutorInfo = tutorsForDay.map(tutor => `${tutor.getFullName()} - ${tutor.categories.join(", ")}`).join("\n");
        
        // Place tutor info below the date cell
        calendarSheet.getRange(row + 1, i + 1).setValue(tutorInfo);

        // Mark tutors as scheduled
        tutorsForDay.forEach(tutor => scheduledTutors[tutor.email] = true);
      }
    }
  }

  // Log unscheduled tutors for verification
  const unscheduledTutors = tutors.filter(tutor => !scheduledTutors[tutor.email]);
  if (unscheduledTutors.length > 0) {
    Logger.log("Unscheduled Tutors:", unscheduledTutors.map(tutor => tutor.getFullName()).join("\n"));
  }
}
/*
function assignTutorsToCalendar(optionalDate, tutors, calendarSheet) {
  // Map to track which tutors are scheduled on each day
  let scheduledTutors = {};

  // Helper function to get the column for a day of the week
  function getDayColumn(day) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek.indexOf(day) + 1; // +1 since columns in Sheets are 1-indexed
  }

  // Iterate through each row pair (date and tutor information row)
  for (let row = 2; row <= calendarSheet.getLastRow(); row += 2) {
    const dateCell = calendarSheet.getRange(row, 1).getValue(); // Date in the current row
    const dayOfWeek = new Date(dateCell).getDay(); // Get day of the week from date
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];

    // Skip weekend rows if tutors are only scheduled Monday to Friday
    if (dayName === "Saturday" || dayName === "Sunday") continue;

    // Get tutors available on this day
    let tutorsForDay = tutors.filter(tutor => tutor.days.includes(dayName));
    
    // Limit to 3 tutors per day, if available
    tutorsForDay = tutorsForDay.slice(0, 3);

    // Prepare data for the tutor row
    let tutorInfo = tutorsForDay.map(tutor => tutor.getFullName()).join("\n");
    let tutorCategories = tutorsForDay.map(tutor => tutor.categories.join(", ")).join(", ");

    // Add tutor information to the sheet in the row below the date
    calendarSheet.getRange(row + 1, getDayColumn(dayName)).setValue(tutorInfo + "\n\n" + tutorCategories);

    // Mark tutors as scheduled for tracking
    tutorsForDay.forEach(tutor => scheduledTutors[tutor.email] = true);
  }

  // Display tutors who weren't scheduled
  const unscheduledTutors = tutors.filter(tutor => !scheduledTutors[tutor.email]);
  if (unscheduledTutors.length > 0) {
    Logger.log("Unscheduled Tutors:", unscheduledTutors.map(tutor => tutor.getFullName()).join("\n"));
  }
}
*/
