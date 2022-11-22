// noinspection DuplicatedCode

import ChartConfig from "../../config/chartConfig.js";
import {Auth} from "../services/auth.js";

export class Main {
    constructor() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.period = 'today';
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
        this.intervalApplyButton = null;
        this.intervalCloseButton = null;
        this.datepickerElement = jQuery('#datepicker');

        this.init();
    }

    async init() {
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
        this.intervalApplyButton = document.getElementById('modal-button-datepicker-apply');
        this.intervalCloseButton = document.getElementById('modal-button-datepicker-close');

        this.datepickerElement.datepicker({
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
            // that.processOperation();
        }

        this.periodWeekElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'week';
            // that.processOperation();
        }

        this.periodMonthElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'month';
            // that.processOperation();
        }

        this.periodYearElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'year';
            // that.processOperation();
        }

        this.periodAllElement.onclick = function () {
            that.setButtonPeriodPressedStyle(this);
            that.period = 'all';
            // that.processOperation();
        }

        this.periodIntervalElement.onclick = this.setButtonPeriodPressedStyle.bind(this, this.periodIntervalElement);

        this.intervalCloseButton.onclick = function () {
            that.datepickerElement.datepicker('clearDates');
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
            that.datepickerElement.datepicker('clearDates');
            that.period = `interval&dateFrom=${that.dateFromElement.innerText}&dateTo=${that.dateToElement.innerText}`;
            // that.processOperation();
        }
    }

    setButtonPeriodPressedStyle(button) {
        const unStylizedButton = document.querySelector('.btn-secondary');
        unStylizedButton.classList.remove('btn-secondary');
        unStylizedButton.classList.add('btn-outline-secondary');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-secondary');
    }
}