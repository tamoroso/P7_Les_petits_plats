//function to get data
const fetchRecipesData = async () => {
  let headers = new Headers();
  let init = {
    method: "GET",
    headers: headers,
    mode: "cors",
    cache: "default",
  };
  let request = new Request("http://localhost:5500/data/recipes.json", init);

  try {
    let res = await fetch(request, init);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

//function to generate html
const displayData = (recipes) => {
  const recipesSection = document.querySelector(".recipes_section");
  const ingredientDropDownContent = document.querySelector(
    ".dropdown-content--ingredient"
  );
  const deviceDropDownContent = document.querySelector(
    ".dropdown-content--device"
  );
  const utensilsDropDownContent = document.querySelector(
    ".dropdown-content--utensil"
  );

  recipes.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDOM = recipeModel.getRecipeCardDOM();
    recipesSection.appendChild(recipeCardDOM);
  });

  generateSearchableDropDownDOM(
    recipes,
    ingredientDropDownContent,
    deviceDropDownContent,
    utensilsDropDownContent
  );
};

let recipes = [];

//function to initialize html page
const init = async () => {
  ({ recipes } = await fetchRecipesData());
  displayData(recipes);
  window.localStorage.setItem("recipes", JSON.stringify(recipes));
};

//call the init function
init();
