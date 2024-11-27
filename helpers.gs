const ALL_CATEGORIES = [
  "Algebra 1", "Geometry", "Biology", "Chemistry", "Physics", "Computer Science", 
  "Spanish", "French", "ASL", "Chinese", "Japanese", "Korean", "Global Studies", 
  "Freshman English", "Algebra 2", "Pre-calculus", "AP Computer Science", 
  "Spanish I", "Spanish II", "Spanish III", "French I", "French II", "French III", 
  "ASL I", "ASL II", "ASL III", "Chinese I", "Chinese II", "Chinese III", 
  "Japanese I", "Japanese II", "Japanese III", "Korean I", "Korean II", "Korean III", 
  "Ethnic Studies", "World History", "Freshman Honors English", "Sophomore English", 
  "Sophomore Honors English", "Junior English", "Calculus", "Multivariable Calculus", 
  "AP Chemistry", "AP Human Geography", "AP World History", "United States History", 
  "APUSH", "Civics/economics", "English", "AP Calculus AB", "AP Calculus BC", 
  "AP Statistics", "AP Biology", "AP Psychology"
];

function parseTutorCategories(categories, name) {
    return categories.map(category => {
      if (category == "AP") {
        return "AP " + name; // format "AP" courses
      }
      return name; // format "Regular" courses
    });
  }

function parseTutorEnglishCategories(categories, name) {
  return categories.map(category => {
    if (!(category.startsWith("AP"))) { return category + " " + name; }
    return category;
  });
}

function parseTutorLanguageCategories(categories, name) {
  return categories.map(category => {
    return name + " " + category;
  });
}

function getRandomTutors(tutors, numTutors) {
    const shuffled = tutors.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTutors);
}

function alertMessage(message) {
  SpreadsheetApp.getUi().alert(message);
}

function removeTutorByName(tutors, tutorName) {
  const tutorIndex = tutors.findIndex(tutor => tutor.getFullName() === tutorName);
  
  if (tutorIndex !== -1) {
    tutors.splice(tutorIndex, 1);
    Logger.log(tutorName + " has been removed from the list.");
  } else {
    Logger.log("Tutor not found: " + tutorName);
  }
  return tutors;
}

function findTutorsNotScheduled(tutors, monthlySchedule) {
  // Create a set to track tutors that have been scheduled
  const scheduledTutors = new Set();

  // Loop through each week's schedule in the monthly schedule
  for (const weeklySchedule of monthlySchedule) {
    // Loop through each day's schedule in the weekly schedule
    for (const day in weeklySchedule) {
      // Get the tutors scheduled for the day
      const dayTutors = weeklySchedule[day];

      // Add each tutor's full name to the scheduledTutors set
      for (const tutor of dayTutors) {
        scheduledTutors.add(tutor.getFullName());
      }
    }
  }

  // Find tutors that are not in the scheduledTutors set
  const unscheduledTutors = tutors.filter(tutor => !scheduledTutors.has(tutor.getFullName()));

  // Return the list of tutors not scheduled
  return unscheduledTutors;
}

function getMissingCategories(tutors, allCategories = ALL_CATEGORIES) {
  // Create a Set to store all categories found among tutors
  const presentCategories = new Set();
  
  // Loop through tutors and add their categories to the Set
  tutors.forEach(tutor => {
    const categories = tutor.getCategories(); // Assume getCategories() returns an array
    categories.forEach(category => presentCategories.add(category));
  });
  
  // Find missing categories by filtering allCategories
  const missingCategories = allCategories.filter(category => !presentCategories.has(category));
  
  return missingCategories;
}

function countTutorOccurrencesForDay(monthlySchedule, targetDay) {
  const tutorOccurrences = {};

  // Loop through each week in the monthly schedule
  for (const week of monthlySchedule) {
    // Check if the target day exists in the current week
    if (week[targetDay]) {
      // Loop through the tutors assigned on that day
      for (const tutor of week[targetDay]) {
        const tutorName = tutor.getFullName();

        // If this tutor has already been counted, increment their occurrence
        if (tutorOccurrences[tutorName]) {
          tutorOccurrences[tutorName][0]++; // Increment occurrences count
        } else {
          // If it's the first time the tutor is encountered, initialize the occurrences
          tutorOccurrences[tutorName] = [1, tutor]; // [occurrences, Tutor]
        }
      }
    }
  }

  // Convert the tutorOccurrences object into a 2D array (sorted by occurrences)
  const sortedTutorOccurrences = Object.values(tutorOccurrences).sort((a, b) => a[0] - b[0]);

  return sortedTutorOccurrences;
}

function recommendTutorToReplace(monthlySchedule, targetDay, unscheduledTutor) {
  const sortedTutorOccurrences = countTutorOccurrencesForDay(monthlySchedule, targetDay);

  // Log the tutors sorted by occurrence
  Logger.log("Sorted tutors by occurrences for " + targetDay + ": " + sortedTutorOccurrences.map(t => t[1].getFullName()).join(", "));
  if (sortedTutorOccurrences.length > 0) {
    let tutor = sortedTutorOccurrences[0][1];
    return("I reccomend replacing " + tutor.getFullName() + " with " + unscheduledTutor.getFullName() + " on at least one " + targetDay);
  }
  // If no suitable replacement is found, return null
  return("No suitable replacement found for " + tutorToReplace.getFullName() + " on " + targetDay);
}
