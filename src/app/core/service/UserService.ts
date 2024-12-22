import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from '../module/room/User';
import { LoginRequest } from './LoginRequest';
import { SignupRequest } from './SignupRequest';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private apiUrl = 'http://localhost:8080/users/';
  private apiUrl = 'http://localhost:8081/api/user/';

  saveUser(user: User) {
    return axios.post(this.apiUrl + 'save', user);
  }

  // Login and Signup
  checkUser(user: LoginRequest) {
    return axios.post(this.apiUrl + 'login', user);
  }

  save(user: SignupRequest) {
    return axios.post(this.apiUrl + 'signup', user);
  }
}
