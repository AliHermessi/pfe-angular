import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';
import { SessionStorageService } from 'ngx-webstorage';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
 
  activeTabAdmin:string='Dashboard';
  

  constructor(private http: HttpClient, private router: Router,private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.activeTabAdmin = sessionStorage.getItem('activeTabAdmin') || 'Dashboard';
  }


  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: Event): void {
    // Store activeTab in sessionStorage before unloading the window
    sessionStorage.setItem('activeTabAdmin',this.activeTabAdmin);
  }
  

  toggleNav(tab: string): void {
    this.activeTabAdmin = tab;
  }
  



  

  
}


