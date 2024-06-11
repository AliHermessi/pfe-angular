import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { StockComponent } from './stock/stock.component';
import { FactureComponent } from './facture/facture.component';
import { HomeStockComponent } from './stock/home-stock/home-stock.component';
import { ListStockComponent } from './stock/list-stock/list-stock.component';
import { CommandeStockComponent } from './stock/commande-stock/commande-stock.component';
import { NavbarStockComponent } from './stock/navbar-stock/navbar-stock.component';
import { AjoutStockComponent } from './stock/ajout-stock/ajout-stock.component';
import { AddCommandeComponent } from './stock/add-commande/add-commande.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // If you are using Material icons
import { MatOptionModule } from '@angular/material/core'; // Required for mat-option
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // If you are using mat-select
import { NgSelectModule } from '@ng-select/ng-select';
import { FournisseurPageComponent } from './stock/fournisseur-page/fournisseur-page.component';
import { ClientPageComponent } from './stock/client-page/client-page.component';
import { CategoriePageComponent } from './stock/categorie-page/categorie-page.component';
import { NavbarFactureComponent } from './facture/navbar-facture/navbar-facture.component';
import { ListCommandeFComponent } from './facture/list-commande-f/list-commande-f.component';
import { AddCommandeFComponent } from './facture/add-commande-f/add-commande-f.component';
import { HomeFactureComponent } from './facture/home-facture/home-facture.component';
import { ListFactureComponent } from './facture/list-facture/list-facture.component';
import { FacturePageComponent } from './facture/facture-page/facture-page.component';
import { ListProduitAComponent } from './admin/list-produit-a/list-produit-a.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { AddProduitAdminComponent } from './admin/add-produit-admin/add-produit-admin.component';
import { NavbarAdminComponent } from './admin/navbar-admin/navbar-admin.component';
import { UsersComponent } from './admin/users/users.component';
import { LogsComponent } from './admin/logs/logs.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TotalSalesComponent } from './admin/dashboard-admin/total-sales/total-sales.component';
import { ComboChartComponent } from './admin/dashboard-admin/combo-chart/combo-chart.component';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { ClientFournisseurChartsComponent } from './admin/dashboard-admin/client-fournisseur-charts/client-fournisseur-charts.component';
import { ChartProduitComponent } from './admin/dashboard-admin/chart-produit/chart-produit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagingComponent } from './messaging/messaging.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
//const config: SocketIoConfig = { url: 'http://localhost:8083', options: {} };
//SocketIoModule.forRoot(config)

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    AdminComponent,
    StockComponent,
    FactureComponent,
    HomeStockComponent,
    ListStockComponent,
    CommandeStockComponent,
    NavbarStockComponent,
   
    AjoutStockComponent,
    AddCommandeComponent,
    FournisseurPageComponent,
    ClientPageComponent,
    CategoriePageComponent,
    NavbarFactureComponent,
    ListCommandeFComponent,
    AddCommandeFComponent,
    HomeFactureComponent,
    ListFactureComponent,
    FacturePageComponent,
    ListProduitAComponent,
    DashboardAdminComponent,
    HomeAdminComponent,
    AddProduitAdminComponent,
    NavbarAdminComponent,
    UsersComponent,
    LogsComponent,
    TotalSalesComponent,
    ComboChartComponent,
    ClientFournisseurChartsComponent,
    ChartProduitComponent,
    MessagingComponent,
   
    
  ],
  imports: [
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,NgSelectModule,NgxChartsModule, 
    ChartModule,
    ButtonModule,BrowserAnimationsModule,
    MatDialogModule,
    

  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }
