import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private router: Router) {}

  forGroup = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  error = '';

  onClick() {
    console.log(this.forGroup.get('password')?.errors);
    if (!this.forGroup.valid) {
      if (
        this.forGroup.get('userName')?.errors?.['required'] &&
        this.forGroup.get('password')?.errors?.['required']
      ) {
        this.error = 'User name and Password are required';
      } else if (this.forGroup.get('userName')?.errors?.['email']) {
        this.error = 'User name is invalid';
      }
      // BUG
      // } else if (this.forGroup.get('password')?.errors?.['required']) {
      //   this.error = 'Password is required';
      // } else if (this.forGroup.get('password')?.errors?.['minlength']) {
      //   this.error = 'Password must be at least 6 characters';
      // }
    } else {
    }
  }
}
