import { Component } from "@angular/core";
import { canvasData } from "../../../Data";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";

@Component({
  selector: "app-profile",
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {
  canvas = canvasData;

  formGroup = new FormGroup({
    email: new FormControl("ayoub123@gmail.com"),
    userName: new FormControl("Ayoub"),
    password: new FormControl("this is my password"),
    rePassword: new FormControl("this is my password again"),
  });

  showMessage = false;

  onSubmit() {
    if (this.formGroup.status === "VALID") {
      this.showMessage = true;
      setTimeout(() => (this.showMessage = false), 3000);
    }
  }

  onDelete(id: string) {
    this.canvas = this.canvas.filter((ca) => ca.id !== id);
  }
}
