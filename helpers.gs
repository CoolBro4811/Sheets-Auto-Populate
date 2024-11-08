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
