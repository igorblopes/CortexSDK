import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {

  cartItems: any[] = [];
  total: number = 0;;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();

  }

}
