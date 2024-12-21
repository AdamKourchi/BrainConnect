import {Injectable} from '@angular/core';
import axios from 'axios';
import {LoginRequest} from './LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/users/';

  constructor() {
  }

  getUserData(login: LoginRequest) {
    return axios.post(this.apiUrl + 'login', login)
  }
}
