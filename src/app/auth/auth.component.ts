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

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) { }

  login() {
    const user = { cin: this.cin, password: this.password };

    this.http.post<any>('http://localhost:8083/auth/login', user)
      .subscribe(
        response => {
          this.getUsername();
          if (response) {
            const roles = response;
            if (this.sessionStorageService) {
              this.sessionStorageService.store('roles', roles);
              this.sessionStorageService.store('username', this.username);
            }
            if (roles.includes('ADMIN')) {
              this.router.navigate(['/admin']);
            } else if (roles.includes('FACTURE')) {
              this.router.navigate(['/facture']);
            } else if (roles.includes('STOCK')) {
              this.router.navigate(['/stock']);
            }
          } else {
            this.errorMessage = 'Informations incorrectes. Veuillez vérifier votre CIN et votre mot de passe.';
          }
        },
        error => {
          console.error('Erreur de connexion:', error);
          this.errorMessage = 'Erreur de connexion. Veuillez réessayer plus tard.';
        }
      );
  }

  getUsername(): void {
    this.http.get<any>('http://localhost:8083/auth/Retrieve_Username_ByCin?cin=' + this.cin)
      .subscribe(
        response => {
          this.username = response.username;
          if (this.sessionStorageService) {
            this.sessionStorageService.store('username', this.username);
            this.sessionStorageService.store('userId', response.id);
          }
        },
        error => {
          console.error('Erreur lors de la récupération du nom d\'utilisateur:', error);
        }
      );
  }

  handleEnter(event: Event) {
    if ((event as KeyboardEvent).key === 'Enter') {
      event.preventDefault();
      this.validateForm();
    }
  }
  validateForm() {
    if (!this.cin || !this.password) {
      this.errorMessage = 'CIN and Password are required.';
    } else if (!this.cin){
      this.errorMessage = 'CIN is required.';
    }else if(!this.password){
      this.errorMessage = 'Password is required.';
    }else{
      this.errorMessage = '';
      this.login();
    }
  }

}
