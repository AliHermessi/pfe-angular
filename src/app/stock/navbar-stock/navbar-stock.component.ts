import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-navbar-stock',
  templateUrl: './navbar-stock.component.html',
  styleUrls: ['./navbar-stock.component.css'] // Update styleUrls to include correct CSS file
})
export class NavbarStockComponent {
  @Input() activeTab: string = 'Dashboard';
  @Output() activeTabChange = new EventEmitter<string>();
  tab:String='';

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  toggleNav(activeTabb: string): void {
    if (this.activeTab === activeTabb) {
      this.activeTab = ''; // Close the list if the same tab is clicked again
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
}
