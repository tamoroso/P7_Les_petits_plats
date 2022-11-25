const recipesData = JSON.parse(window.localStorage.getItem("recipes"));
console.log(recipesData);

const handleSearch = (recipes, searchParams) => {
  let res = [];
  if (searchParams.every((param) => param.length <= 3)) {
    return recipes;
  } else {
    for (let i = 0; i < searchParams.length; i++) {
      for (let j = 0; j < recipes.length; j++) {
        const recipeName = recipes[j].name;
        const ingredientList = getIngredientList(recipes[j].ingredients);
        const recipeDescription = recipes[j].description;
        const searchableProps = [
          recipeName,
          ...ingredientList,
          recipeDescription,
        ];
        for (let k = 0; k < searchableProps.length; k++) {
          const currentProp = normalizeString(searchableProps[k].toLowerCase());
          if (currentProp.includes(searchParams[i])) {
            res.push(recipes[j]);
            break;
          }
        }
      }
    }
    return res;
  }
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
