import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  RouterLink,
  Router,
  NavigationEnd,
} from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [NgClass, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {

  //Hide the Navbar on Editor Page .... Adam Kourchi

  constructor(private router: Router) {}

  display = true; // To toggle navbar visibility

  ngOnInit(): void {
    // Listen to router events to track current page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide navbar on specific routes
        this.display = event.urlAfterRedirects !== '/editor';        
      }
    });
  }

  isOpenHumb = false;

  openHumburger() {
    this.isOpenHumb = !this.isOpenHumb;
    console.log(this.isOpenHumb);
  }
}
