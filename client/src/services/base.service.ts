import axios from 'axios';

export default class BaseHttpService {
  public token: null | string = null;

  async get(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    const response: any = await axios
      .get(endpoint, options)
      .catch(error => this.handleError(error));
    return response.data;
  }

  async post(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    const response: any = await axios
      .post(endpoint, options)
      .catch(error => this.handleError(error));
    return response.data;
  }

  async delete(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    const response: any = await axios
      .delete(endpoint, options)
      .catch(error => this.handleError(error));
    return response.data;
  }

  async patch(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    const response: any = await axios
      .patch(endpoint, options)
      .catch(error => this.handleError(error));
    return response.data;
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
