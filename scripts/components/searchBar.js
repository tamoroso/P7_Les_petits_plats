const recipesData = JSON.parse(window.localStorage.getItem("recipes"));

const handleSearch = (recipes, searchParams) => {
  return recipes.reduce((acc, recipe) => {
    if (
      (searchParams.length === 1 && searchParams[0].length < 3) ||
      searchParams.length <= 0
    ) {
      acc.push(recipe);
    } else {
      const ingredientList = getIngredientList(recipe.ingredients);
      const searchableProps = [
        recipe.name,
        ...ingredientList,
        recipe.description,
      ];
      const searchResult =
        searchableProps
          .map((el) => (el ? normalizeString(el.toLowerCase()) : ""))
          .filter((el) =>
            searchParams.some((param) => el.includes(normalizeString(param)))
          ).length >= searchParams.length;
      if (searchResult) {
        acc.push(recipe);
      }
    }
    return acc;
  }, []);
};

const searchBar = document.querySelector("#search");

searchBar.addEventListener("input", (event) => {
  const searchParams = event.target.value
    .toLowerCase()
    .split(" ")
    .map((el) => normalizeString(el));
  recipes = handleSearch(recipesData, searchParams);
  const tagsValue = tags.map((el) => el.value.toLowerCase());
  if (tags.length > 0) {
    recipes = handleTagSearch(tagsValue);
  }
  updateDOMContent();
});
