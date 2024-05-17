import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component'; 
import { StockComponent } from './stock/stock.component';
import { FactureComponent } from './facture/facture.component';
import {AuthComponent} from './auth/auth.component';
import { AuthGuard } from './auth.guard';
import { NavbarStockComponent } from './stock/navbar-stock/navbar-stock.component';
import { ListStockComponent } from './stock/list-stock/list-stock.component';
import { ClientPageComponent } from './stock/client-page/client-page.component';
import { CategoriePageComponent } from './stock/categorie-page/categorie-page.component';
import { FournisseurPageComponent } from './stock/fournisseur-page/fournisseur-page.component';
import { AjoutStockComponent } from './stock/ajout-stock/ajout-stock.component';
import { AddCommandeComponent } from './stock/add-commande/add-commande.component';
import { HomeStockComponent } from './stock/home-stock/home-stock.component';
import { CommandeStockComponent } from './stock/commande-stock/commande-stock.component';
import { FacturePageComponent } from './facture/facture-page/facture-page.component';

const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
   { path: 'facturePage', component: FacturePageComponent },
   { path: 'navbar-test', component: NavbarStockComponent },
  { path: 'List-Produit', component: ListStockComponent },
  { path: 'Clients', component: ClientPageComponent},
  { path: 'Categories', component: CategoriePageComponent },
  { path: 'Fournisseurs', component: FournisseurPageComponent },
  { path: 'Ajout-Produits', component: AjoutStockComponent },
  { path: 'Ajout-Commande', component: AddCommandeComponent },
  { path: 'Home', component: HomeStockComponent },
  { path: 'List-Commande', component: CommandeStockComponent },
  { path: 'login', component: AuthComponent },
  { 
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] } // Expected roles for this route
  },
  { 
    path: 'stock',
    component: StockComponent,
    canActivate: [AuthGuard],
    data: { roles: ['STOCK'] } // Expected roles for this route
  },
  { 
    path: 'facture',
    component: FactureComponent,
    canActivate: [AuthGuard],
    data: { roles: ['FACTURE'] } // Expected roles for this route
  },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

