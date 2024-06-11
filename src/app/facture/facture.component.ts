import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrl: './facture.component.css'
})
export class FactureComponent {

  activeTabFacture: string = 'homeFacture';

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.activeTabFacture = sessionStorage.getItem('activeTabFacture') || 'homeFacture';
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    // Store activeTab in sessionStorage before unloading the window
    sessionStorage.setItem('activeTabFacture', this.activeTabFacture);
  }

  toggleNav(tab: string): void {
    this.activeTabFacture = tab;
  }
  setActiveTab(url: string): void {
    const urlSegments = url.split('/');
    this.activeTabFacture = urlSegments[urlSegments.length - 1];
  }
}
