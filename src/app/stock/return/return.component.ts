import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {
  processedLogs: any[] = [];
  displayedLogs: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  searchValue: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchProcessedLogs();
  }

  fetchProcessedLogs(): void {
    this.http.get<any[]>('http://localhost:8083/commandes/produit-retourné')
      .subscribe(
        response => {
          this.processedLogs = response;
          this.totalPages = Math.ceil(this.processedLogs.length / this.pageSize);
          this.updatePage(this.currentPage);
        },
        error => {
          console.error('Error fetching processed logs:', error);
        }
      );
  }

  updatePage(pageNumber: number): void {
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.currentPage = pageNumber;
    this.displayedLogs = this.processedLogs.slice(start, end);
  }

  search(): void {
    const filteredLogs = this.processedLogs.filter(log =>
      log.produitLibelle?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      log.produitBarcode?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      log.commandeId?.toString().includes(this.searchValue) ||
      log.description?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      log.status?.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      log.quantity?.toString().includes(this.searchValue) ||
      log.elementFactureId?.toString().includes(this.searchValue)
    );
    this.totalPages = Math.ceil(filteredLogs.length / this.pageSize);
    this.displayedLogs = filteredLogs.slice(0, this.pageSize);
  }

 

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage(this.currentPage);
    }
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
    this.updatePage(this.currentPage);
  }
  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  confirmDeletion(log: any): void {
    Swal.fire({
      title: 'Confirmation',
      html: `
        <div class="mb-3">
          <label for="status" class="form-label">Status:</label><br>
          <input type="radio" id="disponible" name="status" value="DISPONIBLE">
          <label for="disponible">DISPONIBLE</label><br>
          <input type="radio" id="enAttente" name="status" value="EN ATTENTE">
          <label for="enAttente">EN ATTENTE</label><br>
          <input type="radio" id="customStatus" name="status" value="CUSTOM">
          <input type="text" id="customStatusInput" name="customStatus" placeholder="Custom Status" class="form-control">
        </div>
        <div>
          <label for="description" class="form-label">Description:</label><br>
          <textarea id="description" class="form-control" rows="3"></textarea>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const status = (document.querySelector('input[name="status"]:checked') as HTMLInputElement)?.value;
        const customStatusInput = (document.getElementById('customStatusInput') as HTMLInputElement)?.value;
        const description = (document.getElementById('description') as HTMLTextAreaElement)?.value;
        return { status: status === 'CUSTOM' ? customStatusInput : status, description: description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteRequest = {
          logId: log.logId,
          status: 'DISPONIBLE',
          description: 'dispo',
          quantity: log.quantity,
          commandeId: log.commandeId,
          elementFactureId: log.elementFactureId,
        };
console.log(deleteRequest);
        this.http.post('http://localhost:8083/commandes/update-log', deleteRequest)
          .subscribe(
            response => {
              Swal.fire('Success', 'Log updated successfully', 'success');
              this.fetchProcessedLogs();
            },
            error => {
              Swal.fire('Success', 'Log updated successfully', 'success');
              this.fetchProcessedLogs();
            }
          );
      }
    });
  }

  getEmptyRows(): number[] {
    const emptyRowCount = this.pageSize - this.processedLogs.length;
    return Array.from({length: emptyRowCount}, (_, i) => i);
}

}
