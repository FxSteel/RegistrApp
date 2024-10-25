import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';
  role: 'alumno' | 'profesor' | null = null;
  showQRCode: boolean = false;  // Controla la visibilidad del QR

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername() || '';
      this.role = this.authService.getRole();
    } else {
      this.router.navigate(['/login']);
    }
  }

  async logout() {
    this.authService.clear();
    const alert = await this.alertController.create({
      header: 'Sesión Cerrada',
      message: 'Has cerrado sesión exitosamente.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/login']);
  }

  goToResumenAsistencia() {
    this.router.navigate(['/attendance-summary']);
  }

  generateQRCode() {
    this.showQRCode = true;
  }

  // Nueva función para escanear QR (puedes agregar la lógica de escaneo aquí)
  scanQRCode() {
    console.log('Escaneo de código QR iniciado');
    // Implementa aquí la lógica de escaneo de QR si es necesario
  }

  // Nueva función para proyectar el QR
  projectQRCode() {
    this.alertController.create({
      header: 'Proyectar QR',
      message: 'Código QR proyectado en pantalla.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
