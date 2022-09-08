const recipeFactory = (recipe) => {
  const { id, name, time, ingredients, description } = recipe;

  const getRecipeCardDOM = () => {
    const article = document.createElement("article");
    article.id = id;
    const articleContent = `
        <div class="recipe_image"></div>
        <div class="recipe_details">
            <div class="recipe_details-header">
                <h2>${name}</h2>
                <span>
                    <i class="fa-regular fa-clock"></i>
                    <span>${time} min</span>
                </span>
            </div>
            <div class="recipe_details-body">
                <ul class="recipe_details-body-ingredients">
                    ${ingredients
                      .map(
                        (el) =>
                          `<li>
                        <b>${el.ingredient}</b>
                        ${el.quantity ? `: ${el.quantity}` : ""}
                        ${el.unit ? el.unit : ""}
                        </li>`
                      )
                      .join("")}
                </ul>
                <p class="recipe_details-body-description">${description}</p>
            </div>
        </div>
        `;
    article.innerHTML = articleContent;
    return article;
  };
  return { getRecipeCardDOM };
};
