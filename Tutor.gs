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

  addDay(day) {
    if (!this.days.includes(day)) {
      this.days.push(day);
    }
  }

  removeDay(day) {
    this.days = this.days.filter(d => d !== day);
  }

  addCategory(category) {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category) {
    this.categories = this.categories.filter(c => c !== category);
  }

  getFullName() {
    return this.firstName + " " + this.lastName;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
  }

  getGrade() {
    return this.grade;
  }

  updateGrade(newGrade) {
    this.grade = newGrade;
  }

  getDays() {
    return this.days;
  }

  getCategories() {
    return this.categories;
  }

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

