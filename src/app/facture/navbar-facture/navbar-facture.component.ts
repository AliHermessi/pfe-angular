import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-navbar-facture',
  templateUrl: './navbar-facture.component.html',
  styleUrls: ['./navbar-facture.component.css']
})
export class NavbarFactureComponent {
  @Input() activeTabFacture: string = 'Dashboard';
  @Output() activeTabChange = new EventEmitter<string>();

  showNotifications: boolean = false;
  showAllNotifications: boolean = false;
  showDropdowns: { [key: string]: boolean } = {};

  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  toggleNav(tab: string): void {
    this.activeTabFacture = tab;
    if ( tab != 'Commande' && tab != 'Facture'){
    this.activeTabChange.emit(this.activeTabFacture);
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showAllNotifications = false;
  }

  toggleDropdown(dropdown: string): void {
    this.showDropdowns[dropdown] = !this.showDropdowns[dropdown];
  }

  logout(): void {
    this.sessionStorageService.clear('roles');
    this.sessionStorageService.clear('username');

    this.router.navigate(['/login']);
  }
}