import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FrontendSDK } from 'cortexsdk-frontend';
import { environment } from '../../../../environments/environment';
import { UsernameService } from '../../services/username.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  private sdk?: FrontendSDK;
  private token = environment.token;

  email = '';
  password = '';

  constructor(private router: Router, private usernameService: UsernameService) {
    this.sdk = new FrontendSDK();
    this.sdk.init("http://localhost:8080", this.token);
  }

  login() {
    if (this.email && this.password) {
      this.usernameService.setUsername(this.email);
      this.sdk?.sendFingerprintData(this.email);
      this.router.navigate(['/products']);
    }
  }
}
