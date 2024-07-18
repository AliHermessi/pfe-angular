import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-fournisseur-charts',
  templateUrl: './client-fournisseur-charts.component.html',
  styleUrls: ['./client-fournisseur-charts.component.css']
})
export class ClientFournisseurChartsComponent implements OnInit {
  suppliers: any = {};
  clients: any = {};
  categorieOUT: any = {};
  chartOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPVEData();
    this.chartOptions = {
      legend: {
        position: 'bottom'
      },
      tooltips: {
        enabled: true,
        callbacks: {
          label: function(tooltipItem: any, data: any) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const currentValue = dataset.data[tooltipItem.index];
            const cout = dataset.cout[tooltipItem.index];
            const revenue = dataset.revenue[tooltipItem.index];
            return `nb vente: ${currentValue}, cout: ${cout}, revenue: ${revenue}`;
          }
        }
      }
    };
  }


  fetchPVEData(): void {
    this.http.get<any[]>('http://localhost:8083/dashboard/AllPVE')
      .subscribe( data => {
        this.processPVEData([
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
            type_commande: 'IN',
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
          }]);
      });
  }

  processPVEData(data: any[]): void {
    const supplierData: any = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          cout: [], // Add cout array for each dataset
          revenue: [] // Add revenue array for each dataset
        }
      ]
    };
    const clientData: any = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          cout: [],
          revenue: []
        }
      ]
    };
    const categorieData: any = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          cout: [],
          revenue: []
        }
      ]
    };

    data.forEach(item => {
      if (item.type_commande === 'IN') {
        // For suppliers
        const supplierIndex = supplierData.labels.findIndex((s: any) => s === item.fournisseurName);
        if (supplierIndex === -1) {
          supplierData.labels.push(item.fournisseurName);
          supplierData.datasets[0].data.push(item.quantity);
          supplierData.datasets[0].backgroundColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          supplierData.datasets[0].cout.push(item.totalCout);
          supplierData.datasets[0].revenue.push(item.netHT - item.totalCout);
        } else {
          supplierData.datasets[0].data[supplierIndex] += item.quantity;
          supplierData.datasets[0].cout[supplierIndex] += item.totalCout;
          supplierData.datasets[0].revenue[supplierIndex] += (item.netHT - item.totalCout);
        }

        // For clients
        const clientIndex = clientData.labels.findIndex((c: any) => c === item.clientName);
        if (clientIndex === -1) {
          clientData.labels.push(item.clientName);
          clientData.datasets[0].data.push(item.quantity);
          clientData.datasets[0].backgroundColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          clientData.datasets[0].cout.push(item.totalCout);
          clientData.datasets[0].revenue.push(item.netHT - item.totalCout);
        } else {
          clientData.datasets[0].data[clientIndex] += item.quantity;
          clientData.datasets[0].cout[clientIndex] += item.totalCout;
          clientData.datasets[0].revenue[clientIndex] += (item.netHT - item.totalCout);
        }

        // For categorieOUT
        const categorieIndex = categorieData.labels.findIndex((c: any) => c === item.categorieName);
        if (categorieIndex === -1) {
          categorieData.labels.push(item.categorieName);
          categorieData.datasets[0].data.push(item.quantity);
          categorieData.datasets[0].backgroundColor.push('#' + Math.floor(Math.random() * 16777215).toString(16));
          categorieData.datasets[0].cout.push(item.totalCout);
          categorieData.datasets[0].revenue.push(item.netHT - item.totalCout);
        } else {
          categorieData.datasets[0].data[categorieIndex] += item.quantity;
          categorieData.datasets[0].cout[categorieIndex] += item.totalCout;
          categorieData.datasets[0].revenue[categorieIndex] += (item.netHT - item.totalCout);
        }
      }
    });

    this.suppliers = supplierData;
    this.clients = clientData;
    this.categorieOUT = categorieData;
  }

  booleen: boolean = true;

  changeCategorie(): void {
    this.booleen = !this.booleen;
  }

}