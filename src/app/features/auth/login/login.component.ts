import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/service/UserService';
import { LoginRequest } from '../../../core/service/LoginRequest';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HandleErrors } from '../../../core/service/HandleErrors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private handleError: HandleErrors
  ) {}

  formGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  error = '';

  onClick() {
    if (this.formGroup.invalid) {
      const checkUserName = this.handleError.checkInput(
        this.formGroup,
        'userName',
        'User Name'
      );
      const checkPassword = this.handleError.checkInput(
        this.formGroup,
        'password',
        'Password'
      );

      if (checkUserName) {
        this.error = checkUserName;
      } else if (checkPassword) {
        this.error = checkPassword;
      }
    } else {
      console.log(this.formGroup.invalid, '-------');
      // 1 or -1
      // this.userService.getUserData(this.formGroup.value).then((res) => {
      //   if (res.data === -1) {
      //     this.error = 'incorrect user name or password';
      //   } else {
      //     this.router.navigate(['/create']);
      //   }
      // });
    }
  }

  loginRequest: LoginRequest = {
    email: '3kelhouani@gmail.com',
    password: '12345678',
  };

  ngOnInit(): void {
    this.userService.getUserData(this.loginRequest).then((responce) => {
      if (responce.data == 1) {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/create']);
      } else {
        alert('email or password incorrect');
      }
    });
  }
}
