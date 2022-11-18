import {Auth} from "./services/auth.js";
import {Main} from "./components/main.js";
import {Balance} from "./components/balance.js";
import {BalanceAction} from "./components/balance-action.js";
import {Category} from "./components/category.js";
import {CategoryAction} from "./components/category-action.js";
import {SignIn} from "./components/sign-in.js";
import {Sidebar} from "./components/sidebar.js";

export class Router {
    constructor() {
        this.sidebarElement = document.getElementById('sidebar');
        this.contentElement = document.getElementById('content');

        this.routes = [
            {
                route: '#/main',
                template: 'templates/main.html',
                sidebar: true,
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/balance',
                template: 'templates/balance.html',
                sidebar: true,
                load: () => {
                    new Balance();
                }
            },
            {
                route: '#/balance-creating',
                template: 'templates/balance-action.html',
                sidebar: true,
                load: () => {
                    new BalanceAction('create');
                }
            },
            {
                route: '#/balance-editing',
                template: 'templates/balance-action.html',
                sidebar: true,
                load: () => {
                    new BalanceAction('edit');
                }
            },
            {
                route: '#/incomes',
                template: 'templates/category.html',
                sidebar: true,
                load: () => {
                    new Category('incomes');
                }
            },
            {
                route: '#/expenses',
                template: 'templates/category.html',
                sidebar: true,
                load: () => {
                    new Category('expenses');
                }
            },
            {
                route: '#/income-editing',
                template: 'templates/category-action.html',
                sidebar: true,
                load: () => {
                    new CategoryAction('income', 'edit');
                }
            },
            {
                route: '#/expense-editing',
                template: 'templates/category-action.html',
                sidebar: true,
                load: () => {
                    new CategoryAction('expense', 'edit');
                }
            },
            {
                route: '#/income-creating',
                template: 'templates/category-action.html',
                sidebar: true,
                load: () => {
                    new CategoryAction('income', 'create');
                }
            },
            {
                route: '#/expense-creating',
                template: 'templates/category-action.html',
                sidebar: true,
                load: () => {
                    new CategoryAction('expense', 'create');
                }
            },
            {
                route: '#/login',
                template: 'templates/login.html',
                sidebar: false,
                load: () => {
                    new SignIn('login');
                }
            },
            {
                route: '#/signup',
                template: 'templates/sign-up.html',
                sidebar: false,
                load: () => {
                    new SignIn('signup');
                }
            },
        ];
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if (newRoute.sidebar) {
            const sidebarTemplate = 'templates/sidebar.html';
            this.sidebarElement.innerHTML = await fetch(sidebarTemplate).then(response => response.text());
            new Sidebar();
        }

        if (!newRoute.sidebar) {
            this.sidebarElement.innerHTML = null;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());

        newRoute.load();
    }
}