import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';//it'll be an object in wich all the exported variables from searchview file will be stored
import * as recipeView from './views/recipeView';
import List from './models/ListRecipes';
import * as listView from './views/listView';
import Likes from './models/Likes';
import { toggleLikeBtn, renderLikeList, toggleLikeList, deleteLikeList } from './views/likesView';

/*
    global state of the app
    search object 
    current recipe object
    shopping list object 
    liked recipes
*/


const state= {};
window.addEventListener('load', () => {
    state.likes= new Likes();

    state.likes.readLocalStorage();

    toggleLikeList(state.likes.getNumlikes());

    state.likes.likes.forEach(like => renderLikeList(like));

    
});

const controlSearch= async ()=> {
    //get query from view
    const query=searchView.getInput();
    if(query) {
        // 2) new search object and add to state
        state.search= new Search(query);
        //3) Prepare UI for results lke loader spinner
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4) Search for recipes
        await state.search.getResults();
        clearLoader();
        //5) render results on UI
        searchView.renderResults(state.search.recipes);
        searchView.renderPages();
    }
};



elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn= e.target.closest('.btn-inline');
    if(btn) {
        const goTo= parseInt(btn.dataset.goto, 10);
        console.log(goTo);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goTo);
    }
});
 
const controlRecipe= async ()=> {

    //get the id from url
    const id = window.location.hash.replace('#','');

    if(id) {
    //PREPARE THE UI FOR CHANGES
    renderLoader(elements.recipe);
    //CREATE NEW RECIPE OBJECT
    state.recipe= new Recipe(id); 
        //GET RECIPE DATA
    await state.recipe.getRecipe(); 
    state.recipe.parseIngredients();
    
    //CALL SERVINGS AND TIME 
    state.recipe.calcTime();
    state.recipe.calcServing();
    //RENDER RECIPE
    recipeView.clearRecipe();
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    clearLoader();
    
    }
};



//handling recipe button clicks

elements.recipe.addEventListener('click', e=> {
    if(e.target.matches('btn-decrease, btn-decrease *')) {
        state.recipe.updateServings('des');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if( e.target.matches('btn-increase, btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if( e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        controlList();
    }

    else if( e.target.matches('.recipe__love, .recipe__love *')){
        controlLikes();
    }
    
});


const controlLikes= () => {
    
    const currentId= state.recipe.id;
    if(!state.likes.isLiked(currentId)){
        //add like to the state
        const newLike=state.likes.addLike(state.recipe.id, state.recipe.title, state.recipe.author, state.recipe.img);
        //toggle like icon
        toggleLikeBtn(true);
        //add like from the list
        renderLikeList(newLike);
        
        }
    else {
        //remove like from the state
        state.likes.deleteLike(currentId);
        //toggle like icon
        toggleLikeBtn(false);
        //remove like to the list
        deleteLikeList(currentId);
        
    }
    toggleLikeList(state.likes.getNumlikes());
    
}


const controlList= () => {
    //create a new list if there is none yet
    if(!state.list) {
        state.list= new List();
    }
    state.recipe.ingredients.forEach(el => {
        const item=state.list.addItem(el.unit, el.ingredient, el.count);
        listView.renderList(item);
    });
}

//handle delete and update shopping list items
elements.shopping.addEventListener('click', e => {
    const idElement= e.target.closest('.shopping__item').dataset.itemid;
    
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(idElement);
        //delete from UI
        listView.deleteItem(idElement);
    }
    else if(e.target.matches('.shopping__count-value')){
        const value=parseFloat(e.target.value);
        state.list.updateCount(idElement, value);
    }
});


['hashchange', 'load'].forEach(event =>{
    window.addEventListener(event, controlRecipe);
});