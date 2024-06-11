import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Component({
  selector: 'app-combo-chart',
  templateUrl: './combo-chart.component.html',
  styleUrls: ['./combo-chart.component.css']
})
export class ComboChartComponent implements OnInit {
  totalValues: any = {};
  loading: boolean = false;
  error: string | null = null;
  view: [number, number] = [700, 400]; // Adjust the size as needed

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTotalInfo();
  }

  getTotalInfo(): void {
    const now = new Date();
    const startDate = format(startOfMonth(now), 'yyyy-MM-dd\'T\'HH:mm:ss');
    const endDate = format(endOfMonth(now), 'yyyy-MM-dd\'T\'HH:mm:ss');
    const prevStartDate = format(startOfMonth(subMonths(now, 1)), 'yyyy-MM-dd\'T\'HH:mm:ss');
    const prevEndDate = format(endOfMonth(subMonths(now, 1)), 'yyyy-MM-dd\'T\'HH:mm:ss');

    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    this.http.get<any>('http://localhost:8083/dashboard/TotalValues')
      .subscribe(
        data => {
          this.totalValues = data;
          this.getRevenuePercentageChange(startDate, endDate, prevStartDate, prevEndDate);
        },
        error => {
          this.error = 'Failed to fetch total values';
          console.log(error);
        }
      );
  }

  getRevenuePercentageChange(start1: string, end1: string, start2: string, end2: string): void {
    const params = new HttpParams()
      .set('start1', start1)
      .set('end1', end1)
      .set('start2', start2)
      .set('end2', end2);
  
    this.http.get<number>('http://localhost:8083/dashboard/pourcentagePVE', { params })
      .subscribe(
        percentageChange => {
          this.totalValues.percentageChange = percentageChange;
        },
        error => {
          this.error = 'Failed to fetch percentage change';
          console.log(error);
        }
      );
  }
  
  

  onCardClick(cardName: string): void {
    console.log(cardName + ' card clicked');
  }
}
