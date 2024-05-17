import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private sessionStorageService: SessionStorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Retrieve roles from session storage
    const userRoles: Array<string> = this.sessionStorageService.retrieve('roles');
  
    // Retrieve expected roles for the route
    const expectedRoles = next.data['roles'] as Array<string>;
  
    // Check if the user roles exist and match the expected roles
    if (userRoles && this.checkRoles(userRoles, expectedRoles)) {
      return true;
    } else if (!userRoles && state.url !== '/login') {
      // If no roles are stored and not on login page, navigate to login
      console.error('Roles key does not exist in session storage');
      this.router.navigate(['/login']);
      return false;
    } else if (state.url !== '/login') {
      // If roles do not match the expected roles and not on login page, navigate to login
      console.error('User does not have the required roles');
      this.router.navigate(['/login']);
      return false;
    } else {
      // If already on login page, allow access
      return true;
    }
  }
  
  private checkRoles(userRoles: Array<string>, expectedRoles: Array<string>): boolean {
    return expectedRoles.every(role => userRoles.includes(role));
  }
}
