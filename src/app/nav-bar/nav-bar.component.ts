import {Component} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isOpenHumb = false

  openHumburger() {
    this.isOpenHumb = !this.isOpenHumb
    console.log(this.isOpenHumb)
  }
}
