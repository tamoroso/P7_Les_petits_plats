const handleSearch = (recipes, searchParams) => {
  return recipes.reduce((acc, recipe) => {
    if (searchParams.length <= 0) {
      acc.push(recipe);
    } else {
      const searchableProps = [recipe.name];
      const searchResult =
        searchableProps
          .map((el) => (el ? el.toLowerCase() : ""))
          .filter((el) => searchParams.some((param) => el.includes(param)))
          .length >= searchParams.length;
      if (searchResult) {
        acc.push(recipe);
      }
    }
    return acc;
  }, []);
};

const searchBar = document.querySelector("#search");

//TODO: Add this event listener on URL query params change
searchBar.addEventListener("input", (event) => {
  const searchParams = event.target.value.toLowerCase().split(" ");
  //   console.log(searchParams);
  const res = handleSearch(recipesData, searchParams);
  const recipesSection = document.querySelector(".recipes_section");
  while (recipesSection.firstChild) {
    recipesSection.removeChild(recipesSection.firstChild);
  }
  res.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDOM = recipeModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCardDOM);
  });
  console.log(res);
});
