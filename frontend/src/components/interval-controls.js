import {Intervals} from "../utils/intervals.js";

export class IntervalControls {
    constructor(externalProcessFunction, externalContext) {
        this.period = '';
        this.periodWeekElement = null;
        this.periodTodayElement = null;
        this.periodYearElement = null;
        this.periodMonthElement = null;
        this.periodAllElement = null;
        this.periodIntervalElement = null;
        this.dateFromElement = null;
        this.dateFromInputElement = null;
        this.dateToElement = null;
        this.dateToInputElement = null;
        this.intervalApplyButton = null;
        this.intervalCloseButton = null;
        this.datepickerElement = jQuery('#datepicker');
        this.externalProcessFunction = externalProcessFunction;
        this.externalContext = externalContext;
        this.buttonsBlock = null;

        this.init();
    }

    init() {
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
        this.buttonsBlock = document.querySelector('.filter-buttons');
        this.Intervals = new Intervals();

        this.datepickerElement.datepicker({
            format: "dd.mm.yyyy",
            weekStart: 1,
            endDate: "0d",
            todayBtn: "linked",
            clearBtn: true,
            language: "ru",
            todayHighlight: true
        });

        const that = this;

        this.buttonsBlock.onclick = function () {
            if (event.target.hasAttribute('data-period')) {
                that.setButtonPeriodPressedStyle(event.target);
                that.period = event.target.getAttribute('data-period');
                that.dateToElement.innerText = `${that.Intervals.today.day}.${that.Intervals.today.month}.${that.Intervals.today.year}`;

                if (event.target !== that.periodAllElement)
                    that.dateFromElement.innerText = `${that.Intervals[that.period].day}.${that.Intervals[that.period].month}.${that.Intervals[that.period].year}`;
                if (event.target === that.periodAllElement)
                    that.dateFromElement.innerText = that.Intervals.theFirstOperationDate;

                that.externalProcessFunction(that.externalContext);
            }
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
            const dateFrom = that.dateFromElement.innerText.split('.').reverse().join('-');
            const dateTo = that.dateToElement.innerText.split('.').reverse().join('-');
            that.period = `interval&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            that.externalProcessFunction(that.externalContext);
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