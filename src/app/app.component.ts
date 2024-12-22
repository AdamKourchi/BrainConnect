import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavBarComponent} from './features/shared/nav-bar/nav-bar.component';
import { AppFooter } from './features/shared/footer/footer.component';
import {EditorComponent} from './features/room/editor/editor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, AppFooter, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'brainConnect';
}
