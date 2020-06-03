import { Post } from '../interfaces/post.interfaces';
import BaseHttpService from './base.service';
import { CreatePost } from '../interfaces/post.interfaces';

export default class PostService extends BaseHttpService {
  private postServiceUrl: string = '/api/posts/';

  async getPosts() {
    return this.get(this.postServiceUrl);
  }

  async getPostById(id: string) {
    return this.get(`${this.postServiceUrl}/${id}`);
  }

  async updatePost(updated: Post, id: string) {
    return this.patch(`${this.postServiceUrl}/${id}`, updated);
  }

  async createPost(newPost: CreatePost) {
    return this.post(this.postServiceUrl, newPost);
  }

  async removePost(id: string) {
    return this.post(`${this.postServiceUrl}/${id}`);
  }
}
