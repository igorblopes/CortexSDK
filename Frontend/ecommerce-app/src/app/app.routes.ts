import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Products } from './pages/products/products';
import { Checkout } from './pages/checkout/checkout';
import { Dashboard } from './pages/dashboard/dashboard';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'products', component: Products },
  { path: 'checkout', component: Checkout },
  { path: 'dashboard', component: Dashboard },
];
