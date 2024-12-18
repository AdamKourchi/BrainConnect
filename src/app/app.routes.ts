import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { CreateComponent } from "./create/create.component";
import { ProfileComponent } from "./profile/profile.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "create", component: CreateComponent },
  { path: "profile", component: ProfileComponent },
  { path: "**", redirectTo: "/" },
];
