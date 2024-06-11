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
      },
      (error) => {
        console.error('Error fetching logs:', error);
      }
    );
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
}
