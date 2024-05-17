import { Component } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent {










  /* fetchusersActivities(): void {
    

    this.http.get<any[]>('http://localhost:8083/user-activities/getAll')
      .subscribe(
        response => {
          
          this.usersActivities = response;
          
        },
        error => {
          console.error('Error fetching users:', error);
        }
      );
  }
*/

  
/*CreateUserActivity(product: any, action: string): void {
    const userActivity = {
      libelle: product.libelle,
      prix: product.prix,
      cout: product.cout,
      quantite: product.quantite,
      userCin: this.userCin, // Adjust this if needed
      userName: this.userName, // Adjust this if needed
      action: action,
      timestamp: new Date(), // Add timestamp here
    };

    this.http.post<any>('http://localhost:8083/user-activities/add', userActivity)
      .subscribe(
        response => {
          console.log('history saved for adding');
        },
        error => {
          console.error('Error adding user activity:', error);
        }
      );
  }*/
}
