import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {CommonModule} from '@angular/common';
import RoomService from '../../../core/service/RoomService';
import { Room } from '../../../core/module/room/Room';
import { User } from '../../../core/module/room/User';

@Component({
  selector: 'app-create',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NzButtonModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzLayoutModule,
    CommonModule,
    NzIconDirective,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})

export class CreateComponent implements OnInit {
  roomService = new RoomService();
  userData: any;
  roomForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Get user ID from localStorage
    const storageDataString = localStorage.getItem('data');

    if (storageDataString) {
      try {
        this.userData = JSON.parse(storageDataString);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }

      this.roomForm = this.fb.group({
        title: ['', [Validators.required]],
      });
    }
  }

  submitForm(): void {
    if (this.roomForm.valid) {
      this.roomService.saveRoom(this.roomForm.value, this.userData).then(({data}) => {
        this.showNotification()
        this.isVisibleMiddle = false
      });
    } else {
      Object.values(this.roomForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  showNotification() {
    this.notification.template(this.template, {
      nzDuration: 3000,
      nzPlacement: 'topRight',
    });
  }


  isVisibleMiddle = false;

  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  goToRoom(): void {
    this.roomService.getRoomByCode(this.roomCode).then(({ data }) => {
      console.log(data);
      this.router.navigate(['/editor/', data]);
    });
  }
}
