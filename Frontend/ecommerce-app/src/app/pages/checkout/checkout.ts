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
  total: number = 0;

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

  callFraudValidation() {

    this.getResponseFraud()
        .then((resp) => {
          let accountHash = resp.accountHash;
          let score = resp.score;
          let level = resp.level;
          let reasons = resp.reasons;
          let createdAt = resp.createdAt;

          alert(`Validação de Fraude: \n AccountHash: ${accountHash} \n Score: ${score} \n Level: ${level} \n Reasons: ${reasons} \n Created At: ${createdAt}`)
        })
        .catch((err) => console.error(err))
    

  }


  async getResponseFraud(): Promise<any> {

    return await new Promise<void>((resolve, reject) => {

      fetch("http://localhost:8080/api/v1/fraud/detect", {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.token,
              'accountHash': this.usernameService.getUsername()
          },
      })
      .then((resp) => {

        resp.json()
            .then((json) => {

                    
              console.log("JSON: "+ JSON.stringify(json))
              resolve(json)


            })
            .catch((err) => reject(err))

      })
      .catch((err) => reject(err));

    });

    

  }

  goBack() {
    this.router.navigate(['/products']);
  }

  excluirItem(item: any){
    let index = this.cartItems.indexOf(item);
    this.cartItems.splice(index, 1);

    this.total = this.cartService.getTotal();

  }

  makeCheckout() {
    let accountHash = this.usernameService.getUsername();
    let checkout: ICheckout = {
      accountHash: accountHash,
      itens: this.getItems(),
      createdAt: new Date()
      
    };
    this.sdk?.sendCheckoutData(checkout);
    this.cartItems = [];
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


