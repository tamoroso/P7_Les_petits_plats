const uniq = (array) => [...new Set(array)];

const getIngredientList = (ingredients) => {
  return ingredients.map((ingredient) => ingredient.ingredient).flat();
};

const getItems = (recipes) => {
  //Recovering ingredients, devices and utensils from JSON data
  const ingredientList = recipes
    .map((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    )
    .flat();
  const deviceList = recipes.map((recipe) => recipe.appliance);
  const utensilsList = recipes.map((recipe) => recipe.ustensils).flat();

  //Removing duplicates, elements in tags and sorting
  const {
    sortedUniqueDeviceList,
    sortedUniqueIngredientList,
    sortedUniqueUtensilsList,
  } = [ingredientList, deviceList, utensilsList].reduce(
    (acc, list, index) => {
      const filteredUniqueList = uniq(list).filter(
        (el) => tags.findIndex((tag) => tag.value === el) === -1
      );
      switch (index) {
        case 0:
          acc.sortedUniqueIngredientList = sortArray(filteredUniqueList);
          break;
        case 1:
          acc.sortedUniqueDeviceList = sortArray(filteredUniqueList);
          break;
        case 2:
          acc.sortedUniqueUtensilsList = sortArray(filteredUniqueList);
          break;
        default:
          return;
      }
      return acc;
    },
    {
      sortedUniqueDeviceList: [],
      sortedUniqueIngredientList: [],
      sortedUniqueUtensilsList: [],
    }
  );

  return {
    ingredients: sortedUniqueIngredientList,
    devices: sortedUniqueDeviceList,
    utensils: sortedUniqueUtensilsList,
  };
};

const sortArray = (array) => {
  return array.sort((a, b) => a.localeCompare(b));
};

const updateDOMContent = () => {
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
  const DOMNodes = [
    recipesSection,
    deviceDropDownContent,
    ingredientDropDownContent,
    utensilsDropDownContent,
  ];
  DOMNodes.forEach((node) => clearDOMNode(node));

  if (recipes.length === 0) {
    const p = document.createElement("p");
    p.className = "no_val_search";
    p.textContent =
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.";
    recipesSection.appendChild(p);
    return;
  }

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

/**
 * Normalize string by removing accent and trailing punctuation
 */
const normalizeString = (inputString) => {
  if (typeof inputString === "string" && inputString.length) {
    const punctuationRegex = /[!"#$%&\'()*+,-./:;<=>?@\[\\\]^_`{|}~]/gm;
    const unpunctuatedString = inputString.replace(punctuationRegex, "");
    return unpunctuatedString.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }
  return inputString;
};
