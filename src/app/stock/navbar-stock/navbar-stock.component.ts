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
  @Input() activeTab: string = 'Dashboard';
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
  
    this.notificationService.connect().subscribe((notification: { roles: string | string[], message: string }) => {
      // Extracting the text before the first "-"
      const notificationText = notification.message.split("-")[0].trim();
      
      // Creating a new notification object with updated message
      const updatedNotification = { ...notification, message: notificationText };
      
      // Pushing the updated notification to the notifications array
      this.notifications.push(updatedNotification);
      
      // Playing the notification sound
      this.playNotificationSound();
    });
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

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showAllNotifications = false;
  }

  playNotificationSound(): void {
    // You can add the path to your notification sound file here
    // For now, we'll just use an empty string
    const audio = new Audio('assets/mixkit-message-pop-alert-2354.mp3');
    audio.play();
  }

  createNotification(message: string, roles: string[]): void {
    const notification = { message, roles, entityName: 'Produit' };
    this.notificationService.createNotification(notification).subscribe();
  }

  toggleDropdown(dropdown: string): void {
    this.showDropdowns[dropdown] = !this.showDropdowns[dropdown];
  }
}
