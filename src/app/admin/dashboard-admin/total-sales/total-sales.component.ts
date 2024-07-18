import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total-sales',
  templateUrl: './total-sales.component.html',
  styleUrls: ['./total-sales.component.css']
})
export class TotalSalesComponent implements OnInit {
  chartData: any;
  doughnutChartData1: any; // First doughnut chart data
  doughnutChartData2: any; // Second doughnut chart data
  pveList: any[] = [];
  comboChartOptions: any;
  comboChartOptionsYear: any;
  comboChartOptionsDay: any;

  doughnutChartOptions: any; // Doughnut chart options
  activeChart: 'doughnut1' | 'doughnut2' = 'doughnut1'; // Track active chart type

  startDate: Date =new Date(); // Start date for charts
  endDate: Date =new Date(); // End date for charts

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.pveList = [
      // Sample data initialization
      {
        produitId: 1,
        barcode: '1234567890',
        libelle: 'Produit A',
        type_commande: 'OUT',
        quantity: 5,
        prix: 29.99,
        cout: 15.0,
        netHT: 24.99,
        totalCout: 75.0,
        total: 149.95,
        date: new Date('2023-07-01'),
        fournisseurName: 'Fournisseur A',
        categorieName: 'Catégorie A',
        clientName: 'Client A'
      },
      {
        produitId: 2,
        barcode: '9876543210',
        libelle: 'Produit B',
        type_commande: 'OUT',
        quantity: 3,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 36.0,
        total: 59.97,
        date: new Date('2023-08-01'),
        fournisseurName: 'Fournisseur B',
        categorieName: 'Catégorie B',
        clientName: 'Client B'
      },
      {
        produitId: 3,
        barcode: '1357924680',
        libelle: 'Produit C',
        type_commande: 'OUT',
        quantity: 7,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 56.0,
        total: 104.93,
        date: new Date('2023-09-01'),
        fournisseurName: 'Fournisseur C',
        categorieName: 'Catégorie C',
        clientName: 'Client C'
      },
      {
        produitId: 4,
        barcode: '2468013579',
        libelle: 'Produit D',
        type_commande: 'OUT',
        quantity: 2,
        prix: 39.99,
        cout: 20.0,
        netHT: 34.99,
        totalCout: 40.0,
        total: 79.98,
        date: new Date('2023-10-01'),
        fournisseurName: 'Fournisseur D',
        categorieName: 'Catégorie D',
        clientName: 'Client D'
      },
      {
        produitId: 5,
        barcode: '1122334455',
        libelle: 'Produit E',
        type_commande: 'OUT',
        quantity: 4,
        prix: 49.99,
        cout: 25.0,
        netHT: 44.99,
        totalCout: 100.0,
        total: 199.96,
        date: new Date('2024-06-01'),
        fournisseurName: 'Fournisseur E',
        categorieName: 'Catégorie E',
        clientName: 'Client E'
      },
      {
        produitId: 6,
        barcode: '9988776655',
        libelle: 'Produit F',
        type_commande: 'OUT',
        quantity: 1,
        prix: 9.99,
        cout: 5.0,
        netHT: 8.99,
        totalCout: 5.0,
        total: 9.99,
        date: new Date('2024-06-01'),
        fournisseurName: 'Fournisseur F',
        categorieName: 'Catégorie F',
        clientName: 'Client F'
      },
      {
        produitId: 7,
        barcode: '7766554433',
        libelle: 'Produit G',
        type_commande: 'OUT',
        quantity: 3,
        prix: 29.99,
        cout: 15.0,
        netHT: 24.99,
        totalCout: 45.0,
        total: 89.97,
        date: new Date('2024-01-01'),
        fournisseurName: 'Fournisseur G',
        categorieName: 'Catégorie G',
        clientName: 'Client G'
      },
      {
        produitId: 8,
        barcode: '5544332211',
        libelle: 'Produit H',
        type_commande: 'OUT',
        quantity: 6,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 72.0,
        total: 119.94,
        date: new Date('2024-02-01'),
        fournisseurName: 'Fournisseur H',
        categorieName: 'Catégorie H',
        clientName: 'Client H'
      },
      {
        produitId: 9,
        barcode: '1212121212',
        libelle: 'Produit I',
        type_commande: 'OUT',
        quantity: 2,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 16.0,
        total: 29.98,
        date: new Date('2024-03-01'),
        fournisseurName: 'Fournisseur I',
        categorieName: 'Catégorie I',
        clientName: 'Client I'
      },
      {
        produitId: 10,
        barcode: '1231231234',
        libelle: 'Produit J',
        type_commande: 'OUT',
        quantity: 8,
        prix: 9.99,
        cout: 5.0,
        netHT: 8.99,
        totalCout: 40.0,
        total: 79.92,
        date: new Date('2024-04-01'),
        fournisseurName: 'Fournisseur J',
        categorieName: 'Catégorie J',
        clientName: 'Client J'
      },
      {
        produitId: 11,
        barcode: '4321432143',
        libelle: 'Produit K',
        type_commande: 'OUT',
        quantity: 3,
        prix: 24.99,
        cout: 15.0,
        netHT: 21.99,
        totalCout: 45.0,
        total: 74.97,
        date: new Date('2024-05-01'),
        fournisseurName: 'Fournisseur K',
        categorieName: 'Catégorie K',
        clientName: 'Client K'
      },
      {
        produitId: 12,
        barcode: '5678567856',
        libelle: 'Produit L',
        type_commande: 'OUT',
        quantity: 4,
        prix: 39.99,
        cout: 20.0,
        netHT: 34.99,
        totalCout: 80.0,
        total: 159.96,
        date: new Date('2023-07-10'),
        fournisseurName: 'Fournisseur L',
        categorieName: 'Catégorie L',
        clientName: 'Client L'
      },
      {
        produitId: 13,
        barcode: '7788778888',
        libelle: 'Produit M',
        type_commande: 'OUT',
        quantity: 6,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 72.0,
        total: 119.94,
        date: new Date('2023-08-10'),
        fournisseurName: 'Fournisseur M',
        categorieName: 'Catégorie M',
        clientName: 'Client M'
      },
      {
        produitId: 14,
        barcode: '2233223322',
        libelle: 'Produit N',
        type_commande: 'OUT',
        quantity: 2,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 16.0,
        total: 29.98,
        date: new Date('2023-09-10'),
        fournisseurName: 'Fournisseur N',
        categorieName: 'Catégorie N',
        clientName: 'Client N'
      },
      {
        produitId: 15,
        barcode: '1111222233',
        libelle: 'Produit O',
        type_commande: 'OUT',
        quantity: 7,
        prix: 9.99,
        cout: 5.0,
        netHT: 8.99,
        totalCout: 35.0,
        total: 69.93,
        date: new Date('2023-10-10'),
        fournisseurName: 'Fournisseur O',
        categorieName: 'Catégorie O',
        clientName: 'Client O'
      },
      {
        produitId: 16,
        barcode: '4444555566',
        libelle: 'Produit P',
        type_commande: 'OUT',
        quantity: 3,
        prix: 29.99,
        cout: 15.0,
        netHT: 24.99,
        totalCout: 45.0,
        total: 89.97,
        date: new Date('2024-11-10'),
        fournisseurName: 'Fournisseur P',
        categorieName: 'Catégorie P',
        clientName: 'Client P'
      },
      {
        produitId: 17,
        barcode: '7777888899',
        libelle: 'Produit Q',
        type_commande: 'OUT',
        quantity: 5,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 60.0,
        total: 99.95,
        date: new Date('2024-12-10'),
        fournisseurName: 'Fournisseur Q',
        categorieName: 'Catégorie Q',
        clientName: 'Client Q'
      },
      {
        produitId: 18,
        barcode: '5566556655',
        libelle: 'Produit R',
        type_commande: 'OUT',
        quantity: 2,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 16.0,
        total: 29.98,
        date: new Date('2024-06-10'),
        fournisseurName: 'Fournisseur R',
        categorieName: 'Catégorie R',
        clientName: 'Client R'
      },
      {
        produitId: 19,
        barcode: '3333444455',
        libelle: 'Produit S',
        type_commande: 'OUT',
        quantity: 6,
        prix: 9.99,
        cout: 5.0,
        netHT: 8.99,
        totalCout: 30.0,
        total: 59.94,
        date: new Date('2024-02-10'),
        fournisseurName: 'Fournisseur S',
        categorieName: 'Catégorie S',
        clientName: 'Client S'
      },
      {
        produitId: 20,
        barcode: '9999000011',
        libelle: 'Produit T',
        type_commande: 'OUT',
        quantity: 3,
        prix: 24.99,
        cout: 15.0,
        netHT: 21.99,
        totalCout: 45.0,
        total: 74.97,
        date: new Date('2024-03-10'),
        fournisseurName: 'Fournisseur T',
        categorieName: 'Catégorie T',
        clientName: 'Client T'
      },
      {
        produitId: 21,
        barcode: '8888777666',
        libelle: 'Produit U',
        type_commande: 'OUT',
        quantity: 4,
        prix: 39.99,
        cout: 20.0,
        netHT: 34.99,
        totalCout: 80.0,
        total: 159.96,
        date: new Date('2024-06-10'),
        fournisseurName: 'Fournisseur U',
        categorieName: 'Catégorie U',
        clientName: 'Client U'
      },
      {
        produitId: 22,
        barcode: '1234432112',
        libelle: 'Produit V',
        type_commande: 'OUT',
        quantity: 8,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 96.0,
        total: 159.92,
        date: new Date('2024-06-10'),
        fournisseurName: 'Fournisseur V',
        categorieName: 'Catégorie V',
        clientName: 'Client V'
      },
      {
        produitId: 23,
        barcode: '7890789078',
        libelle: 'Produit W',
        type_commande: 'OUT',
        quantity: 2,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 16.0,
        total: 29.98,
        date: new Date('2023-06-20'),
        fournisseurName: 'Fournisseur W',
        categorieName: 'Catégorie W',
        clientName: 'Client W'
      },
      {
        produitId: 24,
        barcode: '1212121221',
        libelle: 'Produit X',
        type_commande: 'OUT',
        quantity: 7,
        prix: 9.99,
        cout: 5.0,
        netHT: 8.99,
        totalCout: 35.0,
        total: 69.93,
        date: new Date('2023-06-20'),
        fournisseurName: 'Fournisseur X',
        categorieName: 'Catégorie X',
        clientName: 'Client X'
      },
      {
        produitId: 25,
        barcode: '9876987698',
        libelle: 'Produit Y',
        type_commande: 'OUT',
        quantity: 3,
        prix: 29.99,
        cout: 15.0,
        netHT: 24.99,
        totalCout: 45.0,
        total: 89.97,
        date: new Date('2023-09-20'),
        fournisseurName: 'Fournisseur Y',
        categorieName: 'Catégorie Y',
        clientName: 'Client Y'
      },
      {
        produitId: 26,
        barcode: '8888777666',
        libelle: 'Produit Z',
        type_commande: 'OUT',
        quantity: 4,
        prix: 39.99,
        cout: 20.0,
        netHT: 34.99,
        totalCout: 80.0,
        total: 159.96,
        date: new Date('2023-10-20'),
        fournisseurName: 'Fournisseur Z',
        categorieName: 'Catégorie Z',
        clientName: 'Client Z'
      },
      {
        produitId: 27,
        barcode: '9988998899',
        libelle: 'Produit AA',
        type_commande: 'OUT',
        quantity: 6,
        prix: 19.99,
        cout: 12.0,
        netHT: 17.99,
        totalCout: 72.0,
        total: 119.94,
        date: new Date('2023-11-20'),
        fournisseurName: 'Fournisseur AA',
        categorieName: 'Catégorie AA',
        clientName: 'Client AA'
      },
      {
        produitId: 28,
        barcode: '7766776688',
        libelle: 'Produit BB',
        type_commande: 'OUT',
        quantity: 2,
        prix: 14.99,
        cout: 8.0,
        netHT: 12.99,
        totalCout: 16.0,
        total: 29.98,
        date: new Date('2023-12-20'),
        fournisseurName: 'Fournisseur BB',
        categorieName: 'Catégorie BB',
        clientName: 'Client BB'
      }];

