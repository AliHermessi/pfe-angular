import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {
  @Input() activeTabAdmin: string = 'dashboard-admin';
  @Output() activeTabChange = new EventEmitter<string>();
  tab: String = '';
  showNotifications: boolean = false;
  showAllNotifications: boolean = false;
  showDropdowns: { [key: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit(): void {
    let storedTab = this.sessionStorageService.retrieve('activeTabAdmin');
    if (!storedTab) {
      storedTab = 'dashboard-admin'; // Default tab if none is stored
      this.sessionStorageService.store('activeTabAdmin', storedTab); // Store the default tab
      this.router.navigate(['/admin/dashboard-admin']); // Navigate to default route
    }
    this.activeTabAdmin = storedTab;
    this.toggleNav(this.activeTabAdmin);
  }

  toggleNav(tab: string): void {
    if (this.activeTabAdmin === tab) {
      this.activeTabAdmin = '';
    } else {
      this.activeTabAdmin = tab;
    }
    this.activeTabChange.emit(this.activeTabAdmin);
    this.sessionStorageService.store('activeTabAdmin', this.activeTabAdmin);
  }

  logout(): void {
    this.sessionStorageService.clear('roles');
    this.sessionStorageService.clear('username');
    this.router.navigate(['/login']);
  }

  toggle(ch: string): void {
    this.tab = ch;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showAllNotifications = false;
  }

  toggleDropdown(dropdown: string): void {
    this.showDropdowns[dropdown] = !this.showDropdowns[dropdown];
  }
}
