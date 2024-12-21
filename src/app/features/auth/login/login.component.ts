import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../../../core/service/UserService";
import {FormsModule} from '@angular/forms';
import {data} from 'autoprefixer';
import {User} from '../../../core/module/room/User';
import {LoginRequest} from '../../../core/service/LoginRequest';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [
    FormsModule
  ],
  // Fix styleUrl typo to styleUrls
})
export class LoginComponent implements OnInit {
  username: string = ""; // Bind to the username input
  password: string = ""; // Bind to the password input

  dataUser!: User

  constructor(private router: Router, private userService: UserService) {
  }

  login() {
    const loginRequest: LoginRequest = {
      email: this.username, // Use the username input for the email field
      password: this.password,
    };

    this.userService.getUserData(loginRequest).then((response) => {
      if (response.data !== null) {
        this.dataUser = {
          ...response.data
        }
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("data", JSON.stringify(this.dataUser));
        this.router.navigate(["/create"]);
      } else {
        alert("Email or password incorrect");
      }
    });
  }

  ngOnInit(): void {
  }
}
