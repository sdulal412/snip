import { RouterOutlet } from '@angular/router';
import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class App {
  protected readonly title = signal('client');
}
