import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css']
})
export class TotalSalesComponent implements OnInit {
  chartData: any;
  pveList: any[] = [];
  comboChartOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.pveList = [
      { date: new Date('2024-05-01'), total: 100, totalCount: 20, netHT: 50 },
      { date: new Date('2024-05-05'), total: 180, totalCount: 28, netHT: 80 },
      { date: new Date('2024-05-09'), total: 300, totalCount: 40, netHT: 120 },
      { date: new Date('2024-05-10'), total: 320, totalCount: 42, netHT: 125 },
      { date: new Date('2024-05-11'), total: 310, totalCount: 41, netHT: 140 },
      { date: new Date('2024-05-15'), total: 210, totalCount: 34, netHT: 105 }
    ];
    this.comboChartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Values'
          }
        }
      },
      plugins: {
        datasetRenderers: {
          bar: ['Total Sales', 'Total Count'],
          line: ['Net HT']
        }
      }
    };
    this.showLastMonth();
  }

  RetrieveAllPVE(): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe(
        response => {
          this.pveList = response;
        }
      );
  }

  calculateDailySales(startDate: Date, endDate: Date): void {
    const dates: Date[] = [];
    let date = new Date(startDate);
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    const dailySales = dates.map(date => ({
      date,
      total: 0,
      totalCount: 0,
      netHT: 0
    }));

    this.pveList.forEach(pve => {
      const saleDate = new Date(pve.date);
      const saleDateIndex = dailySales.findIndex(d => d.date.toDateString() === saleDate.toDateString());
      if (saleDateIndex >= 0) {
        dailySales[saleDateIndex].total += pve.total;
        dailySales[saleDateIndex].totalCount += pve.totalCount;
        dailySales[saleDateIndex].netHT += pve.netHT;
      }
    });

    this.chartData = {
      labels: dailySales.map(s => s.date),
      datasets: [
        {
          type:'line',
          label: 'Total Sales',
          data: dailySales.map(s => s.total),
          borderColor: '#5AA454',
          backgroundColor: '#5AA454',
          fill: false
        },
        {
          type:'bar',
          label: 'Total Count',
          data: dailySales.map(s => s.totalCount),
          borderColor: '#A10A28',
          backgroundColor: '#A10A28',
          fill: false
        },
        {
          type:'bar',
          label: 'Net HT',
          data: dailySales.map(s => s.netHT),
          borderColor: '#C7B42C',
          fill: false
        }
      ]
    };
  }
  calculateMonthlySales(startDate: Date, endDate: Date): void {
    const months: Date[] = [];
    let date = new Date(startDate);
    while (date <= endDate) {
      months.push(new Date(date));
      date.setMonth(date.getMonth() + 1);
    }
  
    const monthlySales = months.map(month => ({
      month,
      total: 0,
      totalCount: 0,
      netHT: 0
    }));
  
    this.pveList.forEach(pve => {
      const saleDate = new Date(pve.date);
      const saleMonthIndex = monthlySales.findIndex(month => month.month.getMonth() === saleDate.getMonth() && month.month.getFullYear() === saleDate.getFullYear());
      if (saleMonthIndex >= 0) {
        monthlySales[saleMonthIndex].total += pve.total;
        monthlySales[saleMonthIndex].totalCount += pve.totalCount;
        monthlySales[saleMonthIndex].netHT += pve.netHT;
      }
    });
  
    this.chartData = {
      labels: monthlySales.map(month => month.month.toLocaleString('default', { month: 'short', year: 'numeric' })),
      datasets: [
        {
          type:'line',
          label: 'Total Sales',
          data: monthlySales.map(month => month.total),
          borderColor: '#5AA454',
          backgroundColor: '#5AA454',
          fill: false
        },
        {
          type:'bar',
          label: 'Total Count',
          data: monthlySales.map(month => month.totalCount),
          borderColor: '#A10A28',
          backgroundColor: '#A10A28',
          fill: false
        },
        {
          type:'bar',
          label: 'Net HT',
          data: monthlySales.map(month => month.netHT),
          borderColor: '#C7B42C',
          fill: false
        }
      ]
    };
  }
  
  


  showLastDay(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 7);
    this.calculateDailySales(yesterday, today);
  }

  showLastMonth(): void {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    this.calculateDailySales(lastMonth, today);
  }

  showLastYear(): void {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    this.calculateDailySales(lastYear, today);
  }
  
}