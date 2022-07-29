const dropDownHeader = document.querySelectorAll(".dropdown-header");
const dropDownCloseBtn = document.querySelectorAll(".close-btn");

[...dropDownHeader].forEach((el, index) =>
  el.addEventListener("click", () => {
    openDropDown(index);
  })
);

const openDropDown = (index) => {
  const dropDownContent = document.querySelectorAll(".dropdown-wrapper");
  const dropDownHeader = document.querySelectorAll(".dropdown-header");
  const targetDropDownContent = dropDownContent[index];
  const targetDropDownHeader = dropDownHeader[index];
  targetDropDownHeader.querySelector("input").style.display = "inline-block";
  targetDropDownHeader.querySelector("label").style.display = "none";
  targetDropDownContent.style.display = "block";
};

const closeDropDown = (index) => {
  const dropDownContent = document.querySelectorAll(".dropdown-wrapper");
  const dropDownHeader = document.querySelectorAll(".dropdown-header");
  const targetDropDownContent = dropDownContent[index];
  const targetDropDownHeader = dropDownHeader[index];
  const input = targetDropDownHeader.querySelector("input");
  //Reseting input and list
  const inputEvent = new Event("input");
  input.value = "";
  input.dispatchEvent(inputEvent);
  //Reverting style to initial state (only label visible)
  input.removeAttribute("style");
  targetDropDownHeader.querySelector("label").removeAttribute("style");
  targetDropDownContent.removeAttribute("style");
};

[...dropDownCloseBtn].forEach((el, index) => {
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDropDown(index);
  });
});

//TODO: Put this function in utils
const uniq = (array) => [...new Set(array)];

//TODO: Put this function in utils
const generateDOMList = (array) => {
  const handleDeleteFilter = (event) => {
    const filterList = document.querySelector(".filter-list");
    filterList.removeChild(event.target.parentElement);
  };

  //FIXME: Added filter must not be visible in the searchable dropDown
  const handleAddFilter = (event) => {
    event.preventDefault();
    const parentClasslist = event.target.offsetParent.classList;
    const filterListWrapper = document.querySelector(".filter-list");
    const li = document.createElement("li");
    li.className = "filter-pill";
    li.classList.add(
      parentClasslist.value.includes("device")
        ? "filter-pill--device"
        : parentClasslist.value.includes("ingredient")
        ? "filter-pill--ingredient"
        : parentClasslist.value.includes("utensil")
        ? "filter-pill--utensil"
        : ""
    );
    const htmlContent = `<span>${event.target.innerHTML}</span> <i class="fa-solid fa-xmark"></i>`;
    li.innerHTML = htmlContent;
    li.querySelector("i").addEventListener("click", (event) =>
      handleDeleteFilter(event)
    );
    filterListWrapper.appendChild(li);
  };

  return array.map((el) => {
    const listElement = document.createElement("li");
    htmlContent = `<a href=?${el}>${el}</a>`;
    listElement.innerHTML = htmlContent;

    listElement
      .querySelector("a")
      .addEventListener("click", (event) => handleAddFilter(event));
    return listElement;
  });
};

//TODO: Put this function in utils
const getItems = (recipes) => {
  const ingredientList = recipes
    .map((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    )
    .flat();
  const deviceList = recipes.map((recipe) => recipe.appliance);
  const utensilsList = recipes.map((recipe) => recipe.ustensils).flat();
  const uniqueUtensilsList = uniq(utensilsList);
  const uniqueDeviceList = uniq(deviceList);
  const uniqueIngredientList = uniq(ingredientList);
  return {
    ingredients: uniqueIngredientList,
    devices: uniqueDeviceList,
    utensils: uniqueUtensilsList,
  };
};

const getIngredientItemsDOM = (recipes) => {
  const { ingredients } = getItems(recipes);
  const dropDownItems = generateDOMList(ingredients);
  return dropDownItems;
};

const getDeviceItemsDOM = (recipes) => {
  const { devices } = getItems(recipes);
  const dropDownItems = generateDOMList(devices);
  return dropDownItems;
};

const getUtensilsItemsDOM = (recipes) => {
  const { utensils } = getItems(recipes);
  const dropDownItems = generateDOMList(utensils);
  return dropDownItems;
};

const handleSearchFilter = (array, searchInput) => {
  return array.filter((value) => {
    const searchString = searchInput.toLowerCase();
    return value.toString().toLowerCase().includes(searchString);
  });
};

const recipesData = JSON.parse(window.localStorage.getItem("recipes"));

const ADVANCED_SEARCH = {
  0: "ingredient",
  1: "device",
  2: "utensil",
};

[...dropDownHeader].forEach((el, index) =>
  el.querySelector("input").addEventListener("input", (event) => {
    const value = event.target.value;
    const { ingredients, devices, utensils } = getItems(recipesData);
    const searchType = ADVANCED_SEARCH[`${index}`];
    const getData = (searchType) => {
      switch (searchType) {
        case "ingredient":
          return ingredients;
        case "device":
          return devices;
        case "utensil":
          return utensils;
        default:
          return;
      }
    };
    const filteredArray = handleSearchFilter(getData(searchType), value);
    const dropDownItems = generateDOMList(filteredArray);
    //Remove all child from parent to append dropDownItems
    const dropDownContent = document.querySelector(
      `.dropdown-content--${searchType}`
    );
    while (dropDownContent.firstChild) {
      dropDownContent.removeChild(dropDownContent.firstChild);
    }
    dropDownItems.forEach((el) => dropDownContent.appendChild(el));
  })
);
