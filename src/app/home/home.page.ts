import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(ZXingScannerComponent) scanner: ZXingScannerComponent | undefined;
  username: string = '';
  role: 'alumno' | 'profesor' | null = null;
  showQRCode: boolean = false;
  isScanning: boolean = false;  // Controla la visualización del escáner QR
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

  // Función para iniciar el escaneo
  startScanning() {
    this.isScanning = true;
  }

  stopScanning() {
    this.isScanning = false;  // Detiene el escaneo estableciendo isScanning en false
    if (this.scanner) {
      this.scanner.reset();  // Asegura que el escáner libere la cámara
    }
  }

  onCodeResult(result: string, asignatura: string) {
    console.log(`Código escaneado para ${asignatura}:`, result);
    this.alertController.create({
      header: 'Escaneo Completo',
      message: `Código escaneado para ${asignatura}: ${result}`,
      buttons: ['OK']
    }).then(alert => alert.present());
    this.isScanning = false;  // Desactiva el escáner después de obtener el resultado
  }

  toggleExpand(asignatura: any) {
    this.asignaturas.forEach(a => {
      if (a !== asignatura) {
        a.expanded = false;
      }
    });
    asignatura.expanded = !asignatura.expanded;
  }

  projectQRCode() {
    this.alertController.create({
      header: 'Proyectar QR',
      message: 'Código QR proyectado en pantalla.',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  goToProfile() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

}
