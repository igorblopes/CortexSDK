import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {

  cartItems: any[] = [];
  total: number = 0;;

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();

  }

  goBack() {
    this.router.navigate(['/products']);
  }

}
