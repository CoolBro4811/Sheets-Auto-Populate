const MAX_TUTORS_PER_DAY = 4;

function generateTutorSchedule(tutors, maxTutorsPerDay = MAX_TUTORS_PER_DAY, maxTutorsForThursday) {
  const weeklySchedule = [];

  // Logger.log(unscheduledTutors.map(tutor => tutor.getFullName()).join("\n"));
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const badDays = [];

  // Generate schedule for 4 weeks
  for (let week = 0; week < 4; week++) {
    let weeklyScheduleForWeek = {};
    let unscheduledTutors = tutors.slice();

    for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
      const dayName = daysOfWeek[dayIndex];
      let dayTutors = [];
      const maxTutors = (dayName === "Thursday") ? maxTutorsForThursday : maxTutorsPerDay;
      
      let attempts = 0; // Counter to prevent infinite loops

      while (dayTutors.length < maxTutors && attempts < 20) { // 10 attempts to avoid infinite loop
        let availableTutors = unscheduledTutors.filter(tutor => tutor.getDays().includes(dayName) && !dayTutors.includes(tutor));
        Logger.log("available tutors == " + availableTutors.map(tutor => tutor.getFullName()).join(", "));
        if (availableTutors.length == 0) {
          availableTutors = tutors.filter(tutor => tutor.getDays().includes(dayName) && !dayTutors.includes(tutor));
        }
        const potentialTutors = getRandomTutors(availableTutors, maxTutors - dayTutors.length);

        for (const tutor of potentialTutors) {
          if (tutor.getDays().includes(dayName)) {
            // If tutor is available for the day, add them
            Logger.log(tutor.getFullName() + " days: " + tutor.getDays().join(", ") + " " + (dayTutors.length + 1) + " tutors scheduled");
            dayTutors.push(tutor);
            unscheduledTutors.splice(unscheduledTutors.indexOf(tutor), 1); // Remove tutor from unscheduled list
          }
        }

        attempts++;
        if (unscheduledTutors.length === 0 || potentialTutors.length === 0) {
          // No more tutors available or shuffled list is empty
          break;
        }
      }

      if (dayTutors.length < maxTutors) {
        // If no tutors could be scheduled for the day, log a warning
        badDays.push(dayName);
      }

      // Assign the day's tutors to the weekly schedule
      weeklyScheduleForWeek[dayName] = dayTutors;
    }

    // Add this week's schedule to the monthly schedule
    weeklySchedule.push(weeklyScheduleForWeek);
  }

  Logger.log(weeklySchedule.map(weeklyScheduleForWeek => Object.values(weeklyScheduleForWeek).map(week => week.map(tutor => tutor.getFullName()).join(" ")).join("\n")).join("\n").toString());

  let unscheduledTutorsForWholeMonth = findTutorsNotScheduled(tutors, weeklySchedule);
  alertMessage("Unscheduled throughout whole month: " + (unscheduledTutorsForWholeMonth.length == 0 ? 'None :)' : unscheduledTutorsForWholeMonth.map(tutor => tutor.getFullName() + ", available for : " + tutor.getDays()).join(" ")));

  // recommendTutorToReplace(monthlySchedule, targetDay, unscheduledTutor)
  for (const tutor of unscheduledTutorsForWholeMonth) {
    var days = tutor.getDays();
    var res = days.length > 1 ? "Please try to do one of the following:\n" : "Please try to do the following:\n";
    for (const day of days) {
      res += recommendTutorToReplace(weeklySchedule, day, tutor) + "\n";
    }
    alertMessage(res);
  }

  return [weeklySchedule, badDays.filter(day => ["Monday", "Tuesday", "Wednesday", "Thursday"].includes(day))];
}
