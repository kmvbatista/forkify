export const elements= {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    
    ingredientsList: document.querySelector('.recipe__ingredient-list'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping'),
    likesList: document.querySelector('.likes__field')
}

export const elementStrings= {
    loader: 'loader'
}

export const renderLoader= parent=> {
    const loader= `<div class="${elementStrings.loader}">
                        <svg>
                            <use href="img/icons.svg#icon-cw"></use>
                        </svg>
                    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);         
}

export const clearLoader= () => {
    const loader= document.querySelector(`.${elementStrings.loader}`);
    if(loader) {
        loader.parentElement.removeChild(loader);
    }
}