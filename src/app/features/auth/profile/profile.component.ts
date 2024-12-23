import {Component, OnInit} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {Router} from '@angular/router';
import {NzInputDirective, NzInputGroupComponent} from 'ng-zorro-antd/input';
import {NzButtonComponent, NzButtonModule} from 'ng-zorro-antd/button';
import {NzUploadChangeParam, NzUploadComponent} from 'ng-zorro-antd/upload';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {UserService} from '../../../core/service/UserService';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NzModalComponent, NzModalModule} from 'ng-zorro-antd/modal';
import RoomService from '../../../core/service/RoomService';
import {User} from '../../../core/module/room/User';

@Component({
  selector: 'app-profile',
  imports: [
    MatIconModule, ReactiveFormsModule, NzAvatarComponent,
    NzInputDirective, NzButtonComponent, NzUploadComponent, NzIconDirective, NzInputGroupComponent, NzCardComponent, NzCardMetaComponent, NzModalComponent,
    NzButtonModule, NzModalModule,
    MatIconModule,
    ReactiveFormsModule,

    NzAvatarComponent,
    NzInputDirective,
    NzButtonComponent,
    NzUploadComponent,
    NzIconDirective,
    NzInputGroupComponent,
    NzCardComponent,
    NzCardMetaComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  dataUser!: User;
  avatarUrl: string | undefined = '';
  isDisbaled = true;
  userService = new UserService();
  roomService = new RoomService();

  constructor(private router: Router) {
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  ngOnInit() {
    if (this.isLoggedIn) {
    } else {
      this.router.navigate(['/login']);
    }

    const storedData = localStorage.getItem('data');

    this.dataUser = storedData ? JSON.parse(storedData) : null;

    const parsedData = storedData ? JSON.parse(storedData) : null;

    this.roomService.getUserRooms(parsedData?.id).then((response) => {
      this.dataUser.rooms = response.data;
    });
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
  }

  handlePicture(): void {
    if (this.avatarUrl !== '') {
      this.dataUser.profilePicture = this.avatarUrl; // Update the profile picture

      // Save the updated user object back to localStorage
      localStorage.setItem('data', JSON.stringify(this.dataUser)); // Persist updated data
      // Save the user data through the service (optional depending on backend)
      this.userService.saveUser(this.dataUser).then((response) => {
        this.dataUser = response.data
        this.avatarUrl = ''
      });
      alert('Modify successful');
    }
  }

  onDelete(code: string) {
    console.log(code);
  }

  onEdit(id: number) {
    this.router.navigate(['/editor', id]);
  }

  handleEdit() {
    if (this.isDisbaled) {
      this.isDisbaled = false;
    } else {
      this.isDisbaled = true;
    }
    return this.isDisbaled;
  }


  isVisible = false;

  showModal(): void {
    if (this.dataUser.profilePicture !== null) {
      this.isVisible = true;
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
