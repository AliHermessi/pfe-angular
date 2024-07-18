import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components from the different modules
import { AdminComponent } from './admin/admin.component';
import { StockComponent } from './stock/stock.component';
import { FactureComponent } from './facture/facture.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';

// Admin module components
import { AddProduitAdminComponent } from './admin/add-produit-admin/add-produit-admin.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ListProduitAComponent } from './admin/list-produit-a/list-produit-a.component';
import { LogsComponent } from './admin/logs/logs.component';
import { UsersComponent } from './admin/users/users.component';
import { ListCommandeFComponent } from './facture/list-commande-f/list-commande-f.component';
import { AddCommandeFComponent } from './facture/add-commande-f/add-commande-f.component';
import { ListFactureComponent } from './facture/list-facture/list-facture.component';
import { NavbarFactureComponent } from './facture/navbar-facture/navbar-facture.component';
import { FournisseurPageComponent } from './stock/fournisseur-page/fournisseur-page.component';
import { CategoriePageComponent } from './stock/categorie-page/categorie-page.component';
import { ClientPageComponent } from './stock/client-page/client-page.component';
import { CommandeStockComponent } from './stock/commande-stock/commande-stock.component';
import { AjoutStockComponent } from './stock/ajout-stock/ajout-stock.component';
import { AddCommandeComponent } from './stock/add-commande/add-commande.component';
import { HomeStockComponent } from './stock/home-stock/home-stock.component';
import { ListStockComponent } from './stock/list-stock/list-stock.component';
import { NavbarStockComponent } from './stock/navbar-stock/navbar-stock.component';
import { MessagingComponent } from './messaging/messaging.component';
import { ReturnComponent } from './stock/return/return.component';
import { HomeFactureComponent } from './facture/home-facture/home-facture.component';


const routes: Routes = [
  // Default route to redirect to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Authentication route
  { path: 'login', component: AuthComponent },
  // Facture module routes
  { path: 'facture', component: FactureComponent, canActivate: [AuthGuard], data: { roles: ['FACTURE'] },
    children: [
      { path: 'add-commande-f', component: AddCommandeFComponent },
      { path: 'list-commande-f', component: ListCommandeFComponent },
      { path: 'list-facture', component: ListFactureComponent },
      { path: 'navbar-facture', component: NavbarFactureComponent },
      { path: 'fournisseur', component: FournisseurPageComponent },
      { path: 'categorie', component: CategoriePageComponent },
      { path: 'client', component: ClientPageComponent },
      { path: 'messages', component: MessagingComponent},
      {path: 'home-facture', component: HomeFactureComponent}
    ]
  },
  // Admin module routes
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] },
    children: [
      { path: 'add-produit-admin', component: AddProduitAdminComponent },
      { path: 'dashboard-admin', component: DashboardAdminComponent },
      { path: 'list-produit-a', component: ListProduitAComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'fournisseur', component: FournisseurPageComponent },
      { path: 'categorie', component: CategoriePageComponent },
      { path: 'client', component: ClientPageComponent },
      { path: 'add-commande-f', component: AddCommandeFComponent }, 
      { path: 'list-commande-f', component: ListCommandeFComponent },
      { path: 'list-facture', component: ListFactureComponent },
      { path: 'messages', component: MessagingComponent}

      
    ]
  },
  // Stock module routes
  { 
    path: 'stock', 
    component: StockComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['STOCK'] },
    children: [
      { path: 'add-commande', component: AddCommandeComponent },
      { path: 'ajout-stock', component: AjoutStockComponent },
      { path: 'categorie', component: CategoriePageComponent },
      { path: 'client', component: ClientPageComponent },
      { path: 'commande-stock', component: CommandeStockComponent },
      { path: 'fournisseur', component: FournisseurPageComponent },
      { path: 'home-stock', component: HomeStockComponent },
      { path: 'list-stock', component: ListStockComponent },
      { path: 'navbar-stock', component: NavbarStockComponent },
      { path: 'messages', component: MessagingComponent},
      { path: 'retourné', component: ReturnComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
