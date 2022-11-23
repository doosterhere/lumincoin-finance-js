import ChartConfig from "../../config/chartConfig.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";
import {IntervalControls} from "./interval-controls.js";
import Chart from "chart.js/auto";

export class Main {
    constructor() {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (!accessToken) {
            location.href = '#/login';
            return;
        }

        this.myChartIncomeElement = null;
        this.myChartExpenseElement = null;
        this.incomesChart = null;
        this.expensesChart = null;

        this.init();
    }

    async init() {
        this.myChartIncomeElement = document.getElementById('chart-incomes');
        this.myChartExpenseElement = document.getElementById('chart-expenses');

        this.IntervalControls = new IntervalControls(this.processOperation, this);

        this.incomesChart = new Chart(this.myChartIncomeElement, null);
        this.expensesChart = new Chart(this.myChartExpenseElement, null);

        this.IntervalControls.periodTodayElement.dispatchEvent(new Event('click', {bubbles: true}));
    }

    async processOperation(context) {
        const incomesConfig = structuredClone(ChartConfig.config);
        const expensesConfig = structuredClone(ChartConfig.config);
        expensesConfig.data.datasets[0].backgroundColor.reverse();
        incomesConfig.data.datasets[0].label = 'Доходы';
        expensesConfig.data.datasets[0].label = 'Расходы';
        context.incomesChart.destroy();
        context.expensesChart.destroy();

        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations?period=${this.period}`);
            if (result.error) throw new Error(result.message);
            if (result && !result.error) {
                result.forEach(operation => {
                    let currentConfig = null;
                    if (operation.type === 'income') currentConfig = incomesConfig;
                    if (operation.type === 'expense') currentConfig = expensesConfig;

                    if (currentConfig && !currentConfig.data.labels.some(label => (label === operation.category || !operation.category))) {
                        if (operation.category) currentConfig.data.labels.push(operation.category);
                        if (!operation.category) currentConfig.data.labels.push('удалённые категории');
                        const index = operation.category ? currentConfig.data.labels.indexOf(operation.category)
                            : currentConfig.data.labels.indexOf('удалённые категории');
                        currentConfig.data.datasets[0].data[index] = 0;
                    }

                    const index = operation.category ? currentConfig.data.labels.indexOf(operation.category)
                        : currentConfig.data.labels.indexOf('удалённые категории');
                    currentConfig.data.datasets[0].data[index] += operation.amount;
                });

                context.incomesChart = new Chart(context.myChartIncomeElement, incomesConfig);
                context.expensesChart = new Chart(context.myChartExpenseElement, expensesConfig);
            }
        } catch (error) {
            console.log(error);
        }
    }
}