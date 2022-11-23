import {CustomHttp} from "../services/custom-http.js";
import pathConfig from "../../config/pathConfig.js";

export class Intervals {
    constructor() {
        this.operationsDates = [];
        this.theFirstOperationDate = null;
        this.today = {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
        }
        this.oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
        this.week = {
            year: this.oneWeekAgo.getFullYear(),
            month: this.oneWeekAgo.getMonth() + 1,
            day: this.oneWeekAgo.getDate()
        }
        this.lastMonth = new Date().getMonth > 0 ? new Date().getMonth - 1 : 11;
        this.lastMonthYear = this.lastMonth === 11 ? new Date().getFullYear() - 1 : new Date().getFullYear();
        this.oneMonthAgo = new Date(new Date().setDate(new Date().getDate() - new Date(this.lastMonthYear, this.lastMonth, 0).getDate() - 1));
        this.month = {
            year: this.oneMonthAgo.getFullYear(),
            month: this.oneMonthAgo.getMonth() + 1,
            day: this.oneMonthAgo.getDate()
        }
        this.oneYearAgo = new Date(new Date().setDate(new Date().getDate() - 365));
        this.year = {
            year: this.oneYearAgo.getFullYear(),
            month: this.oneYearAgo.getMonth() + 1,
            day: this.oneYearAgo.getDate()
        }

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(`${pathConfig.host}/operations?period=all`);
            if (result.error) throw new Error(result.message);
            if (result && !result.error && Object.keys(result).length) {
                result.forEach(operation => this.operationsDates.push(operation.date));
                this.theFirstOperationDate = this.operationsDates.sort((a, b) => {
                    return new Date(a) - new Date(b)
                })[0].split('-').reverse().join('.');
            }
        } catch (error) {
            console.log(error);
        }
    }
}