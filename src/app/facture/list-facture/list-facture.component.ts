
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-list-facture',
  templateUrl: './list-facture.component.html',
  styleUrls: ['./list-facture.component.css']
})
export class ListFactureComponent implements OnInit {

  factures: any[] = [];facturesIN: any[] = [];facturesOUT: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  selectedType: string = 'Tous'; // Default value for type filter
  startDate: Date | null = null;
  endDate: Date | null = null;
  user:String='';
  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchFactures();
  }

 fetchFactures(): void {
    this.http.get<any[]>('http://localhost:8083/factures/getAll')
      .subscribe(
        response => {
          console.log(response);
          this.factures = response;
          
          this.facturesIN = this.factures.filter(f => f.type_facture === 'IN');
          this.facturesOUT = this.factures.filter(f => f.type_facture === 'OUT');
          this.totalPages = Math.ceil(this.factures.length / this.pageSize);
          this.factures = this.factures.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
        },
        error => {
          console.error('Error fetching factures:', error);
        }
      );
  }

  formatDate(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  View(facture: any[]): void {
  //  console.log("button clicked with sending this :" + facture);
  //  this.sharedService.setFacture(facture);
  //  this.router.navigate(['/facturePage']);
   // console.log("ok");
  }

  generatePDF(id: number): void {
    if (this.sessionStorageService) {
        this.user = this.sessionStorageService.retrieve('username'); 
    }
    const url = `http://localhost:8083/factures/generatePdf/${id}?user=${this.user}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
        (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const objectUrl = URL.createObjectURL(blob);
            
            // Attempt to open the PDF in a new window
            const newWindow = window.open(objectUrl, '_blank');
            
            // Check if the new window was successfully opened
            if (newWindow) {
                // Revoke the object URL to free up memory
                newWindow.onload = () => URL.revokeObjectURL(objectUrl);
            } else {
                console.error('Failed to open the PDF in a new window');
            }
        },
        (error) => {
            console.error(error);
        }
    );
}

  

  deleteFacture(id: number): void {
    this.http.delete<any>(`http://localhost:8083/factures/delete/${id}`)
      .subscribe(
        () => {
          this.fetchFactures();
        },
        error => {
          console.error('Error deleting facture:', error);
        }
      );
  }
  getEmptyRows(): number[] {
    const emptyRowCount = Math.max(0, this.pageSize - this.factures.length);
    return Array.from({ length: emptyRowCount }, (_, i) => i);
  }
  applyFilters(): void {
    // Reset currentPage to 1 when filters change
    this.currentPage = 1;
  
    // Fetch factures based on selected filters
    if (this.selectedType === 'IN') {
      this.factures = this.facturesIN;
    } else if (this.selectedType === 'OUT') {
      this.factures = this.facturesOUT;
    } else {
      // If type is TOUS, fetch all factures
      this.fetchFactures();
    }
  }
  

  updatePageSize(number:number):void{
    this.pageSize=number;
  }
}
