import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

  userCin :String = '';
  userName : String = '';
  userId : number = 0 ;
  users : any[] = [];
  

  constructor(private http: HttpClient, private router: Router,private sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }




  fetchUsers(): void {
    

    this.http.get<any[]>('http://localhost:8083/users/getAll')
      .subscribe(
        response => {
          
          this.users = response;
          
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
  }



}
