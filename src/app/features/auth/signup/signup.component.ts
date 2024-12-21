import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/service/UserService';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginRequest } from '../../../core/service/LoginRequest';
import { HandleErrors } from '../../../core/service/HandleErrors';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private handleError: HandleErrors
  ) {}

  formGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  error = '';

  onClick() {
    if (this.formGroup.invalid) {
      for (let key in this.formGroup.value) {
        const checkInput = this.handleError.checkInput(
          this.formGroup,
          key,
          key
        );
        if (checkInput) {
          this.error = checkInput;
          break;
        }
      }
    } else {
      // 1 or -1
      // this.userService.saveUserData(this.formGroup.value).then((res) => {
      //   if (res.data === -1) {
      //     this.error = 'User With this email already exist';
      //   } else {
      //     this.router.navigate(['/create']);
      //   }
      // });
    }
  }
}
