import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  searchTerm: string = '';

  constructor(private router: Router) {}

  searchUser(): void {
    this.router.navigate(['/users'], { queryParams: { q: this.searchTerm } });
  }
}
