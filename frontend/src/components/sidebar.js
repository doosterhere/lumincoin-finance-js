import {Auth} from "../services/auth.js";

export class Sidebar {
    constructor() {
        this.balanceElement = null;
        this.userNameElement = null;
        this.buttonMain = null;
        this.buttonBalance = null;
        this.buttonCategories = null;
        this.buttonIncomes = null;
        this.buttonExpenses = null;
        this.subMenu = null;
        this.location = null;
        this.bsCollapse = null;

        this.init();
    }

    init() {
        this.balanceElement = document.getElementById('user-balance');
        this.userNameElement = document.getElementById('user-name');
        this.buttonMain = document.getElementById('buttonMain');
        this.buttonBalance = document.getElementById('buttonBalance');
        this.buttonCategories = document.getElementById('buttonCategories');
        this.buttonIncomes = document.getElementById('buttonIncomes');
        this.buttonExpenses = document.getElementById('buttonExpenses');
        this.subMenu = document.getElementById('collapse');
        this.location = location.hash.split('/')[1].match(/[a-z\-]*/g)[0];

        const userName = Auth.getUserInfo();
        if (userName) this.userNameElement.innerText = `${userName.firstName} ${userName.lastName}`;

        this.bsCollapse = new bootstrap.Collapse(this.subMenu, {
            toggle: false
        });

        const that = this;

        this.buttonCategories.onclick = function () {
            this.classList.add('active');
            that.buttonMain.classList.remove('active');
            that.buttonBalance.classList.remove('active');
            if (this.classList.contains('collapsed')) {
                that.setCategoriesState('collapsed');
                setTimeout(() => {
                    this.classList.remove('rounded-0');
                    this.classList.remove('rounded-top');
                    this.classList.add('rounded');
                }, 200);
            }
            if (!this.classList.contains('collapsed')) {
                that.setCategoriesState('expanded');
                this.classList.remove('rounded');
                this.classList.add('rounded-0');
                this.classList.add('rounded-top');
            }
        }

        this.statusTracking();
    }

    statusTracking() {
        if (this.location === 'main') {
            this.buttonBalance.classList.remove('active');
            this.buttonMain.classList.add('active');
        }

        if (this.location === 'balance' || this.location === 'balance-creating' || this.location === 'balance-editing') {
            this.buttonMain.classList.remove('active');
            this.buttonBalance.classList.add('active');
        }

        if (this.location === 'balance' || this.location === 'balance-creating' || this.location === 'balance-editing' || this.location === 'main') {
            if (this.getCategoriesState() === 'expanded') {
                this.expandCategories();
                this.bsCollapse.toggle();
                this.setCategoriesState('collapsed');
            }
            this.buttonCategories.classList.remove('active');
            this.buttonIncomes.parentElement.classList.remove('active');
            this.buttonExpenses.parentElement.classList.remove('active');
        }

        if (this.location === 'incomes' || this.location === 'income-creating' || this.location === 'income-editing') {
            this.buttonMain.classList.remove('active');
            this.buttonBalance.classList.remove('active');
            this.buttonCategories.classList.add('active');
            this.buttonExpenses.parentElement.classList.remove('active');
            this.buttonIncomes.parentElement.classList.add('active');
        }

        if (this.location === 'expenses' || this.location === 'expense-creating' || this.location === 'expense-editing') {
            this.buttonMain.classList.remove('active');
            this.buttonBalance.classList.remove('active');
            this.buttonCategories.classList.add('active');
            this.buttonIncomes.parentElement.classList.remove('active');
            this.buttonExpenses.parentElement.classList.add('active');
        }

        if (this.location === 'incomes' || this.location === 'income-creating' || this.location === 'income-editing' ||
            this.location === 'expenses' || this.location === 'expense-creating' || this.location === 'expense-editing') {
            if (this.getCategoriesState() === 'expanded') this.expandCategories();
        }
    }

    expandCategories() {
        this.buttonCategories.classList.remove('rounded');
        this.buttonCategories.classList.add('rounded-0');
        this.buttonCategories.classList.add('rounded-top');
        this.buttonCategories.classList.remove('collapsed');
        this.buttonCategories.setAttribute('aria-expanded', true);
        this.subMenu.classList.add('show');
    }

    setCategoriesState(state) {
        localStorage.setItem('catListState', state);
    }

    getCategoriesState() {
        const state = localStorage.getItem('catListState');
        if (state) return state;
        return 'collapsed';
    }

    updateBalance(value) {
        this.balanceElement.innerText = value;
    }
}