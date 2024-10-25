// login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ionViewWillEnter() {
    // Limpiar los campos de usuario y contraseña cada vez que se accede a la página
    this.username = '';
    this.password = '';
  }

  login() {
    if (this.authService.authenticate(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      alert('Inicio de sesión fallido: usuario o contraseña incorrectos');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
