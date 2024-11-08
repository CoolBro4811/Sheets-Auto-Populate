const settings = {
  "FormResponsesSheet":"Copy of Form Responses 1",
  "DataRowStart":"A",
  "DataRowEnd":"T",
  "CalendarSheet":"Test Calendar Sheet: "
}

var Tutors = []

function onOpen() {
  ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Options')
    .addItem('Populate new Sheet', 'populateSheet')
    .addToUi();
}

function populateSheet() {
  Tutors = SpreadsheetApp.getActiveSpreadsheet()
                  .getSheetByName(settings.FormResponsesSheet) // Make sure this is the correct sheet name
                  .getDataRange()
                  .getValues()
                  .slice(1) // Skip header row
                  .map(row => new Tutor(row));
  let optionalDate = new Date();
  // slightly working as of 10 pm 11/7/24
  createMonthlyCalendar(null);
  assignTutorsToCalendar(null, Tutors);
}
