import {Injectable} from '@angular/core';
import axios from 'axios';
import {User} from '../module/room/User';
import {LoginRequest} from './LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/users/';

  constructor() {
  }

  getUserData(login: LoginRequest) {
    return axios.get(this.apiUrl + 'login/email/' + login.email + '/pass/' + login.password)
  }

  saveUser(user: User) {
    return axios.post(this.apiUrl + 'save', user)
  }
}
