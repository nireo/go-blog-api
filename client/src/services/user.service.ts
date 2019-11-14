import BaseHttpService from "./base.service";
import { UserAction } from "../interfaces/user.interfaces";

export default class UserService extends BaseHttpService {
    private userServiceUrl: string = "/api/auth";

    async register(credentials: UserAction) {
        return this.post(`${this.userServiceUrl}/register`, credentials);
    }

    async login(credentials: UserAction) {
        return this.post(`${this.userServiceUrl}/login`, credentials);
    }

    async check() {
        return this.get(`${this.userServiceUrl}/check`);
    }
}
