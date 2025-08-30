import { Component, OnInit, SimpleChanges } from '@angular/core';
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
export class Products implements OnInit {

  quantity: any = 0;
  products: Product[] = [
    {
      id: 1,
      image: "/assets/imagens/camisa-algodao-bege.png",
      name: "Camisa Básica - Bege",
      price: 20.50
    },
    {
      id: 2,
      image: "assets/imagens/bone-trucker.jpg",
      name: "Bone Trucker",
      price: 59.90
    },
    {
      id: 3,
      image: "assets/imagens/boina-marron.jpg",
      name: "Boina Masculina - Marron",
      price: 79.90
    },
    {
      id: 4,
      image: "assets/imagens/jaqueta-jeans-masculina.png",
      name: "Jaqueta Jeans Masculina - Preta",
      price: 135.00
    },
    {
      id: 5,
      image: "assets/imagens/tenis-esportivo.jpg",
      name: "Tenis esportivo",
      price: 245.00
    },
    {
      id: 6,
      image: "assets/imagens/bolsa-couro.jpg",
      name: "Bolsa de Couro - Marron",
      price: 675.00
    },
    {
      id: 7,
      image: "assets/imagens/relogio-de-parede.jpeg",
      name: "Relógio de Parede",
      price: 15.50
    },
    {
      id: 8,
      image: "assets/imagens/oculos-sol.jpg",
      name: "Oculos de sol",
      price: 89.90
    },
    {
      id: 9,
      image: "assets/imagens/mochila.jpg",
      name: "Mochila para notebook",
      price: 89.90
    },
    {
      id: 10,
      image: "assets/imagens/calca-jeans-masculina.jpg",
      name: "Calça Jeans Masculina",
      price: 110.00
    },
    {
      id: 11,
      image: "assets/imagens/carteira.jpg",
      name: "Carteira",
      price: 35.00
    },
    {
      id: 12,
      image: "assets/imagens/smartphone.jpg",
      name: "Smartphone",
      price: 980.00
    },
    {
      id: 13,
      image: "assets/imagens/relogio-inteligente.jpg",
      name: "Relógio Inteligente",
      price: 325.00
    },
    {
      id: 14,
      image: "assets/imagens/fone-sem-fio.jpg",
      name: "Fone Wireless",
      price: 245.00
    },
    {
      id: 15,
      image: "assets/imagens/caixa-som-bluetooth.jpg",
      name: "Caixa som Blueetooth",
      price: 435.00
    },
    {
      id: 16,
      image: "assets/imagens/mouse-ergo.jpg",
      name: "Mouse Ergonomico",
      price: 155.00
    },
    {
      id: 17,
      image: "assets/imagens/tv-55.jpg",
      name: "Televisão 55 4k",
      price: 2650.00
    },
    {
      id: 18,
      image: "assets/imagens/bike-29.jpg",
      name: "Bike Aro 29",
      price: 1380.90
    },
    {
      id: 19,
      image: "assets/imagens/patinete-eletrico.jpg",
      name: "Patinete Elétrico",
      price: 1250.00
    },
    {
      id: 20,
      image: "assets/imagens/bola.jpeg",
      name: "Bola Oficial Finta",
      price: 80.00
    },
    {
      id: 21,
      image: "assets/imagens/halter-ajustavel.png",
      name: "Halter Ajustável - Até 36Kg",
      price: 3200.00
    },
    {
      id: 22,
      image: "assets/imagens/anilha-20.jpg",
      name: "Anilha 20kg",
      price: 35.00
    },
    {
      id: 23,
      image: "assets/imagens/barra.jpg",
      name: "Barra Olimpica",
      price: 789.65
    },
    {
      id: 24,
      image: "assets/imagens/relogio-inteligente.jpg",
      name: "Par de Dumbbel - 5kg",
      price: 80.00
    },
    {
      id: 25,
      image: "assets/imagens/colchonete-acad.jpg",
      name: "Colchonete Academia",
      price: 89.00
    },
    {
      id: 26,
      image: "assets/imagens/airfryer.jpg",
      name: "Air fryer",
      price: 550.00
    },
    {
      id: 27,
      image: "assets/imagens/ventilador-coluna.jpg",
      name: "Ventilador de Coluna",
      price: 360.00
    },
    {
      id: 28,
      image: "assets/imagens/cafeteira.jpg",
      name: "Cafeteira",
      price: 330.00
    },
    {
      id: 29,
      image: "assets/imagens/liquidificador.jpg",
      name: "Liquidificador - 3,2L",
      price: 690.00
    },
    {
      id: 30,
      image: "assets/imagens/luminaria.jpg",
      name: "Luminaria com bateria",
      price: 80.00
    },
    {
      id: 31,
      image: "assets/imagens/mesa-escritorio.jpg",
      name: "Mesa Escritório",
      price: 395.15
    },
    {
      id: 32,
      image: "assets/imagens/ring-light.jpg",
      name: "Ring Light",
      price: 115.25
    },
    {
      id: 33,
      image: "assets/imagens/roteador-wifi.png",
      name: "Roteador Wi-fi 6",
      price: 440.00
    },
    {
      id: 34,
      image: "assets/imagens/hd-externo.jpg",
      name: "HD Externo - 2TB",
      price: 590.00
    },
    {
      id: 35,
      image: "assets/imagens/mini-drone.jpg",
      name: "Mini Drone - Com filmagem",
      price: 660.35
    },
    {
      id: 36,
      image: "assets/imagens/powerbank.jpg",
      name: "Power Bank - 10000 Mah",
      price: 42.90
    },
    {
      id: 37,
      image: "assets/imagens/support-smartphone.jpg",
      name: "Suporte Smartphone - Várias Cores",
      price: 26.30
    },
    {
      id: 38,
      image: "assets/imagens/relogio-inteligente.jpg",
      name: "Capinha Celular de Silicione",
      price: 35.00
    },
    {
      id: 39,
      image: "assets/imagens/jogo-facas.jpg",
      name: "Jogo de facas - 5un",
      price: 125.00
    },
    {
      id: 40,
      image: "assets/imagens/jogo-prato.jpeg",
      name: "Jogo de pratos - 4un",
      price: 230.00
    },
    {
      id: 41,
      image: "assets/imagens/ventilador-coluna.jpg",
      name: "Jogo de copos - 6un",
      price: 180.00
    },
    {
      id: 42,
      image: "assets/imagens/panela-pressao-ele.jpg",
      name: "Panela de Pressão Elétrica",
      price: 830.00
    },
    {
      id: 43,
      image: "assets/imagens/aspirador-po-robo.jpg",
      name: "Aspirador de pó robô",
      price: 930.00
    },
    {
      id: 44,
      image: "assets/imagens/luminaria.jpg",
      name: "Tolha de banho - 100% Algodão",
      price: 160.00
    },
    {
      id: 45,
      image: "assets/imagens/microndas.jpg",
      name: "Micro-Ondas - 20L",
      price: 815.15
    }
  ];
  currentPage = 1;
  itemsPerPage = 9;

  quantities: { [productId: number]: number } = {};

  constructor(private cartService: CartService, private router: Router) {
 
  }

  ngOnInit() {
    console.log('Mudanças detectadas:');
    this.quantity = this.cartService.getTotalItens();
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
    this.quantity += quantity;
    this.cartService.addToCart({ ...product }, quantity);
    this.quantities = {};
  }

}
