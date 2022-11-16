import {Auth} from "../services/auth.js";
import PathConfig from "../../config/pathConfig.js"
import {CustomHttp} from "../services/custom-http.js";

export class SignIn {
    constructor(view) {
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        const isRemember = localStorage.getItem(Auth.userAdditionalInfoKey);
        if (accessToken && isRemember) {
            location.href = '#/main';
            return;
        }
        this.rememberElement = null;
        this.rememberElementText = null;
        this.processElement = null;
        this.page = view;
        this.fields = [
            {
                name: 'email',
                id: 'input-email',
                element: null,
                regex: /^[^$!#^\-_*'%?]*[a-z0-9\-_\.]{1,64}@[a-z0-9\.\-]{1,253}\.[a-z]{2,}$/i,
                valid: false
            },
            {
                name: 'password',
                id: 'input-password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false
            }
        ];

        this.init();
    }

    init() {
        if (this.page === 'signup') {
            this.fields.push(
                {
                    name: 'username',
                    id: 'input-username',
                    element: null,
                    regex: /^[A-ZА-ЯЁ][a-zа-яё]+\s*[A-ZА-ЯЁ][a-zа-яё]+$/,
                    valid: false
                },
                {
                    name: 'password-repeat',
                    id: 'input-password-repeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false
                });
        }

        const that = this;

        this.fields.forEach(field => {
            field.element = document.getElementById(field.id);
            field.element.onchange = function () {
                that.validateField.call(that, field, this);
            }
        });

        this.processElement = document.getElementById('button-process');
        this.processElement.onclick = function () {
            that.processForm();
        }

        if (this.page === 'login') {
            if (Auth.getAdditionalUserInfo()) {
                this.fields.find(field => field.name === 'email').element.value = Auth.getAdditionalUserInfo().registeredEmail;
                this.fields.find(field => field.name === 'email').element.onchange();
            }
            this.rememberElement = document.getElementById('checkbox');
            this.rememberElementText = document.getElementById('checkbox-text');
            this.rememberElementText.onclick = function () {
                that.rememberElement.checked = !that.rememberElement.checked;
            }
        }
    }


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('border-danger');
            field.valid = false;
        }

        if (element.value && element.value.match(field.regex)) {
            element.classList.remove('border-danger');
            field.valid = true;
        }

        if (field.valid && field.name === 'password-repeat' && element.value !== this.fields.find(field => field.name === 'password').element.value) {
            element.classList.add('border-danger');
            field.valid = false;
        }

        this.validateForm();
    }

    validateForm() {
        const isValid = this.fields.every(field => field.valid === true);
        if (!isValid) {
            this.processElement.classList.add('disabled');
            return false;
        }
        this.processElement.classList.remove('disabled');
        return true;
    }

    async processForm() {
        const email = this.fields.find(field => field.name === 'email').element.value;
        const password = this.fields.find(field => field.name === 'password').element.value;

        if (this.validateForm()) {

            if (this.page === 'signup') {
                try {
                    const username = this.fields.find(field => field.name === 'username').element.value.split(/\s+/);
                    const result = await CustomHttp.request(`${PathConfig.host}/signup`, 'POST', {
                        name: username[0],
                        lastName: username[1],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(field => field.name === 'password-repeat').element.value,
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                        Auth.setAdditionalUserInfo({
                            registeredEmail: email,
                            rememberMe: false
                        });
                        location.href = '#/login';
                        return;
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                const result = await CustomHttp.request(`${PathConfig.host}/login`, 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberElement.checked
                });

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        firstName: result.user.name,
                        lastName: result.user.lastName,
                        id: result.user.id
                    });
                    if (this.rememberElement.checked) {
                        Auth.setAdditionalUserInfo({
                            registeredEmail: email,
                            rememberMe: true
                        });
                    }
                    location.href = '#/main';
                }
            } catch (error) {
                return console.log(error);
            }
        }

    }
}