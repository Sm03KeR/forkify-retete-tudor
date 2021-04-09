import icons from 'url:../../img/icons.svg';

export default class View {
    _data;
    render(data) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();  //daca nu se primeste nici o data cu care sa lucrez sau se da si nu se gaseste in api(=> ca array ul va avea lungimea 0) atunci returneaza si afiseaza mesajul de eroare

        this._data = data;
        const markup = this._generateMarkup();
        this.clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    update(data) {   //functie care da update doar la o parte din site(nu la toata, pt nu a ingreuna performanta siteului)
      if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();  

      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM = document.createRange().createContextualFragment(newMarkup); //aceasta metoda transforma string-ul pe care il returneaza functia generateMarkup() intr-un real DOM node object
      
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const curElements = Array.from(this._parentElement.querySelectorAll('*'));
      

      newElements.forEach((newEl, i) => {   //trec cu un for prin toate elementele noului element (newElements) si elementului curent (curElements), apoi le compar pe fiecare in parte
        const curEl = curElements[i];
        //console.log(curEl,newEl.isEqualNode(curEl));

        //UPDATE changed text
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){  //daca noul element nu este egal cu elementul curent si primul element/text (firstChild) contine text direct (.nodeValue)
          //console.log('😄',newEl.firstChild.nodeValue.trim());
          curEl.textContent = newEl.textContent;  //o sa se inlocuiasca doar textele care indeplinesc conditia de mai sus, fara a se ma da refreh la toata pagina
        }

        //UPDATE changed attributes (alea din data-... +1 sau -1  care cresc sau scad apasand pe buton)
        if(!newEl.isEqualNode(curEl)){
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));  //trec prin atributele elementului nou (clasa si valoarea aceea care creste cu 1 sau scade cu 1, data-update-to) si ii dau fiecarui atribut al elementului curent valorile noului element
        }
      });
    }


    clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const markup = `
          <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `
        this.clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
      };

    renderError(message = this._errorMessage) {
      const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `
      this.clear();
      this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    renderMessageSucces(message = this._succesMessage) {
      const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `
      this.clear();
      this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
}