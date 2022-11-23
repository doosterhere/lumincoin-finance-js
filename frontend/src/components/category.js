import {Auth} from "../services/auth.js";
import PathConfig from "../../config/pathConfig.js"
import {CustomHttp} from "../services/custom-http.js";

export class Category {
    constructor(category) {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.categories = null;
        this.page = category;
        this.title = null;
        this.requestString = '';
        this.categoriesBlock = null;
        this.addCategoryElement = null;
        this.modalButtonDelete = null;
        this.modalHeaderSpan = null;
        this.categoryType = null;

        this.init();
    }

    async init() {
        const that = this;
        this.title = document.getElementById('main-title');
        this.categoriesBlock = document.getElementById('categories');
        this.modalHeaderSpan = document.querySelector('.modal-header span');
        this.modalButtonDelete = document.getElementById('modal-button-delete');
        this.modalButtonDelete.onclick = function () {
            that.deleteCategory.call(that);
        }

        if (this.page === 'incomes') {
            this.categoryType = 'Доходы';
            this.title.innerText = this.categoryType;
            this.requestString = 'categories/income';
            this.modalHeaderSpan.innerText = this.categoryType.toLowerCase();
        }
        if (this.page === 'expenses') {
            this.categoryType = 'Расходы';
            this.title.innerText = this.categoryType;
            this.requestString = 'categories/expense';
            this.modalHeaderSpan.innerText = this.categoryType.toLowerCase();
        }

        //await Category.getCategories(this.requestString).then(result => this.categories = result);

        await this.processCategories();
    }

    static async getCategories(urlParam) {
        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${urlParam}`);
            if (result && !result.error) return result;
            if (result.error) {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    processAddCategoryElement() {
        const addCategoryElement = document.createElement('div');
        addCategoryElement.classList.add('rounded-3', 'border', 'border-1', 'border-secondary', 'border-opacity-50');
        addCategoryElement.setAttribute('id', 'add-category-block');

        const addCategoryLinkElement = document.createElement('a');
        addCategoryLinkElement.href = this.page === 'incomes' ? '#/income-creating' : '#/expense-creating';
        addCategoryLinkElement.classList.add('d-flex', 'w-100', 'h-100', 'flex-grow-1', 'align-items-center', 'justify-content-center');
        addCategoryLinkElement.setAttribute('id', 'add-category');

        const addCategoryImageElement = document.createElement('img');
        addCategoryImageElement.setAttribute('src', 'images/+.png');

        addCategoryLinkElement.appendChild(addCategoryImageElement);
        addCategoryElement.appendChild(addCategoryLinkElement);
        this.categoriesBlock.appendChild(addCategoryElement);

        this.addCategoryElement = document.getElementById('add-category');
    }

    async processCategories() {
        await Category.getCategories(this.requestString).then(result => this.categories = result);

        this.categoriesBlock.innerHTML = '';
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
        this.processAddCategoryElement();
    }

    async deleteCategory() {
        const id = this.modalButtonDelete.getAttribute('data-id');
        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${this.requestString}/${id}`, 'DELETE');
            if (result && !result.error) {
                await this.processCategories();
            }
            if (result.error) {
                throw new Error(result.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
}