import PathConfig from "../../config/pathConfig.js";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoKey = 'userInfo';
    static userAdditionalInfoKey = 'userAdditionalInfo';
    static catListStateKey = 'catListState';

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(`${PathConfig.host}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    console.log('The authorization token has been successfully updated.');
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/login';
        return false;
    }

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(`${PathConfig.host}/logout`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    this.removeUserInfo();
                    this.removeAdditionalUserInfo();
                    this.removeCatListState();
                    return true;
                }
            }
        }
    }

    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }

    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) return JSON.parse(userInfo);
        return null;
    }

    static removeUserInfo() {
        localStorage.removeItem(this.userInfoKey);
    }

    static setAdditionalUserInfo(info) {
        localStorage.setItem(this.userAdditionalInfoKey, JSON.stringify(info));
    }

    static getAdditionalUserInfo() {
        const userAdditionalInfo = localStorage.getItem(this.userAdditionalInfoKey);
        if (userAdditionalInfo) return JSON.parse(userAdditionalInfo);
        return null;
    }

    static removeAdditionalUserInfo() {
        localStorage.removeItem(this.userAdditionalInfoKey);
    }

    static removeCatListState() {
        localStorage.removeItem(this.catListStateKey);
    }
}