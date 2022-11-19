import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";
import {Sidebar} from "./sidebar.js";

export class Balance {
    constructor() {
        this.balanceElement = null;
        this.period = 'today';
        this.createIncomeElement = null;
        this.createExpenseElement = null;
        this.periodTodayElement = null;
        this.periodWeekElement = null;
        this.periodMonthElement = null;
        this.periodYearElement = null;
        this.periodAllElement = null;
        this.periodIntervalElement = null;
        this.dateFromElement = null;
        this.dateToElement = null;
        this.dataTableElement = null;

        this.init();
    }

    async init() {
        this.balanceElement = document.getElementById('user-balance');
        this.createIncomeElement = document.getElementById('button-create-income');
        this.createExpenseElement = document.getElementById('button-create-expense');
        this.periodTodayElement = document.getElementById('period-today-button');
        this.periodWeekElement = document.getElementById('period-week-button');
        this.periodMonthElement = document.getElementById('period-month-button');
        this.periodYearElement = document.getElementById('period-year-button');
        this.periodAllElement = document.getElementById('period-all-button');
        this.periodIntervalElement = document.getElementById('period-interval-button');
        this.dateFromElement = document.getElementById('date-from');
        this.dateToElement = document.getElementById('date-to');
        this.dataTableElement = document.getElementById('data-table');

        const that = this;
        this.periodTodayElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            that.period = 'today';
            that.processOperation();
        }

        this.periodWeekElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            that.period = 'week';
            that.processOperation();
        }

        this.periodMonthElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            that.period = 'month';
            that.processOperation();
        }

        this.periodYearElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            that.period = 'year';
            that.processOperation();
        }

        this.periodAllElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            that.period = 'all';
            that.processOperation();
        }

        this.periodIntervalElement.onclick = function () {
            that.setButtonPeriodStyle(this);
            // that.period = `interval&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            that.processOperation();
        }

        await this.processOperation();
    }

    async processOperation() {
        this.dataTableElement.innerHTML = null;
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
                    operationType.classList.add('col-1', 'text-center', 'text-success');
                    operationType.innerText = operation.type;
                    const operationCategory = document.createElement('div');
                    operationCategory.classList.add('col-2', 'text-center');
                    operationCategory.innerText = operation.category;
                    const operationAmount = document.createElement('div');
                    operationAmount.classList.add('col-1', 'text-center');
                    operationAmount.innerText = operation.amount;
                    const operationDate = document.createElement('div');
                    operationDate.classList.add('col-2', 'text-center');
                    operationDate.innerText = operation.date;
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
                    operationEditLink.href = `#/editing-balance?id=${operation.id}`;
                    operationEditLink.classList.add('text-decoration-none', 'edit-operation-button');
                    const operationEditLinkImage = document.createElement('img');
                    operationEditLinkImage.src = 'images/pen-icon.png';
                    operationDeleteLinkImage.alt = 'edit';
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
                    this.dataTableElement.appendChild(operationData);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    setButtonPeriodStyle(button) {
        const unStylizedButton = document.querySelector('.btn-secondary');
        unStylizedButton.classList.remove('btn-secondary');
        unStylizedButton.classList.add('btn-outline-secondary');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-secondary');
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

    async setBalance(value) {
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/balance`, 'PUT', {
                balance: value
            });
            if (result && !result.error) this.balanceElement.innerText = result.balance;
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }
}