    this.comboChartOptionsDay = {
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
      }
    };
    this.comboChartOptionsYear = {
      responsive: true,
     
    };

    this.doughnutChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: { label: any; raw: any; }) => {
              const label = context.label;
              const value = context.raw;
              return `${label}: ${value}`;
            }
          }
        }
      }
    };

    this.showLastMonth(); // Initialize with default data
  }
  calculateProductRevenue(product: string): number {
    return this.pveList.filter(pve => pve.libelle === product && pve.type_commande === 'OUT')
      .reduce((acc, pve) => acc + pve.total, 0);
  }

  calculateDoughnutChartData1(yearly?: boolean): void {
    const productSales: Record<string, number> = {};

    this.pveList.forEach(pve => {
      const saleDate = new Date(pve.date);
      const conditionMet = yearly ? saleDate.getFullYear() === this.endDate.getFullYear() - 1 : saleDate >= this.startDate && saleDate <= this.endDate;
      if (conditionMet) {
        if (!productSales[pve.libelle]) {
          productSales[pve.libelle] = 0;
        }
        productSales[pve.libelle] += pve.quantity;
      }
    });

    const sortedProducts = Object.entries(productSales)
      .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
      .slice(0, 10);

    this.doughnutChartData1 = {
      labels: sortedProducts.map(([product]) => product),
      datasets: [{
        data: sortedProducts.map(([, quantity]) => quantity),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }]
    };
  }

  calculateDoughnutChartData2(yearly?: boolean): void {
    const totalSales = this.chartData.datasets[0].data.reduce((sum: any, current: any) => sum + current, 0); // Total Sales
    const totalCount = this.chartData.datasets[1].data.reduce((sum: any, current: any) => sum + current, 0); // Total Count
    const netHT = this.chartData.datasets[2].data.reduce((sum: any, current: any) => sum + current, 0); // Net HT

    this.doughnutChartData2 = {
      labels: ['Total Sales', 'Total Count', 'Net HT'],
      datasets: [{
        data: [totalSales, totalCount, netHT],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    };
  }

  switchChart(type: 'doughnut1' | 'doughnut2'): void {
    this.activeChart = type;

    if (type === 'doughnut1') {
      this.calculateDoughnutChartData1();
    } else {
      this.calculateDoughnutChartData2();
    }
  }

  calculateDailySales(): void {
    const dates: Date[] = [];
    let date = new Date(this.startDate);
    while (date <= this.endDate) {
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
        dailySales[saleDateIndex].total += (pve.netHT * pve.quantity) - (pve.cout * pve.quantity);
        dailySales[saleDateIndex].totalCount += pve.quantity;
        dailySales[saleDateIndex].netHT += pve.netHT;
      }
    });
this.comboChartOptions =this.comboChartOptionsDay;
    this.chartData = {
      labels: dailySales.map(s => s.date),
      datasets: [
        {
          type: 'line',
          label: 'Revenue total',
          data: dailySales.map(s => s.total),
          borderColor: '#5AA454',
          backgroundColor: '#5AA454',
          fill: false
        },
        {
          type: 'bar',
          label: 'Nombre produit vendu',
          data: dailySales.map(s => s.totalCount),
          borderColor: '#A10A28',
          backgroundColor: '#A10A28',
          fill: false
        },
        {
          type: 'bar',
          label: 'Revenue net (HT)',
          data: dailySales.map(s => s.netHT),
          borderColor: '#C7B42C',
          fill: false
        }
      ]
    };

    this.calculateDoughnutChartData1();
    this.calculateDoughnutChartData2();
  }

  showLastDay(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Set to yesterday
    this.startDate = yesterday;
    this.endDate = today;
    this.calculateDailySales();
  }

  showLastMonth(): void {
    const endDate = new Date(); // Today's date
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29); // 30 days ago from today

  this.startDate = startDate;
  this.endDate = endDate;
  this.calculateDailySales();
  }

  showLastYear(): void {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const startDate = new Date(lastYear.getFullYear(), lastYear.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);

    this.calculateMonthlySales(startDate, endDate, true); // Pass true to indicate yearly calculation
  }

  calculateMonthlySales(startDate: Date, endDate: Date, yearly?: boolean): void {
    const months: { [key: string]: { total: number, totalCount: number, netHT: number } } = {};

    // Initialize each month within the date range
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = { total: 0, totalCount: 0, netHT: 0 };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Aggregate sales data
    this.pveList.forEach(pve => {
      const saleDate = new Date(pve.date);
      if (saleDate >= startDate && saleDate <= endDate) {
        const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
        if (months[monthKey]) {
          months[monthKey].total += (pve.netHT * pve.quantity) - (pve.cout * pve.quantity);
          months[monthKey].totalCount += pve.quantity;
          months[monthKey].netHT += pve.netHT;
        }
      }
    });
    this.comboChartOptions =this.comboChartOptionsYear;

    // Prepare chart data
    this.chartData = {
      labels: Object.keys(months).map(month => {
        const [year, monthIndex] = month.split('-').map(Number);
        const date = new Date(year, monthIndex - 1, 1); // First day of the month
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          type: 'line',
          label: 'Revenue total',
          data: Object.values(months).map(month => month.total),
          borderColor: '#5AA454',
          backgroundColor: '#5AA454',
          fill: false
        },
        {
          type: 'bar',
          label: 'Nombre produit vendu',
          data: Object.values(months).map(month => month.totalCount),
          borderColor: '#A10A28',
          backgroundColor: '#A10A28',
          fill: false
        },
        {
          type: 'bar',
          label: 'Revenue net (HT)',
          data: Object.values(months).map(month => month.netHT),
          borderColor: '#C7B42C',
          fill: false
        }
      ]
    };

    if (yearly) {
      this.calculateDoughnutChartData1(true); // Pass true to indicate yearly calculation
      this.calculateDoughnutChartData2(true); // Pass true to indicate yearly calculation
    } else {
      this.calculateDoughnutChartData1(); // Calculate monthly data by default
      this.calculateDoughnutChartData2(); // Calculate monthly data by default
    }
  }
}
