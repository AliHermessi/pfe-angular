import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
  showNotifications: boolean = false;
  showAllNotifications: boolean = false;
  showDropdowns: { [key: string]: boolean } = {};
  @Input() activeTabAdmin: string = 'Dashboard';
  @Output() activeTabChange = new EventEmitter<string>();
  tab:String='';
  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  toggleNav(tab: string): void {
    this.activeTabAdmin = tab;
    this.activeTabChange.emit(this.activeTabAdmin);
  }

  logout(): void {
    this.sessionStorageService.clear('roles');
    this.sessionStorageService.clear('username');

    this.router.navigate(['/login']);
  }

toggle(ch:string) : void {
  this.tab=ch;
}

toggleNotifications(): void {
  this.showNotifications = !this.showNotifications;
  this.showAllNotifications = false;
}

toggleDropdown(dropdown: string): void {
  this.showDropdowns[dropdown] = !this.showDropdowns[dropdown];
}




}
