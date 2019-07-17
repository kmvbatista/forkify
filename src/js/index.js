import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';//it'll be an object in wich all the exported variables from searchview file will be stored
import * as recipeView from './views/recipeView';

/*
    global state of the app
    search object 
    current recipe object
    shopping list object 
    liked recipes
*/

const state= {};

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
            try {

            //GET RECIPE DATA
            await state.recipe.getRecipe();
            console.log(`state.recipe é igual a: ${state.recipe}`)
            state.recipe.parseIngredients();
            
            //CALL SERVINGS AND TIME 
            state.recipe.calcTime();
            state.recipe.calcServing();
            //RENDER RECIPE
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe);
            clearLoader();
            }
            catch(error) {
                console.log('processing error')
            }
                
        }

    };

['hashchange', 'load'].forEach(event =>{
    window.addEventListener(event, controlRecipe);
});

