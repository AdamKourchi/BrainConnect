import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import { UserService } from "../../../core/service/UserService";
import {LoginRequest} from '../../../core/service/LoginRequest';

@Component({
  selector: "app-login",
  imports: [],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {
  }


  onClick() {
    this.router.navigate(["/profile"]);
  }


  loginRequest: LoginRequest = {
    email: "3kelhouani@gmail.com",
    password: "12345678"
  }


  ngOnInit(): void {
    this.userService.getUserData(this.loginRequest).then((responce) => {
      if (responce.data == 1) {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(["/create"]);
      } else {
        alert("email or password incorrect")
      }
    })
  }
}
