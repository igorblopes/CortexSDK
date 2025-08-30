import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FrontendSDK } from 'cortexsdk-frontend';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  private sdk?: FrontendSDK;

  email = '';
  password = '';

  constructor(private router: Router) {
    this.sdk = new FrontendSDK();
    this.sdk.init("http://localhost:8080");
  }

  login() {
    this.sdk?.backendPing();
    if (this.email && this.password) {
      this.router.navigate(['/products']);
    }
  }
}
