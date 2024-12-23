import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {User} from '../../../core/module/room/User';

@Component({
  selector: 'app-nav-bar',
  imports: [NgClass, RouterLink, NzAvatarComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {

  userData!: User

  constructor(private router: Router) {
  }

  display = true; // To toggle navbar visibility

  ngOnInit(): void {
    // Listen to router events to track current page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on specific routes
        this.display = !event.urlAfterRedirects.startsWith('/editor');
      }
    });


    const storedData = localStorage.getItem("data");
    if (storedData) {
      try {
        const parsedData: User = JSON.parse(storedData);
        this.userData = parsedData

      } catch (error) {
      }
    } else {
      console.warn("No data found in localStorage.");
    }
  }

  isOpenHumb = false;

  openHumburger() {
    this.isOpenHumb = !this.isOpenHumb;
  }


  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Log out the user
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }


}
