import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";
import {Auth} from "../services/auth.js";
import {Category} from "./category.js";
import {IntervalControls} from "./interval-controls.js";

export class Balance {
    constructor() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.balanceElement = null;
        this.createIncomeElement = null;
        this.createExpenseElement = null;
        this.dataTableElement = null;
        this.modalButtonDelete = null;
        this.categoriesCount = {
            incomeCount: 0,
            expenseCount: 0
        };

        this.init();
    }

    async init() {
        this.createIncomeElement = document.getElementById('button-create-income');
        this.createExpenseElement = document.getElementById('button-create-expense');
        this.balanceElement = document.getElementById('user-balance');
        this.dataTableElement = document.getElementById('data-table');
        this.modalButtonDelete = document.getElementById('modal-button-delete-confirm');

        this.IntervalControls = new IntervalControls(this.processOperation, this);

        await Category.getCategories('categories/income').then(result => this.categoriesCount.incomeCount = result.length);
        await Category.getCategories('categories/expense').then(result => this.categoriesCount.expenseCount = result.length);
        if (!this.categoriesCount.incomeCount) this.createIncomeElement.setAttribute('disabled', 'disabled');
        if (!this.categoriesCount.expenseCount) this.createExpenseElement.setAttribute('disabled', 'disabled');

        const that = this;
        this.dataTableElement.onclick = function (event) {
            const target = event.target.parentElement;

            if (target.classList.contains('delete-operation-button')) {
                that.modalButtonDelete.setAttribute('data-id', target.getAttribute('data-id'));
            }
        }

        this.modalButtonDelete.onclick = this.deleteOperation.bind(this);

        this.createIncomeElement.onclick = function () {
            location.href = '#/balance-creating?type=income';
        }

        this.createExpenseElement.onclick = function () {
            location.href = '#/balance-creating?type=expense';
        }

        this.IntervalControls.periodTodayElement.dispatchEvent(new Event('click', {bubbles: true}));
    }

    async processOperation(context) {
        context.dataTableElement.innerHTML = null;
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations?period=${this.period}`);
            if (result.error) throw new Error(result.message);
            if (result && !result.error) {
                result.forEach((operation, index) => {
                    const operationData = document.createElement('div');
                    operationData.classList.add('row', 'align-items-center', 'border-bottom', 'border-1', 'border-secondary', 'border-opacity-75');
                    const operationNumber = document.createElement('div');
                    operationNumber.classList.add('col-2', 'text-center', 'fw-bold');
                    operationNumber.innerText = index + 1;
                    const operationType = document.createElement('div');
                    const operationColorByType = operation.type === 'income' ? 'text-success' : operation.type === 'expense' ? 'text-danger' : 'text-secondary';
                    operationType.classList.add('col-1', 'text-center', operationColorByType);
                    operationType.innerText = operation.type === 'income' ? 'доход' : 'расход';
                    const operationCategory = document.createElement('div');
                    operationCategory.classList.add('col-2', 'text-center');
                    operationCategory.innerText = operation.category ? operation.category : '—';
                    const operationAmount = document.createElement('div');
                    operationAmount.classList.add('col-1', 'text-center');
                    operationAmount.innerText = operation.amount;
                    const operationDate = document.createElement('div');
                    operationDate.classList.add('col-2', 'text-center');
                    operationDate.innerText = operation.date.split('-').reverse().join('.');
                    const operationComment = document.createElement('div');
                    operationComment.classList.add('col-3', 'text-center');
                    operationComment.innerText = operation.comment;

                    const operationButtonBlock = document.createElement('div');
                    operationButtonBlock.classList.add('col-1', 'text-end', 'pe-0');
                    const operationDeleteLink = document.createElement('a');
                    operationDeleteLink.href = "javascript:void(0)";
                    operationDeleteLink.classList.add('text-decoration-none', 'me-2', 'delete-operation-button');
                    operationDeleteLink.setAttribute('data-bs-toggle', 'modal');
                    operationDeleteLink.setAttribute('data-bs-target', '#confirm-delete-window');
                    operationDeleteLink.setAttribute('data-id', operation.id);
                    const operationDeleteLinkImage = document.createElement('img');
                    operationDeleteLinkImage.src = 'images/trash-icon.png';
                    operationDeleteLinkImage.alt = 'delete';
                    operationDeleteLink.appendChild(operationDeleteLinkImage);
                    const operationEditLink = document.createElement('a');
                    operationEditLink.href = `#/balance-editing?id=${operation.id}`;
                    operationEditLink.classList.add('text-decoration-none', 'edit-operation-button');
                    const operationEditLinkImage = document.createElement('img');
                    operationEditLinkImage.src = 'images/pen-icon.png';
                    operationEditLinkImage.alt = 'edit';
                    operationEditLink.appendChild(operationEditLinkImage);
                    operationButtonBlock.appendChild(operationDeleteLink);
                    operationButtonBlock.appendChild(operationEditLink);

                    operationData.appendChild(operationNumber);
                    operationData.appendChild(operationType);
                    operationData.appendChild(operationCategory);
                    operationData.appendChild(operationAmount);
                    operationData.appendChild(operationDate);
                    operationData.appendChild(operationComment);
                    operationData.appendChild(operationButtonBlock);
                    context.dataTableElement.appendChild(operationData);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    static async getBalance() {
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/balance`);
            if (result && !result.error) return result.balance;
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteOperation() {
        const id = this.modalButtonDelete.getAttribute('data-id');
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations/${id}`, 'DELETE');
            if (result && !result.error) {
                await this.processOperation(this);
                Balance.getBalance().then(balance => this.balanceElement.innerText = balance + '$');
                console.log(result.message);
                return;
            }
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }
}