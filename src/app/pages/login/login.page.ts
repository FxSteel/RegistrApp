import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isUsernameFocused: boolean = false;
  isPasswordFocused: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController // Inyecta AlertController
  ) {}

  ionViewWillEnter() {
    this.username = '';
    this.password = '';
  }

  onUsernameFocus() {
    this.isUsernameFocused = true;
  }

  onUsernameBlur() {
    if (!this.username) {
      this.isUsernameFocused = false;
    }
  }

  onPasswordFocus() {
    this.isPasswordFocused = true;
  }

  onPasswordBlur() {
    if (!this.password) {
      this.isPasswordFocused = false;
    }
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Acceso denegado',
      message: 'Faltan credenciales. Por favor, ingrese su nombre de usuario y contraseña.',
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    if (!this.username || !this.password) {
      this.showAlert(); // Muestra el popup de advertencia si falta alguna credencial
      return;
    }
    
    this.isLoading = true; // Mostrar el spinner
    setTimeout(() => {
      this.isLoading = false; // Ocultar el spinner después de 1 segundo
      if (this.authService.authenticate(this.username, this.password)) {
        this.router.navigate(['/home']);
      } else {
        alert('Inicio de sesión fallido: usuario o contraseña incorrectos');
      }
    }, 1000);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
