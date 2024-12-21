import {Component, OnInit} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {User} from '../../../core/module/room/User';
import {RouterLink} from '@angular/router';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzUploadChangeParam, NzUploadComponent} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {UserService} from '../../../core/service/UserService';

@Component({
  selector: "app-profile",
  imports: [
    MatIconModule, ReactiveFormsModule, NzAvatarComponent, RouterLink,
    NzInputDirective, NzButtonComponent, NzUploadComponent, NzIconDirective, NzInputGroupComponent
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {

  private _dataUser!: User;
  avatarUrl: string | undefined = '';
  isDisbaled = true
  userService = new UserService();

  ngOnInit() {
    const storedData = localStorage.getItem("data");

    if (storedData) {
      try {
        this.dataUser = JSON.parse(storedData);  // Retrieve updated user data
        this.avatarUrl = this.dataUser.profilePicture;  // Set the avatarUrl to updated picture
      } catch (error) {
        console.warn("Failed to parse stored data.");
      }
    } else {
      console.warn("No data found in localStorage.");
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.originFileObj) {
      const file = info.file.originFileObj;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.avatarUrl = reader.result?.toString();
      };
      reader.readAsDataURL(file);
    }

    if (info.file.status === "done") {
      alert("Upload successful:");
    }
  }

  handlePicture(): void {
    if (this.avatarUrl !== '') {
      this.dataUser.profilePicture = this.avatarUrl;  // Update the profile picture

      // Save the updated user object back to localStorage
      localStorage.setItem('data', JSON.stringify(this.dataUser));  // Persist updated data
      // Save the user data through the service (optional depending on backend)
      this.userService.saveUser(this.dataUser).then((response) => {
        this.dataUser = response.data;  // Update the user data after saving from backend
        this.avatarUrl = this.dataUser.profilePicture;  // Ensure the avatarUrl is updated in the template
      });
      alert("Modify successful");

    }
  }

  onDelete(code: string) {
    this._dataUser.rooms = this._dataUser.rooms.filter((ca) => ca.codeRoom !== code);
  }

  get dataUser(): User {
    return this._dataUser;
  }

  set dataUser(value: User) {
    this._dataUser = value;
  }

  handleEdit() {
    if (this.isDisbaled) {
      this.isDisbaled = false
    } else {
      this.isDisbaled = true
    }
    return this.isDisbaled
  }
}
