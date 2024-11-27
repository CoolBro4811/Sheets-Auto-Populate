const settings = {
  "FormResponsesSheet":"Copy of Form Responses 1",
  "DataRowStart":"A",
  "DataRowEnd":"T",
  "CalendarSheet":"Test Calendar Sheet (temp): "
}

var Tutors = []

function onOpen() {
  ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Options')
    .addItem('Populate new Sheet', 'populateSheet')
    .addItem('Populate new Sheet (From Specified Month)', 'populateSheetFromMonth')
    .addToUi();
}

function populateSheet() {
  Tutors = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName(settings.FormResponsesSheet)
                  .getDataRange()
                  .getValues()
                  .slice(1) // Skip header row
                  .map(row => new Tutor(row));
  let optionalDate = new Date();
  Tutors = removeTutorByName(removeTutorByName(Tutors, "Ko Ko Oo"), "Raghav Sreekumar");
  // both ko ko and raghav are scheduled for all days of week
  // comment this line if you would like to add them to the actual schedule


  // slightly working as of 10:49 pm 11/7/24
  createMonthlyCalendar(optionalDate, Tutors);
}

function populateSheetFromMonth() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Enter the month and year (MM/YYYY):');

  if (response.getSelectedButton() === ui.Button.OK) {
    const inputDate = response.getResponseText();
    
    // Validate input
    const datePattern = /^\d{2}\/\d{4}$/;
    if (!datePattern.test(inputDate)) {
      ui.alert("Invalid format! Please use MM/YYYY format.");
      return;
    }

    const [month, year] = inputDate.split('/').map(Number);
    const optionalDate = new Date(year, month - 1);

    Tutors = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName(settings.FormResponsesSheet)
                  .getDataRange()
                  .getValues()
                  .slice(1) // Skip header row
                  .map(row => new Tutor(row));
    
    Tutors = removeTutorByName(removeTutorByName(Tutors, "Ko Ko Oo"), "Raghav Sreekumar");
    // both ko ko and raghav are scheduled for all days of week
    // comment this line if you would like to add them to the actual schedule

    createMonthlyCalendar(optionalDate, Tutors);
  }
}
