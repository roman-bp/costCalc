// Загрузка данных из JSON файлов
async function fetchJSON(url) {
    const response = await fetch(url);
    return response.json();
}

async function loadAndDisplayRecipes() {
    const components = await fetchJSON('components.json');
    const recipes = await fetchJSON('recipes.json');
    
    // Создаем объект для быстрого доступа к ценам компонентов
    const componentPrices = {};
    components.forEach(component => {
        componentPrices[component.name] = component.price;
    });

    const recipesContainer = document.getElementById('recipes-container');

    recipes.forEach(recipe => {
        const recipeCost = recipe.components.reduce((total, component) => {
            return total + (componentPrices[component.name] || 0) * component.quantity;
        }, 0);

        const card = document.createElement('div');
        card.className = 'card';

        const recipeImage = document.createElement('img');
        recipeImage.src = `images/${recipe.name.toLowerCase().replace(/ /g, '-')}.jpg`;
        recipeImage.alt = recipe.name;

        const recipeName = document.createElement('h2');
        recipeName.textContent = recipe.name;

        const details = document.createElement('div');
        details.className = 'details';

        const recipeCostElem = document.createElement('p');
        recipeCostElem.textContent = `Загальна вартість: ₴${recipeCost.toFixed(2)}`;

        details.appendChild(recipeCostElem);

        const componentsList = document.createElement('ul');
        componentsList.className = 'components-list';

        recipe.components.forEach(component => {
            const componentElem = document.createElement('li');
            componentElem.innerHTML = `${component.name}: ${component.quantity} <span>₴${(componentPrices[component.name] || 0).toFixed(2)}</span>`;
            componentsList.appendChild(componentElem);
        });

        details.appendChild(componentsList);
        card.appendChild(recipeImage);
        card.appendChild(recipeName);
        card.appendChild(details);
        recipesContainer.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadAndDisplayRecipes);
