import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTabAdmin: string = 'Dashboard';
  selectedProduits: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.activeTabAdmin = sessionStorage.getItem('activeTabAdmin') || 'Dashboard';
    
    this.sharedService.activeTabAdmin$.subscribe((tab: string) => this.activeTabAdmin = tab);
    this.sharedService.selectedProduits$.subscribe((produits: any[]) => this.selectedProduits = produits);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    sessionStorage.setItem('activeTabAdmin', this.activeTabAdmin);
  }

  toggleNav(tab: string): void {
    this.activeTabAdmin = tab;
    sessionStorage.setItem('activeTabAdmin', tab);
  }
}
