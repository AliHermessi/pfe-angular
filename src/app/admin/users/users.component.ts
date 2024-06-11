import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  userCin: String = '';
  userName: String = '';
  userId: number = 0;
  users: any[] = [];
  paginatedUsers: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  emptyRows: any[] = [];
  constructor(private http: HttpClient, private router: Router, private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://localhost:8083/users/getAll')
      .subscribe(
        response => {
          this.users = response;
          this.updatePagination();
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
  }

  searchUsers(): void {
    if (this.searchTerm) {
      this.paginatedUsers = this.users.filter(user => user.username.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.updatePagination();
    }
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
    this.fillEmptyRows();
  }

  fillEmptyRows(): void {
    const emptyCount = this.pageSize - this.paginatedUsers.length;
    this.emptyRows = new Array(emptyCount);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  editUser(user: any): void {
    Swal.fire({
      title: 'Edit User',
      html: `
        <input id="cin" class="swal2-input" placeholder="CIN" value="${user.cin}">
        <input id="username" class="swal2-input" placeholder="Username" value="${user.username}">
        <div class="form-group">
          <label for="roles">Roles:</label><br>
          <input type="checkbox" id="stock" name="stock" value="STOCK" ${user.role.includes('STOCK') ? 'checked' : ''}> STOCK<br>
          <input type="checkbox" id="facture" name="facture" value="FACTURE" ${user.role.includes('FACTURE') ? 'checked' : ''}> FACTURE<br>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      preConfirm: () => {
        const cin = (document.getElementById('cin') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
  
        const role = [];
        if ((document.getElementById('stock') as HTMLInputElement).checked) {
          role.push('STOCK');
        }
        if ((document.getElementById('facture') as HTMLInputElement).checked) {
          role.push('FACTURE');
        }
  
        return { cin, username, role: role };
      }
    }).then(result => {
      if (result.isConfirmed) {
        const updatedUser = { ...user, ...result.value };
        this.http.put(`http://localhost:8083/users/update/${user.id}`, updatedUser)
          .subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'User updated successfully!',
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchUsers();
            },
            error => {
              Swal.fire({
                icon: 'error',
                title: 'Failed to update user',
                text: error.message,
                showConfirmButton: true
              });
            }
          );
      }
    });
  }
  
  addUser(): void {
    Swal.fire({
      title: 'Add User',
      html: `
        <input id="cin" class="swal2-input" placeholder="CIN">
        <input id="username" class="swal2-input" placeholder="Username">
        <input id="password" type="password" class="swal2-input" placeholder="Password">
        <div>
          <label><input type="checkbox" id="roleStock"> STOCK</label>
          <label><input type="checkbox" id="roleFacture"> FACTURE</label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      preConfirm: () => {
        const cin = (document.getElementById('cin') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const role = [];
        if ((document.getElementById('roleStock') as HTMLInputElement).checked) {
          role.push('STOCK');
        }
        if ((document.getElementById('roleFacture') as HTMLInputElement).checked) {
          role.push('FACTURE');
        }
        return { cin, username, password, role };
      }
    }).then(result => {
      if (result.isConfirmed) {
        this.http.post('http://localhost:8083/users/add', result.value)
          .subscribe(() => {
            this.fetchUsers();
            Swal.fire('Success', 'User added successfully', 'success');
          }, error => {
            Swal.fire('Error', 'Failed to add user', 'error');
          });
      }
    });
  }

  deleteUser(userId: number): void {
    this.http.delete(`http://localhost:8083/users/delete/${userId}`)
      .subscribe(() => {
        this.fetchUsers();
      });
  }
}
