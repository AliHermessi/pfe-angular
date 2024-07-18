import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  searchTerm: string = '';
  filterOption: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 12;
selectedLog: any = null;

  oldLogHeaders: string[] = [];
  oldLogValues: string[] = [];
  newLogHeaders: string[] = [];
  newLogValues: string[] = [];

  @ViewChild('logDetails') logDetailsTemplate!: TemplateRef<any>;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.http.get<any[]>('http://localhost:8083/logs/getAll').subscribe(
      (response) => {
        this.logs = response;
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching logs:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredLogs = this.logs.filter(log => {
      let matchSearch = true;
      if (this.searchTerm.trim() !== '') {
        matchSearch = log.entityName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                      log.action.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
      let matchDate = true;
      switch (this.filterOption) {
        case 'today':
          matchDate = this.isToday(log.timestamp);
          break;
        case 'last_week':
          matchDate = this.isLastWeek(log.timestamp);
          break;
        case 'last_month':
          matchDate = this.isLastMonth(log.timestamp);
          break;
        default:
          matchDate = true; // 'all' option or invalid option
          break;
      }
      return matchSearch && matchDate;
    });
    this.sortLogs();
  }

  sortLogs(): void {
    this.filteredLogs.sort((a, b) => {
      // Sort by timestamp descending (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  showDetails(log: any): void {
    this.selectedLog = log;
    this.processLogDetails();
    const dialogRef = this.dialog.open(this.logDetailsTemplate, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.selectedLog = null;
      this.clearLogDetails();
    });
  }

  processLogDetails(): void {
    if (this.selectedLog.oldValue) {
      try {
        const oldLog = JSON.parse(this.selectedLog.oldValue.replace(/\\\"/g, '"').replace(/^\"|\"$/g, ''));
        this.oldLogHeaders = Object.keys(oldLog);
        this.oldLogValues = Object.values(oldLog).map(value => JSON.stringify(value));
      } catch (error) {
        console.error('Error parsing oldValue:', error);
        this.oldLogHeaders = [];
        this.oldLogValues = [];
      }
    } else {
      this.oldLogHeaders = [];
      this.oldLogValues = [];
    }

    if (this.selectedLog.newValue) {
      try {
        const newLog = JSON.parse(this.selectedLog.newValue.replace(/\\\"/g, '"').replace(/^\"|\"$/g, ''));
        this.newLogHeaders = Object.keys(newLog);
        this.newLogValues = Object.values(newLog).map(value => JSON.stringify(value));
      } catch (error) {
        console.error('Error parsing newValue:', error);
        this.newLogHeaders = [];
        this.newLogValues = [];
      }
    } else {
      this.newLogHeaders = [];
      this.newLogValues = [];
    }
  }

  clearLogDetails(): void {
    this.oldLogHeaders = [];
    this.oldLogValues = [];
    this.newLogHeaders = [];
    this.newLogValues = [];
  }

  isToday(timestamp: string): boolean {
    const today = new Date();
    const logDate = new Date(timestamp);
    return logDate.getDate() === today.getDate() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getFullYear() === today.getFullYear();
  }

  isLastWeek(timestamp: string): boolean {
    const logDate = new Date(timestamp);
    const today = new Date();
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7));
    return logDate >= oneWeekAgo && logDate <= new Date();
  }

  isLastMonth(timestamp: string): boolean {
    const logDate = new Date(timestamp);
    const today = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    return logDate >= oneMonthAgo && logDate <= new Date();
  }

  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    return Array(pageCount).fill(0).map((x, i) => i + 1);
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const pageCount = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    if (this.currentPage < pageCount) {
      this.currentPage++;
    }
  }

  
  getEmptyRows(): number[] {
    const itemsOnCurrentPage = this.filteredLogs.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage).length;
    const emptyRowCount = this.itemsPerPage - itemsOnCurrentPage;
    return Array.from({ length: emptyRowCount }, (_, i) => i);
  }
  

}
