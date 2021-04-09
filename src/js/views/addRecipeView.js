import View from './View.js';
import icons from 'url:../../img/icons.svg';


class AddRecipeView extends View {  //tot ce e in class View e si aici
    _parentElement = document.querySelector('.upload');
    _succesMessage = 'Recipe was successfully uploaded! Please reload the page for the recipe to be saved in BOOKMARKS!';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();  //apelez functiile
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArray = [...new FormData(this)];  //data = un array care contine toate valorile din form (toate campurile form-ului)
            const data = Object.fromEntries(dataArray);  //transforma array ul creat mai sus intr-un object
            handler(data);
        });
    }

    _generateMarkup() {}
    
}

export default new AddRecipeView();