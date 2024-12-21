import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../../core/service/UserService';
import {LoginRequest} from '../../../core/service/LoginRequest';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {HandleErrors} from '../../../core/service/HandleErrors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private handleError: HandleErrors
  ) {
  }

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

      const loginRequest: LoginRequest = {
        email: this.formGroup.value.userName as string,
        password: this.formGroup.value.password as string,
      };

      this.userService.getUserData(loginRequest).then((res) => {
        if (res.data === null) {
          this.error = 'incorrect user name or password';
        } else {
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/create']);
        }
      });
    }
  }

}
