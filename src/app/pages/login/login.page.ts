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

  login() {
    if (this.authService.authenticate(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      alert('Inicio de sesión fallido: usuario o contraseña incorrectos');
    }
  }

  // Redirige a la página de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Redirige a la página de restablecer la contraseña
  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

}
