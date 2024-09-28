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
      // Si el usuario no está logeado, redirigir al login
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

  // Generar código QR en caso de ser profesor
  generateQRCode() {
    this.showQRCode = true;  // Mostrar la imagen del QR
  }

  scanQRCode() {
    // Lógica para escanear el código QR en caso de ser alumno
  }
}
