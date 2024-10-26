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
  showQRCode: boolean = false;
  asignaturas: { nombre: string, expanded: boolean }[] = [
    { nombre: 'Arquitectura de Software', expanded: false },
    { nombre: 'Prog. App Moviles', expanded: false },
    { nombre: 'Diseño de Software', expanded: false }
  ];

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

  scanQRCode(asignatura: string) {
    console.log(`Escaneando QR para ${asignatura}`);
    // Lógica para validar el QR en algún momento si es necesario
  }

  toggleExpand(asignatura: any) {
    // Cerrar cualquier tarjeta previamente expandida
    this.asignaturas.forEach(a => {
      if (a !== asignatura) {
        a.expanded = false;
      }
    });

    // Alternar la expansión de la tarjeta seleccionada
    asignatura.expanded = !asignatura.expanded;
  }

  projectQRCode() {
    this.alertController.create({
      header: 'Proyectar QR',
      message: 'Código QR proyectado en pantalla.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}
