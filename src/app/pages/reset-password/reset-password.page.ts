import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  usernameOrEmail: string = '';
  resetSuccessful: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  resetPassword() {
    // Simulación de restablecimiento de contraseña
    const result = this.authService.resetPassword(this.usernameOrEmail);

    if (result) {
      this.resetSuccessful = true;
    } else {
      alert('Usuario o correo no encontrado');
    }
  }
}
