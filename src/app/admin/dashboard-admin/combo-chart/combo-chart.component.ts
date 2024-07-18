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

  startDate!: string;
  endDate!: string;
  prevStartDate!: string;
  prevEndDate!: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.calculateDateRanges();
    this.getTotalInfo();
  }

  calculateDateRanges(): void {
    const now = new Date();
    this.startDate = format(startOfMonth(now), "yyyy-MM-dd'T'00:00:00");
    this.endDate = format(endOfMonth(now), "yyyy-MM-dd'T'23:59:59");
    const previousMonth = subMonths(now, 1);
    this.prevStartDate = format(startOfMonth(previousMonth), "yyyy-MM-dd'T'00:00:00");
    this.prevEndDate = format(endOfMonth(previousMonth), "yyyy-MM-dd'T'23:59:59");
  }

  getTotalInfo(): void {
    const params = new HttpParams()
      .set('startDate', this.startDate)
      .set('endDate', this.endDate);

    this.http.get<any>('http://localhost:8083/dashboard/TotalValues', { params })
      .subscribe(
        data => {
          this.totalValues = data;
          console.log(data);
          this.getRevenuePercentageChange();

        },
        error => {
          this.error = 'Failed to fetch total values';
          console.log(error);
        }
      );
  }

  getRevenuePercentageChange(): void {
    this.http.get<any>('http://localhost:8083/dashboard/pourcentagePVE')
      .subscribe(
        response => {
          console.log(response);
          // Round the response values to two decimal places
          this.totalValues.percentageChange = -(parseFloat(response.growthPercentage.toFixed(2)));
          this.totalValues.costChange = -(parseFloat(response.costPercentage.toFixed(2)));
          this.totalValues.salesChange = -(parseFloat(response.salesPercentage.toFixed(2)));



          console.log('Percentage change:', this.totalValues.percentageChange);
          console.log('Cost change:', this.totalValues.costChange);
          console.log('Sales change:', this.totalValues.salesChange);
        },
        error => {
          this.error = 'Failed to fetch percentage change';
          console.error('Error fetching percentage change:', error);
        }
      );
  }

  

  onCardClick(cardName: string): void {
    console.log(cardName + ' card clicked');
  }
}
