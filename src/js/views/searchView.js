import {elements} from './base';
import { join } from 'path';

const renderRecipe= (recipe)=>{
    const markup= ` 
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt=${recipe.title}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);

}

export const getInput= ()=> elements.searchInput.value;

export const clearInput= ()=> {
    elements.searchInput.value='';
}//we use curly brackets to not return anything

export const clearResults= ()=> {
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML='';
}

export const limitTitle= (title, limit=17)=> {
    const newTitle= [];
    if(title.length>17){
        title.split(' ').reduce((accumulator, current)=>{
            if(accumulator+current.length<=limit){
                newTitle.push(current);
            }
            return accumulator+current.length;
        },0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

export const renderResults= (recipes, page=1, resPerPage=10)=> {
    //render results of current page
    const start= (page-1)*resPerPage;
    const end=page*resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderPages(page, recipes.length, resPerPage);
}

export const renderPages= (page, numResults, resPerPage) => {
    const pages= Math.ceil(numResults/resPerPage);
    let button;
    if(page==1 && pages>1){
        button=createbutton(1, 'next');
    }
    else if(page<pages){
        button= `${createbutton(page, 'next')}
                 ${createbutton(page, 'prev')}`;
    }
    if(page===pages && pages>1) {
        button=createbutton(page, 'prev');
        
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}
     
const createbutton= (page, type) => `<button class="btn-inline results__btn--${type}" data-goto=${type==='prev' ? page-1 : page+1}>
                                        <span>Page ${type==='prev'?page-1 : page+1}</span>
                                        <svg class="search__icon">
                                            <use href="img/icons.svg#icon-triangle-${type==='prev' ? 'left' : 'right'}"></use>
                                        </svg>
                                    </button>`;

