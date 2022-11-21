import {Auth} from "../services/auth.js";
import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import PathConfig from "../../config/pathConfig.js";

export class CategoryAction {
    constructor(category, action) {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.category = category;
        this.action = action;
        this.titleElement = null;
        this.editableCategoryValue = null;
        this.requestString = '';
        this.actionElement = null;
        this.cancelElement = null;
        this.inputElement = null;
        this.routeParams = UrlManager.getQueryParams();
        this.backToLocation = null;

        this.init();
    }

    async init() {
        const that = this;
        this.titleElement = document.getElementById('main-title');
        this.actionElement = document.getElementById('button-action');
        this.cancelElement = document.getElementById('button-cancel');
        this.cancelElement.onclick = function () {
            location.href = that.backToLocation;
        }
        this.inputElement = document.getElementById('category-input');
        this.inputElement.oninput = this.validateInput.bind(this);

        if (this.category === 'income') {
            this.requestString = 'categories/income';
            this.backToLocation = '#/incomes';
        }

        if (this.category === 'expense') {
            this.requestString = 'categories/expense';
            this.backToLocation = '#/expenses';
        }

        if (this.action === 'create') {
            this.actionElement.innerText = 'Создать';
            this.actionElement.onclick = this.createCategory.bind(this);
        }

        if (this.action === 'edit') {
            this.actionElement.innerText = 'Сохранить';
            this.actionElement.onclick = this.editCategory.bind(this);
            this.inputElement.value = this.routeParams.title;
            this.editableCategoryValue = this.inputElement.value;
        }

        if (this.category === 'income' && this.action === 'create') {
            this.titleElement.innerText = 'Создание категории доходов';
        }

        if (this.category === 'income' && this.action === 'edit') {
            this.titleElement.innerText = 'Редактирование категории доходов';
        }

        if (this.category === 'expense' && this.action === 'create') {
            this.titleElement.innerText = 'Создание категории расходов';
        }

        if (this.category === 'expense' && this.action === 'edit') {
            this.titleElement.innerText = 'Редактирование категории расходов';
        }

    }

    async createCategory() {
        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${this.requestString}`, 'POST', {
                title: this.inputElement.value
            });

            if (result && result.error) {
                throw new Error(result.message);
            }

            if (result && result.id) {
                location.href = this.backToLocation;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async editCategory() {
        const id = this.routeParams.id;
        try {
            const result = await CustomHttp.request(`${PathConfig.host}/${this.requestString}/${id}`, 'PUT', {
                title: this.inputElement.value
            });

            if (result && result.error) {
                throw new Error(result.message);
            }

            if (result && result.id) {
                location.href = this.backToLocation;
            }
        } catch (error) {
            console.log(error);
        }
    }

    validateInput() {
        if (this.inputElement.value === '' || this.inputElement.value === this.editableCategoryValue) {
            this.actionElement.classList.add('disabled');
            return;
        }

        if (this.action === 'edit' || this.action === 'create') {
            this.actionElement.classList.remove('disabled');
        }
    }
}