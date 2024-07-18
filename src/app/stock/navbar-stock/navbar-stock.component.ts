import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-navbar-stock',
  templateUrl: './navbar-stock.component.html',
  styleUrls: ['./navbar-stock.component.css']
})
export class NavbarStockComponent implements OnInit {
  @Input() activeTab: string = 'home-stock';
  @Output() activeTabChange = new EventEmitter<string>();
  tab: String = '';
  showNotifications: boolean = false;
  showAllNotifications: boolean = false;
  showDropdowns: { [key: string]: boolean } = {};

  userRoles: string[] = [];
  notifications: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userRoles = this.sessionStorageService.retrieve('roles') || [];
    console.log(this.userRoles);
  
  }
  

  toggleNav(activeTabb: string): void {
    if (this.activeTab === activeTabb) {
      this.activeTab = '';
    } else {
      this.activeTab = activeTabb;
    }
    this.activeTabChange.emit(this.activeTab);
  }

  logout(): void {
    this.sessionStorageService.clear('roles');
    this.sessionStorageService.clear('username');
    this.router.navigate(['/login']);
  }

  



  toggleDropdown(dropdown: string): void {
    this.showDropdowns[dropdown] = !this.showDropdowns[dropdown];
  }
}
