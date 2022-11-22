import {Auth} from "../services/auth.js";
import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";

export class BalanceAction {
    constructor(action) {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.action = action;
        this.titleElementSpanAction = null;
        this.titleElementSpanType = null;
        this.actionElement = null;
        this.cancelElement = null;
        this.routeParams = UrlManager.getQueryParams();
        this.operationData = {};
        this.categoriesData = [];
        this.requestString = '';
        this.operationTypeElement = null;
        this.categoryElement = null;
        this.amountElement = null;
        this.dateElement = null;
        this.commentElement = null;
        this.incomeOptionElement = null;
        this.expenseOptionElement = null;
        this.method = null;
        this.datepickerElement = jQuery('#date-input');

        this.fields = [
            {
                id: 'category-input-list',
                initialData: null
            },
            {
                id: 'amount-input',
                initialData: null
            },
            {
                id: 'date-input',
                initialData: null
            },
            {
                id: 'comment-input',
                initialData: null
            }
        ];

        this.init();
    }

    async init() {
        this.datepickerElement.datepicker({
            format: "dd.mm.yyyy",
            weekStart: 1,
            endDate: "0d",
            todayBtn: "linked",
            clearBtn: true,
            language: "ru",
            todayHighlight: true
        });

        this.titleElementSpanAction = document.querySelector('#main-title span:first-child');
        this.titleElementSpanType = document.querySelector('#main-title span:last-child');
        this.actionElement = document.getElementById('button-action');
        this.cancelElement = document.getElementById('button-cancel');
        this.actionElement = document.getElementById('button-action');
        this.operationTypeElement = document.getElementById('type-input');
        this.incomeOptionElement = document.querySelector('#type-input option:nth-child(2)');
        this.expenseOptionElement = document.querySelector('#type-input option:last-child');
        this.categoryElement = document.getElementById('category-input-list');
        this.amountElement = document.getElementById('amount-input');
        this.dateElement = document.getElementById('date-input');
        this.commentElement = document.getElementById('comment-input');

        if (this.action === 'edit') {
            this.titleElementSpanAction.innerText = 'Редактирование';
            this.actionElement.innerText = 'Сохранить';
            await this.getOperationData().then(response => this.operationData = response);
            await this.getCategoriesData().then(response => this.categoriesData = response);
            this.processCategoriesList();
            this.categoryElement.value = this.operationData.category;
            this.amountElement.value = this.operationData.amount;
            this.dateElement.value = this.operationData.date.split('-').reverse().join('.');
            this.commentElement.value = this.operationData.comment;
            this.requestString = `operations/${this.operationData.id}`;
            this.method = 'PUT';

            this.categoryElement.onchange = this.validateFields.bind(this);

            this.fields.forEach(field => {
                field.initialData = document.getElementById(field.id).value;
            });

            this.actionElement.onclick = this.saveData.bind(this);
            this.commentElement.onchange = this.validateFields.bind(this);
        }

        if (this.action === 'create') {
            const today = new Date().toLocaleDateString();
            this.datepickerElement.datepicker('update', new Date(today));
            this.titleElementSpanAction.innerText = 'Создание';
            this.actionElement.innerText = 'Создать';
            this.operationData.type = this.routeParams.type;
            await this.getCategoriesData().then(response => this.categoriesData = response);
            this.processCategoriesList();
            this.requestString = `operations`;
            this.method = 'POST';

            this.actionElement.onclick = this.saveData.bind(this);
        }

        this.operationTypeElement.setAttribute('disabled', 'disabled');
        if (this.operationData.type === 'income') {
            this.titleElementSpanType.innerText = 'дохода';
            this.incomeOptionElement.setAttribute('selected', 'selected');
        }
        if (this.operationData.type === 'expense') {
            this.titleElementSpanType.innerText = 'расхода';
            this.expenseOptionElement.setAttribute('selected', 'selected');
        }

        this.cancelElement.onclick = function () {
            location.href = '#/balance';
        }

        this.amountElement.onchange = this.validateFields.bind(this);
        this.dateElement.focusout = this.validateFields.bind(this);
    }

    async getOperationData() {
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations/${this.routeParams.id}`);
            if (result && !result.error) return result;
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }

    async getCategoriesData() {
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/categories/${this.operationData.type}`);
            if (result && !result.error) return result;
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }

    validateFields() {
        if (!this.amountElement.value) {
            this.amountElement.classList.add('border-danger');
            this.actionElement.setAttribute('disabled', 'disabled');
            return;
        }
        this.amountElement.classList.remove('border-danger');

        if (!this.dateElement.value) {
            this.dateElement.classList.add('border-danger');
            this.actionElement.setAttribute('disabled', 'disabled');
            return;
        }
        this.dateElement.classList.remove('border-danger');

        if (this.action === 'edit') {
            const thereAreNoChanges = this.fields.every(field => field.initialData === document.getElementById(field.id).value);
            if (thereAreNoChanges) {
                this.actionElement.setAttribute('disabled', 'disabled');
                return;
            }
        }

        this.actionElement.removeAttribute('disabled');
    }

    processCategoriesList() {
        this.categoriesData.forEach(category => {
            const optionElement = document.createElement('option');
            optionElement.value = category.title;
            optionElement.innerText = category.title;
            if (this.operationData.category === category.title) {
                optionElement.setAttribute('selected', 'selected');
                this.categoryElement.setAttribute('data-initial', category.title);
            }
            this.categoryElement.appendChild(optionElement);
        });
    }

    async saveData() {
        try {
            const operation = this.categoriesData.find(category => category.title === this.categoryElement.value);
            const result = await CustomHttp.request(`${pathConfig.host}/${this.requestString}`, this.method, {
                type: this.operationData.type,
                amount: Number(this.amountElement.value),
                date: this.dateElement.value.split('.').reverse().join('-'),
                comment: this.commentElement.value === '' ? '...' : this.commentElement.value,
                category_id: Number(operation.id)
            });

            if (result && !result.error) {
                location.href = '#/balance';
                return;
            }

            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }
}