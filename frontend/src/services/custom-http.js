import {Auth} from "./auth.js"

export class CustomHttp {
    static async request(url, method = "GET", body = null) {
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        };

        let token = localStorage.getItem(Auth.accessTokenKey);
        if (token) params.headers['x-auth-token'] = token;

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = {};
        await fetch(url, params)
            .then(res => {
                response = res;
                if (response.status === 401) {
                    throw new Error('An invalid email/password has been entered or an authorization token update is required.');
                }
            })
            .catch((error) => console.log(error.message));

        if (response.status < 200 || response.status > 299) {
            if (response.status === 401) {
                const result = await Auth.processUnauthorizedResponse();
                if (result) {
                    return await this.request(url, method, body);
                } else return null;
            }
            throw new Error(response.message);
        }

        return await response.json();
    }
}