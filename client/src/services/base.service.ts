import axios from "axios";

export default class BaseHttpService {
    public token: null | string = null;

    async get(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        axios
            .get(endpoint, options)
            .then(response => {
                return response.data;
            })
            .catch(error => this.handleError(error));
    }

    async post(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        axios
            .post(endpoint, options)
            .then(response => {
                return response.data;
            })
            .catch(error => this.handleError(error));
    }

    async delete(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        axios
            .delete(endpoint, options)
            .then(response => {
                return response.data;
            })
            .catch(error => this.handleError(error));
    }

    async patch(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        axios
            .patch(endpoint, options)
            .then(response => {
                return response.data;
            })
            .catch(error => this.handleError(error));
    }

    getTokenHeaders(): object {
        return {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        };
    }

    handleError(error: any) {
        throw error;
    }

    saveToken(token: string) {
        this.token = token;
    }
}
