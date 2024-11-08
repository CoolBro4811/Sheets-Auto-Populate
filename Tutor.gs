class Tutor {
  constructor(responses) {
    this.email = responses[1].trim();
    this.firstName = responses[2].trim();
    this.lastName = responses[3].trim();
    this.grade = responses[4].trim();
    this.days = responses[5].split(", ");
    this.categories = [
      ...responses[6].split(", "),
      ...parseTutorCategories(responses[7].split(", "), "Biology"),
      ...parseTutorCategories(responses[8].split(", "), "Chemistry"),
      ...parseTutorCategories(responses[9].split(", "), "Physics"),
      ...parseTutorCategories(responses[10].split(", "), "Computer Science"),
      ...responses[11].split(", "),
      ...parseTutorLanguageCategories(responses[12].split(", "), "Spanish"),
      ...parseTutorLanguageCategories(responses[12].split(", "), "French"),
      ...parseTutorLanguageCategories(responses[12].split(", "), "ASL"),
      ...parseTutorLanguageCategories(responses[12].split(", "), "Chinese"),
      ...parseTutorLanguageCategories(responses[12].split(", "), "Japanese"),
      ...parseTutorLanguageCategories(responses[12].split(", "), "Korean"),
      ...responses[18].split(", "),
      ...parseTutorEnglishCategories(responses[19].split(", "), "English"),
    ];
  }

  // Method to add a day
  addDay(day) {
    if (!this.days.includes(day)) {
      this.days.push(day);
    }
  }

  // Method to remove a day
  removeDay(day) {
    this.days = this.days.filter(d => d !== day);
  }

  // Method to add a category
  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  // Method to remove a category
  removeCategory(category) {
    this.categories = this.categories.filter(c => c !== category);
  }

  // Method to get full name
  getFullName() {
    return this.firstName + " " + this.lastName;
  }

  // Method to update the email
  updateEmail(newEmail) {
    this.email = newEmail;
  }

  // Method to get the grade
  getGrade() {
    return this.grade;
  }

  // Method to update the grade
  updateGrade(newGrade) {
    this.grade = newGrade;
  }

  // Method to get the days available
  getDays() {
    return this.days;
  }

  // Method to get all categories
  getCategories() {
    return this.categories;
  }

  // Method to get all instance data as an object
  getInfo() {
    return {
      email: this.email,
      fullName: this.getFullName(),
      grade: this.grade,
      days: this.days,
      categories: this.categories,
    };
  }
}

