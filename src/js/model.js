import { async } from 'regenerator-runtime';
import {API_URL, RESULTS_PER_PAGE, KEY} from './config.js';
import {getJSON, sendJSON} from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        result: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = function(data) {
    const { recipe } = data.data;
    return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key}),
    };
}

export const loadRecipe = async function(id) {
    try{
        const data = await getJSON(`${API_URL}${id}`);

        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id))   //trec prin toate elem. array ului bookmarks si vad daca id lor este egal cu cel al retetei deja pe pagina
            state.recipe.bookmarked = true;
            else
            state.recipe.bookmarked = false;

        console.log(state.recipe); 
    }catch(err){
        console.error(`${err}⚠️⚠️`);
        throw err;
    }

};

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}`)
        console.log(data);

        state.search.result = data.data.recipes.map(rec => {  //trec prin toate retetele afisate, si le stochez in array-ul in state.search.result pe care il aranjez si redenumesc putin variabilele 
                return{
                    id: rec.id,
                    title: rec.title,
                    publisher: rec.publisher,
                    image: rec.image_url,
                }
        });
       
    }catch(err){
        console.error(`${err}⚠️⚠️`);
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page-1) * state.search.resultsPerPage; //(adica * 10)   //0;   //daca este la pagina 1 vine 1-1  *10 = 0
    const end = page * state.search.resultsPerPage; //(adica * 10)    //9;  //daca este la pagina 1 vine 1*10 =10   => primele rezultate sunt de la 0 la 10 , si tot asa si la pagina2 ,3 etc..

    return state.search.result.slice(start, end);
}

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        //formula pe care o folosim: newQt = oldQt * newServings / oldServings    // 2*8/4=4
        // Qt = quantity
    });

    state.recipe.servings = newServings;
}

const persistBookmarks = function() {  //functie care salveaza array ul cu bookmarks urile in local storage
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}



export const addBookmark = function(recipe) {
    //add bookmark
    state.bookmarks.push(recipe);

    //mark current recipe as bookmark
    if(recipe.id === state.recipe.id) { //daca id ul retetei din parametru(pe care o apelam) este egal cu id ul retetei deja incarcate pe site
    state.recipe.bookmarked = true;
    }

    persistBookmarks();
}

export const deleteBookmark = function(id) {
    //delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id); //index = indexul primei valori(incepe de la 0) din state.bookmarks care indeplineste conditia(id ei sa fie egal cu id ul retetei deja incarcata pe site)
    state.bookmarks.splice(index, 1); //de pe pozitai index ului se sterge 1 elem( pe scurt se elimina index ul)

    if(id === state.recipe.id) {  //daca id ul din parametru este egal cu id ul curent de pe pagina
        state.recipe.bookmarked = false;
    }

    persistBookmarks();
}


const init = function() {  //functie care salveaza in  state.bookmarks   bookmarks urile din local storage
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
init();
console.log(state.bookmarks);  //afiseaza ce am in local storage

const clearBookmarks = function() {
    localStorage.clear('bookmarks');
};
//clearBookmarks();



export const uploadRecipe = async function(newRecipe) {
    try{
    //console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe).filter(  //transform din object in array si selectez doar elementele cu ingrediente care nu sunt goale
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''     
    ).map(ing => {   //parcurg toate elementele gasite mai sus, le transform intr un object eliminand spatiile goale si punand virgula intre ele
       const ingArr = ing[1].replaceAll(' ','').split(',');
        if(ingArr.length !== 3) throw new Error('Wrong ingredient format!');

       const [quantity, unit, description] = ingArr;

       return {quantity: quantity ? +quantity: null, unit, description};
    });

    const recipe= {
        title: newRecipe.title,
        source_url : newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
    }

    //console.log(recipe); 

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);

    } catch(err) {
        throw err;
    }
    


}