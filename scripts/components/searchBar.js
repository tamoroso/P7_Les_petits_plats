const recipesData = JSON.parse(window.localStorage.getItem("recipes"));

const handleSearch = (recipes, searchParams) => {
  let res = [];
  if (
    (searchParams.length === 1 && searchParams[0].length < 3) ||
    searchParams.length <= 0
  ) {
    return recipes;
  } else {
    for (let param = 0; param < searchParams.length; param++) {
      for (let i = 0; i < recipes.length; i++) {
        const recipeName = recipes[i].name;
        const ingredientList = getIngredientList(recipes[i].ingredients);
        const recipeDescription = recipes[i].description;
        const searchableProps = [
          recipeName,
          ...ingredientList,
          recipeDescription,
        ];
        for (
          let propIndex = 0;
          propIndex < searchableProps.length;
          propIndex++
        ) {
          const currentProp = normalizeString(
            searchableProps[propIndex].toLowerCase()
          );
          if (currentProp.includes(searchParams[param])) {
            res.push(recipes[i]);
            break;
          }
        }
      }
    }
    return res;
  }
};

const searchBar = document.querySelector("#search");

const stringToArray = (string) => {
  if (string.trim().length === 0) {
    return [];
  }
  let array = string.split(" ");
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].toString().toLowerCase();
  }
  return array;
};

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
