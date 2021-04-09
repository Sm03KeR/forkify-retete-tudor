import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';



import 'core-js/stable';
import 'regenerator-runtime/runtime';
//import { async } from 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

//if(module.hot){  //daca faci mici schimbari pe site(ca si utilizaotor), parcel v a da refresh doar la acel lucru, nu la tot site ul
//  module.hot.accept();
//}

console.log('12312');
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////




const controlRecipes = async function(){   //afisez reteta mare in dreapta
  
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;
    
    recipeView.renderSpinner();

    await model.loadRecipe(id);

    //Rendering recipe

    const mediaQuery = window.matchMedia('(max-width: 600px)');

    // Check if the media query is true
    if (mediaQuery.matches) {
      recipeView.render(model.state.recipe);
      document.querySelector('.recipe__fig').scrollIntoView();
    } else {
      recipeView.render(model.state.recipe);
    }


    

  } catch(err) {
    recipeView.renderError();
  } 

};


let searchField = document.querySelector('.search__field');
const controlSearchResults = async function(query){   //afisez si controlez rezultatele de la search
  try{
    resultsView.renderSpinner();

    //Load search results
    await model.loadSearchResults(query);

   

    document.querySelector('.message').remove();

    //render results
    //resultsView.render(model.state.search.result); 
    resultsView.render(model.getSearchResultsPage(1));
   
    //Render the initial pagination buttons
    paginationView.render(model.state.search);


  }catch(err){
    console.log(err);
  }
}

document.querySelector('.search__btn').addEventListener('click',function(e){
  e.preventDefault(); //sa nu se dea restart de an proasta la site
  controlSearchResults(searchField.value);
  if (!searchField.value) return;
  searchField.value= '';
});


const controlPagination = function(goToPage){   //afisez noile butoane de pagini si noile retete
    //render new results
    //resultsView.render(model.state.search.result);
    resultsView.render(model.getSearchResultsPage(goToPage));

    //Render new pagination buttons
    paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  //Update the recipe servings
  model.updateServings(newServings);


  //Update the recipe view
  //recipeView.render(model.state.recipe);  //dupa ce s-a updatat cu ajutorul functiei de mai sus, o afisez din nou cu valorile noi
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {

  //   Add/remove bookmark
  if(!model.state.recipe.bookmarked)
  model.addBookmark(model.state.recipe);  //daca e fals adaug la click
  else
  model.deleteBookmark(model.state.recipe.id);  //daca e true il sterg la click
  


  //update recipe view (iconita)
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try{

  addRecipeView.renderSpinner();

  //console.log(newRecipe);
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);


  //render recipe

  const mediaQuery = window.matchMedia('(max-width: 600px)');

  // Check if the media query is true
  if (mediaQuery.matches) {
    recipeView.render(model.state.recipe);
    document.querySelector('.recipe__fig').scrollIntoView();
  } else {
    recipeView.render(model.state.recipe);
  }


 // recipeView.render(model.state.recipe);


//succes message
  addRecipeView.renderMessageSucces();

  //close form window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);


  } catch(err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }
  
}

const newFeature = function() {
  console.log('new-feature');
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
  newFeature();
}
init();




