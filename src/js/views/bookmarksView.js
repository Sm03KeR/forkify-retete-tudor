import View from './View.js';
import icons from 'url:../../img/icons.svg';


class BookmarksView extends View {  //tot ce e in class View e si aici
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No bookmarks found yet! Please try again!:)";
    _succesMessage = "";

    _generateMarkup(){

        return this._data.map(this._generateMarkupPreview).join('');

       //daca as fi facut functia de mai jos,  generateMarkupPreview, direct in .map mai sus, in loc de result.id ar fi venit this._data.id
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    _generateMarkupPreview(result) {
        return `
        <li class="preview">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
        </li>
        `;
    }
}

export default new BookmarksView();