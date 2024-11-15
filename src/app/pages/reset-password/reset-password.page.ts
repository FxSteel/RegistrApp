import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';  

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';  
  resetSuccessful: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController  
  ) {}

  // Validación de formato de correo
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async resetPassword() {
    if (!this.isValidEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingresa un correo electrónico válido.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Si el correo es válido, procedemos a llamar al servicio
    const result = this.authService.resetPassword(this.email);

    if (result) {
      this.resetSuccessful = true;
      const alert = await this.alertController.create({
        header: 'Restablecer Contraseña',
        message: 'Correo enviado con las instrucciones para modificar tu contraseña.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/login']);
            },
          },
        ],
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Correo no encontrado en nuestros registros.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
