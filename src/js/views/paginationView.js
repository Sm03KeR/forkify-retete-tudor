import View from './View.js';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View {  //tot ce e in class View e si aici
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');  //cel mai apropiat element de cel cu clasa 'btn--inline'
            
            if(!btn) return;
            const goToPage = +btn.dataset.goto; //memoreaza nr paginii pe care i l-am atribuit in, de ex (data-goto="${curPage + 1}");  + converteste din string in number
            

            handler(goToPage);
        });
    }

    _generateMarkup(){
    const curPage = this._data.page;
    const numPages =Math.ceil(this._data.result.length / this._data.resultsPerPage);  //rotunjeste nr paginilor in sus, nr paginilor il aflam impartind nr elemenelor din array(cand dam search, nr rezultatelor) la nr de elemente pe care dorim sa le afisam pe pagina(in cazul nostru 10)
    //console.log(numPages);

     //Page 1, si mai sunt pagini dupa
    if(curPage === 1 && numPages > 1){
        return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }

     //Ultima pagina
    if(curPage === numPages  && numPages > 1){
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `;
    }

     //Alte pagini
    if(curPage < numPages){
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>

        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }


     //Page 1, si NU mai sunt pagini dupa
     return '';

    }
}

export default new PaginationView();