import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {

  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 9;

  quantities: { [productId: number]: number } = {};

  constructor(private cartService: CartService, private router: Router) {
    this.products = Array.from({ length: 45 })
    .map((_, i) => ({
      id: i + 1,
      name: `Produto ${i + 1}`,
      price: Number((10 + i).toFixed(2)),
      image: `https://via.placeholder.com/150?text=Produto+${i + 1}`
    }));
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  addToCart(product: Product) {
    const quantity = this.quantities[product.id] || 1;
    this.cartService.addToCart({ ...product }, quantity);
  }

}
