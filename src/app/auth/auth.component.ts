import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  cin: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  role: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  validateForm() {
    if (!this.cin || !this.password) {
      this.errorMessage = 'CIN and Password are required.';
    } else {
      this.errorMessage = '';
      this.login();
    }
  }

  login() {
    const user = { cin: this.cin, password: this.password };
    console.log(user);

    this.http.post<any>('http://localhost:8083/auth/login', user)
      .subscribe(
        response => {
          console.log('Entire Response:', response);  // Log the entire response
          this.getUsername();
          if (response) {
            const roles = response;

            console.log('Roles:', roles);  // Log the roles

            if (this.sessionStorageService) {
              this.sessionStorageService.store('roles', roles);
              this.sessionStorageService.store('username', this.username); // Use store instead of setItem
            } else {
              console.error('SessionStorageService is undefined'); // Debugging statement
            }


            if (roles.includes('ADMIN')) {
              this.router.navigate(['/admin']);
            } else if (roles.includes('FACTURE')) {
              this.router.navigate(['/facture']);
            } else if (roles.includes('STOCK')) {
              this.router.navigate(['/stock']);
            } 
          } else {
            this.errorMessage = 'Invalid credentials';
          }
        },
        error => {
          console.error('login problem:', error);
          this.errorMessage = 'Invalid credentials';
        }
      );
  }
  getUsername(): void {
    console.log(this.cin);
  
    this.http.get('http://localhost:8083/auth/Retrieve_Username_ByCin?cin=' + this.cin, { responseType: 'text' })
      .subscribe(
        response => {
          console.log(response);
          this.username = response;
          console.log(this.username); // Make sure username is assigned properly
          if (this.sessionStorageService) {
            this.sessionStorageService.store('username', this.username);
          }
        },
        error => {
          console.error('Error retrieving username:', error);
        }
      );
  }
  
  
  
}
