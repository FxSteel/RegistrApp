import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';  // Importa el AlertController

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  role: 'alumno' | 'profesor' = 'alumno'; // Asignar valor por defecto

  constructor(
    private authService: AuthService, 
    private router: Router,
    private alertController: AlertController  // Inyectamos el AlertController
  ) {}

  async register() {
    // Aquí se verifica si el registro es exitoso
    if (this.authService.register(this.username, this.password, this.role)) {
      // Mostrar popup de éxito
      const alert = await this.alertController.create({
        header: '¡Registro Exitoso!',
        message: 'Tu usuario ha sido registrado con éxito.',
        buttons: [{
          text: 'Ir al inicio de sesión', 
          handler: () => {
            this.router.navigate(['/login']); // Redirigir al login
          }
        }]
      });

      await alert.present();
    } else {
      alert('Registro fallido: el usuario ya existe');
    }
  }
}
