import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css']
})
export class TotalSalesComponent implements OnInit {
  chartData: any;
  pieChartData: any;
  pveList: any[] = [];
  comboChartOptions: any;
  pieChartOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.pveList = [
      { produitId: 1, barcode: '123', libelle: 'Product A', type_commande: 'OUT', quantity: 20, prix: 5, cout: 3, netHT: 50, totalCout: 60, total: 100, date: new Date('2024-05-01'), fournisseurName: 'Supplier A', categorieName: 'Category A', clientName: 'Client A' },
      { produitId: 2, barcode: '124', libelle: 'Product B', type_commande: 'OUT', quantity: 28, prix: 6, cout: 4, netHT: 80, totalCout: 70, total: 180, date: new Date('2024-05-05'), fournisseurName: 'Supplier B', categorieName: 'Category B', clientName: 'Client B' },
      { produitId: 3, barcode: '125', libelle: 'Product A', type_commande: 'OUT', quantity: 40, prix: 7, cout: 5, netHT: 120, totalCout: 90, total: 300, date: new Date('2024-05-09'), fournisseurName: 'Supplier A', categorieName: 'Category A', clientName: 'Client A' },
      { produitId: 4, barcode: '126', libelle: 'Product C', type_commande: 'OUT', quantity: 42, prix: 8, cout: 6, netHT: 125, totalCout: 95, total: 320, date: new Date('2024-05-10'), fournisseurName: 'Supplier C', categorieName: 'Category C', clientName: 'Client C' },
      { produitId: 5, barcode: '127', libelle: 'Product B', type_commande: 'OUT', quantity: 41, prix: 9, cout: 7, netHT: 140, totalCout: 100, total: 310, date: new Date('2024-05-11'), fournisseurName: 'Supplier B', categorieName: 'Category B', clientName: 'Client B' },
      { produitId: 6, barcode: '128', libelle: 'Product C', type_commande: 'OUT', quantity: 34, prix: 10, cout: 8, netHT: 105, totalCout: 110, total: 210, date: new Date('2024-05-15'), fournisseurName: 'Supplier C', categorieName: 'Category C', clientName: 'Client C' }
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
    this.pieChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: { label: any; raw: any; }) => {
              const product = context.label;
              const quantity = context.raw;
              const revenue = this.calculateProductRevenue(product);
              return `${product}: ${quantity} sold, $${revenue} revenue`;
            }
          }
        }
      }
    };
    this.showLastMonth();
    this.calculatePieChartDataForLastMonth();
  }

  RetrieveAllPVE(): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe(
        response => {
          this.pveList = response;
        }
      );
  }

  calculateProductRevenue(product: string): number {
    return this.pveList.filter(pve => pve.libelle === product && pve.type_commande === 'OUT')
      .reduce((acc, pve) => acc + pve.total, 0);
  }

  calculatePieChartDataForLastMonth(): void {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    const startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
  
    const productSales: Record<string, number> = {};
  
    this.pveList.forEach(pve => {
      const saleDate = new Date(pve.date);
        if (!productSales[pve.libelle]) {
          productSales[pve.libelle] = 0;
          console.log(productSales);
        }
        productSales[pve.libelle] += pve.quantity;
      
    });
  
    console.log(productSales);
    const sortedProducts = Object.entries(productSales)
      .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
      .slice(0, 10);
  console.log(sortedProducts);
    this.pieChartData = {
      labels: sortedProducts.map(([product]) => product),
      datasets: [{
        data: sortedProducts.map(([, quantity]) => quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
    console.log(this.pieChartData);
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
        dailySales[saleDateIndex].totalCount += pve.quantity;
        dailySales[saleDateIndex].netHT += pve.netHT;
      }
    });

    this.chartData = {
      labels: dailySales.map(s => s.date),
      datasets: [
        {
          type: 'line',
          label: 'Total Sales',
          data: dailySales.map(s => s.total),
          borderColor: '#5AA454',
          backgroundColor: '#5AA454',
          fill: false
        },
        {
          type: 'bar',
          label: 'Total Count',
          data: dailySales.map(s => s.totalCount),
          borderColor: '#A10A28',
          backgroundColor: '#A10A28',
          fill: false
        },
        {
          type: 'bar',
          label: 'Net HT',
          data: dailySales.map(s => s.netHT),
          borderColor: '#C7B42C',
          fill: false
        }
      ]
    };
  }

  showLastDay(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.calculateDailySales(yesterday, today);
  }

  showLastMonth(): void {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    this.calculateDailySales(lastMonth, today);
    this.calculatePieChartDataForLastMonth();
  }

  showLastYear(): void {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    this.calculateDailySales(lastYear, today);
  }
}
