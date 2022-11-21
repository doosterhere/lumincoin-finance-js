import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";

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
        this.dateFromInputElement = null;
        this.dateToElement = null;
        this.dateToInputElement = null;
        this.dataTableElement = null;
        this.intervalApplyButton = null;
        this.intervalCloseButton = null;
        this.modalButtonDelete = null;

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
        this.dateFromInputElement = document.getElementById('date-from-input');
        this.dateToElement = document.getElementById('date-to');
        this.dateToInputElement = document.getElementById('date-to-input');
        this.dataTableElement = document.getElementById('data-table');
        this.intervalApplyButton = document.getElementById('modal-button-datepicker-apply');
        this.intervalCloseButton = document.getElementById('modal-button-datepicker-close');
        this.modalButtonDelete = document.getElementById('modal-button-delete-confirm');
        this.createIncomeElement = document.getElementById('button-create-income');
        this.createExpenseElement = document.getElementById('button-create-expense');

        jQuery('#datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1,
            endDate: "0d",
            todayBtn: "linked",
            clearBtn: true,
            language: "ru",
            todayHighlight: true
        });

        const that = this;
        this.periodTodayElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'today';
            that.processOperation();
        }

        this.periodWeekElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'week';
            that.processOperation();
        }

        this.periodMonthElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'month';
            that.processOperation();
        }

        this.periodYearElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'year';
            that.processOperation();
        }

        this.periodAllElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'all';
            that.processOperation();
        }

        this.periodIntervalElement.onclick = this.setButtonPeriodPressedStyle.bind(this, this.periodIntervalElement);

        this.intervalCloseButton.onclick = function () {
            jQuery('#datepicker').datepicker('clearDates');
        }

        this.dateFromInputElement.focusout = this.dateToInputElement.focusout = function () {
            if (event.target.value === '') {
                that.intervalApplyButton.setAttribute('disabled', 'disabled');
                return;
            }
            that.intervalApplyButton.removeAttribute('disabled');
        }

        this.intervalApplyButton.onclick = function () {
            that.dateFromElement.innerText = that.dateFromInputElement.value;
            that.dateToElement.innerText = that.dateToInputElement.value;
            jQuery('#datepicker').datepicker('clearDates');
            that.period = `interval&dateFrom=${that.dateFromElement.innerText}&dateTo=${that.dateToElement.innerText}`;
            that.processOperation();
        }

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
                    operationType.innerText = operation.type === 'income' ? 'доход' : 'расход';
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
                    this.dataTableElement.appendChild(operationData);
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    setButtonPeriodPressedStyle(button) {
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

    async deleteOperation() {
        const id = this.modalButtonDelete.getAttribute('data-id');
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations/${id}`, 'DELETE');
            if (result && !result.error) {
                await this.processOperation();
                return;
            }
            if (result.error) throw new Error(result.message);
        } catch (error) {
            console.log(error);
        }
    }

    async editOperation() {

    }

    // async setBalance(value) {
    //     try {
    //         const result = await CustomHttp.request(`${pathConfig.host}/balance`, 'PUT', {
    //             balance: value
    //         });
    //         if (result && !result.error) this.balanceElement.innerText = result.balance;
    //         if (result.error) throw new Error(result.message);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}