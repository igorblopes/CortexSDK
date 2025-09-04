import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FrontendSDK, ICheckout, ICheckoutItens } from 'cortexsdk-frontend';
import { environment } from '../../../../environments/environment';
import { UsernameService } from '../../services/username.service';


@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout {

  private sdk?: FrontendSDK;
  private token = environment.token;

  cartItems: any[] = [];
  total: number = 0;;

  constructor(
    private cartService: CartService,
    private router: Router,
    private usernameService: UsernameService
  ) {

    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();

    this.sdk = new FrontendSDK();
    this.sdk.init("http://localhost:8080", this.token);

  }

  goBack() {
    this.router.navigate(['/products']);
  }

  makeCheckout() {
    let accountHash = this.usernameService.getUsername();
    let checkout: ICheckout = {
      accountHash: accountHash,
      itens: this.getItems(),
      createdAt: new Date()
      
    };
    this.sdk?.sendCheckoutData(checkout);
  }

  getItems(): ICheckoutItens[] {
    let items: ICheckoutItens[] = [];

    for(let item of this.cartItems){
      items.push(
        {
          "typeItem": item.product.name,
          "quantity": item.quantity,
          "unitValue": item.product.price
        }
      );
    }
    

    return items;
  }

}


