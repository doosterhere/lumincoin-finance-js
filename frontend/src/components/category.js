import {Auth} from "../services/auth.js";
import PathConfig from "../../config/pathConfig.js"
import {CustomHttp} from "../services/custom-http.js";

export class Category {
    constructor(view) {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.categories = null;
        this.page = view;
        this.title = null;
        this.requestString = '';
        this.categoriesBlock = null;
        this.addCategoryElement = null;
        this.modalButtonDelete = null;

        this.init();
    }

    async init() {
        const that = this;
        this.title = document.getElementById('main-title');
        this.categoriesBlock = document.getElementById('categories');
        this.addCategoryElement = document.getElementById('add-category');
        this.modalButtonDelete = document.getElementById('modal-button-delete');
        this.modalButtonDelete.onclick = function () {
            that.deleteCategory.call(that);
        }

        if (this.page === 'incomes') {
            this.title.innerText = 'Доходы';
            this.requestString = 'categories/income';
            this.addCategoryElement.setAttribute('href', '#/income-creating');
        }
        if (this.page === 'expenses') {
            this.title.innerText = 'Расходы';
            this.requestString = 'categories/expense';
            this.addCategoryElement.setAttribute('href', '#/expense-creating');
        }

        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${this.requestString}`);
            if (result && !result.error) {
                this.categories = result;
            }
            if (result.error) {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }

        this.processCategories();
    }

    processCategories() {
        if (Object.keys(this.categories).length) {
            this.categories.forEach(card => {
                const categoryElement = document.createElement('div');
                categoryElement.classList.add('p-3', 'rounded-3', 'border', 'border-1', 'border-secondary', 'border-opacity-50');

                const categoryHeaderElement = document.createElement('h4');
                categoryHeaderElement.classList.add('mb-3');
                categoryHeaderElement.innerText = card.title;

                const categoryEditButton = document.createElement('button');
                categoryEditButton.classList.add('btn', 'btn-primary', 'me-2', 'button-edit');
                categoryEditButton.innerText = 'Редактировать';
                categoryEditButton.setAttribute('data-id', `${card.id}`);

                const categoryDeleteButton = document.createElement('button');
                categoryDeleteButton.classList.add('btn', 'btn-danger', 'button-delete');
                categoryDeleteButton.innerText = 'Удалить';
                categoryDeleteButton.setAttribute('data-bs-toggle', 'modal');
                categoryDeleteButton.setAttribute('data-bs-target', '#modal-window');
                categoryDeleteButton.setAttribute('data-id', `${card.id}`);

                categoryElement.appendChild(categoryHeaderElement);
                categoryElement.appendChild(categoryEditButton);
                categoryElement.appendChild(categoryDeleteButton);
                this.categoriesBlock.appendChild(categoryElement);
            });

            const addCategoryElement = document.getElementById('add-category-block');
            this.categoriesBlock.appendChild(addCategoryElement);

            const that = this;
            this.categoriesBlock.onclick = function (event) {
                let target = event.target;
                const id = target.getAttribute('data-id');

                if (target.innerText === 'Редактировать') {
                    const title = target.previousElementSibling.innerText;
                    location.href = `#/${that.page.slice(0, -1)}-editing?id=${id}&title=${title}`;
                    return;
                }

                if (target.innerText === 'Удалить') {
                    that.modalButtonDelete.setAttribute('data-id', id);
                }
            }
        }
    }

    async deleteCategory() {
        const id = this.modalButtonDelete.getAttribute('data-id');
        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${this.requestString}/${id}`, 'DELETE');
            if (result && !result.error) {
                location.reload();
                return;
            }
            if (result.error) {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
}