import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: { product: Product, quantity: number }[] = [];

  addToCart(product: Product, quantity: number) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  getTotalItens() {
    let total = 0;
    for(let item of this.items){
      total += item.quantity;
    }

    return total;
  }

  getCart() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (+item.product.price * item.quantity), 0);
  }
}