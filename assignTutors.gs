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
/*
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
*/
function assignTutorsToCalendar(optionalDate, tutors, calendarSheet) {
  // track tutors that are scheduled
  let scheduledTutors = {};

  // get column of day of week (helper)
  function getDayColumn(day) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek.indexOf(day) + 1; // 1 indexed
  }

  // go through each row pair (date and tutor information row)
  for (let row = 2; row <= calendarSheet.getLastRow(); row += 2) {
    const dateCell = calendarSheet.getRange(row, 1).getValue(); // date
    const dayOfWeek = new Date(dateCell).getDay(); // day of week from date
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek];

    // skip weekends
    if (dayName === "Saturday" || dayName === "Sunday") continue;

    // get avail. tutors
    let tutorsForDay = tutors.filter(tutor => tutor.days.includes(dayName));
    
    // max 3 tutors, chooses first 3 (COULD BE ISSUES HERE, RANDOM CHOICES/EVERY OTHER WEEK)
    tutorsForDay = tutorsForDay.slice(0, MAX_TUTORS_PER_DAY);

    // get data to add
    let tutorInfo = tutorsForDay.map(tutor => tutor.getFullName()).join("\n");
    let tutorCategories = tutorsForDay.map(tutor => tutor.categories.join(", ")).join(", "); // not seeming to be working, ill check later

    // add info
    calendarSheet.getRange(row + 1, getDayColumn(dayName)).setValue(tutorInfo + "\n\n" + tutorCategories);

    // mark scheduled as scheduled
    tutorsForDay.forEach(tutor => scheduledTutors[tutor.email] = true);
  }

  // display unscheduled (not working?)
  const unscheduledTutors = tutors.filter(tutor => !scheduledTutors[tutor.email]);
  if (unscheduledTutors.length > 0) {
    Logger.log("Unscheduled Tutors:", unscheduledTutors.map(tutor => tutor.getFullName()).join("\n"));
  }
}
