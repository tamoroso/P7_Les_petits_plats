const dropDownHeader = document.querySelectorAll(".dropdown-header");
const dropDownCloseBtn = document.querySelectorAll(".close-btn");
const ADVANCED_SEARCH = {
  0: "ingredient",
  1: "device",
  2: "utensil",
};
let tags = [];

const getItemsDOM = (recipes) => {
  const { ingredients, devices, utensils } = getItems(recipes);
  return {
    ingredientDropDownDOM: generateDOMList(ingredients),
    deviceDropDownDOM: generateDOMList(devices),
    utensilsDropDownDOM: generateDOMList(utensils),
  };
};

const generateSearchableDropDownDOM = (
  recipes,
  ingredientDropDownContent,
  deviceDropDownContent,
  utensilsDropDownContent
) => {
  const { ingredientDropDownDOM, deviceDropDownDOM, utensilsDropDownDOM } =
    getItemsDOM(recipes);

  ingredientDropDownDOM.forEach((item) =>
    ingredientDropDownContent.appendChild(item)
  );
  deviceDropDownDOM.forEach((item) => deviceDropDownContent.appendChild(item));
  utensilsDropDownDOM.forEach((item) =>
    utensilsDropDownContent.appendChild(item)
  );
};

const clearDOMNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

/**
 * Handling style change when clicking on searchable dropdown element
 * @param {number} index index of the element
 */
const openDropDown = (index) => {
  const dropDownContent = document.querySelectorAll(".dropdown-wrapper");
  const dropDownHeader = document.querySelectorAll(".dropdown-header");
  const targetDropDownContent = dropDownContent[index];
  const targetDropDownHeader = dropDownHeader[index];
  targetDropDownHeader.querySelector("input").style.display = "inline-block";
  targetDropDownHeader.querySelector("label").style.display = "none";
  targetDropDownContent.style.display = "block";
};

[...dropDownHeader].forEach((el, index) =>
  el.addEventListener("click", () => {
    openDropDown(index);
  })
);

/**
 * Handling style change and reseting text input on searchable dropdown element
 * @param {number} index index if the element
 */
const closeDropDown = (index) => {
  const dropDownContent = document.querySelectorAll(".dropdown-wrapper");
  const dropDownHeader = document.querySelectorAll(".dropdown-header");
  const targetDropDownContent = dropDownContent[index];
  const targetDropDownHeader = dropDownHeader[index];
  const input = targetDropDownHeader.querySelector("input");
  //Reseting input and list
  if (input.value.length > 0) {
    const inputEvent = new Event("input");
    input.value = "";
    input.dispatchEvent(inputEvent);
  }
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

const handleTagSearch = (tagsValue) => {
  return recipes.reduce((acc, recipe) => {
    if (tags.length === 0) {
      acc.push(recipe);
    } else {
      const ingredientList = getIngredientList(recipe.ingredients);
      const searchableProps = [
        recipe.appliance,
        ...ingredientList,
        ...recipe.ustensils,
      ];
      const normalizedSearchableProps = searchableProps.map((el) =>
        el ? normalizeString(el.toLowerCase()) : ""
      );
      const searchResult = tagsValue.every((param) =>
        normalizedSearchableProps.includes(normalizeString(param))
      );
      if (searchResult) {
        acc.push(recipe);
      }
    }
    return acc;
  }, []);
};

/**
 * Generate a DOM list with the array of string provided
 * @param {string[]} array an array of string
 * @returns DOM list element with event listener attached to it
 */
const generateDOMList = (array) => {
  const handleDeleteFilter = (event) => {
    const filterList = document.querySelector(".filter-list");
    const classList = event.target.parentNode.classList;
    const dropDownClassName = `.dropdown-content--${
      classList.value.includes("device")
        ? "device"
        : classList.value.includes("ingredient")
        ? "ingredient"
        : classList.value.includes("utensil")
        ? "utensil"
        : ""
    }`;
    const dropDownContent = document.querySelector(dropDownClassName);
    filterList.removeChild(event.target.parentElement);
    const elementToInsert = tags.find(
      (el) => el.value === event.target.parentNode.textContent.trim()
    );
    tags.splice(
      tags.findIndex(
        (tag) => tag.value === event.target.parentNode.textContent.trim()
      ),
      1
    );
    dropDownContent.insertBefore(
      elementToInsert.node,
      dropDownContent.childNodes[elementToInsert.index]
    );
    const tagsValue = tags.map((el) => el.value.toLowerCase());
    const searchParams = searchBar.value.toLowerCase().split(" ");
    recipes = handleSearch(recipesData, searchParams);
    if (tags.length > 0) {
      recipes = handleTagSearch(tagsValue, false);
    }
    updateDOMContent();
  };

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

    //Remove clicked items from dropDown list
    const spans = event.target.offsetParent.querySelectorAll("span");
    const elementToRemoveIndex = [...spans]
      .map((el) => el.textContent)
      .indexOf(event.target.textContent);
    const elementToRemove = spans.item(elementToRemoveIndex);
    tags.unshift({
      type: parentClasslist.value,
      value: event.target.textContent,
      index: elementToRemoveIndex,
      node: event.target.parentNode,
    });
    event.target.offsetParent
      .querySelector("ul")
      .removeChild(elementToRemove.parentNode);

    //Updating content with added tags
    const tagsValue = tags.map((el) => el.value.toLowerCase());
    recipes = handleTagSearch(tagsValue);
    updateDOMContent();
  };

  return array.map((el) => {
    const listElement = document.createElement("li");
    htmlContent = `<span>${el}</span>`;
    listElement.innerHTML = htmlContent;
    listElement
      .querySelector("span")
      .addEventListener("click", (event) => handleAddFilter(event));
    return listElement;
  });
};

/**
 * Handle the search by text input in searchable dropdown
 * @param {string[]} array
 * @param {string} searchInput
 * @returns An array of string filtered by the provided searchInput param
 */
const handleSearchFilter = (array, searchInput) => {
  if (searchInput === "") {
    return array;
  }
  return array.reduce((acc, value) => {
    const searchString = normalizeString(searchInput.toLowerCase().trim());
    if (
      normalizeString(value).toString().toLowerCase().includes(searchString) &&
      tags.findIndex((tag) => tag.value === value) === -1
    ) {
      acc.push(value);
    }
    return acc;
  }, []);
};

/**
 * Attaching the above search function to the text input
 */
[...dropDownHeader].forEach((el, index) =>
  el.querySelector("input").addEventListener("input", (event) => {
    const value = event.target.value;
    const { ingredients, devices, utensils } = getItems(recipes);
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
    const sortedArray = sortArray(filteredArray);
    const dropDownItems = generateDOMList(sortedArray);
    //Remove all child from parent to append dropDownItems
    const dropDownContent = document.querySelector(
      `.dropdown-content--${searchType}`
    );
    clearDOMNode(dropDownContent);
    dropDownItems.forEach((el) => dropDownContent.appendChild(el));
  })
);
