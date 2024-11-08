import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { WeatherService } from '../services/weather.service';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient

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
  isScanning: boolean = false;
  weatherData: any;

  asignaturas: { nombre: string, expanded: boolean, showQRCode?: boolean }[] = [
    { nombre: 'Arquitectura de Software', expanded: false },
    { nombre: 'Prog. App Moviles', expanded: false },
    { nombre: 'Diseño de Software', expanded: false }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private weatherService: WeatherService,
    private http: HttpClient // Inyecta HttpClient
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername() || '';
      this.role = this.authService.getRole();
      this.loadWeather('Santiago'); // Llamar a la función de clima con una ciudad
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadWeather(city: string) {
    this.weatherService.getWeather(city).subscribe(
      data => this.weatherData = data,
      error => console.error('Error al obtener el clima:', error)
    );
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
    this.router.navigate(['/resumen-asistencia']);
  }

  generateQRCode() {
    this.showQRCode = true;
  }

  generateQRCodeForAsignatura(asignatura: any) {
    asignatura.showQRCode = true; // Activar la visualización del QR dentro de la tarjeta
  }

  startScanning() {
    this.isScanning = true;
    setTimeout(() => {
      this.stopScanning();
      this.router.navigate(['/salida']);
    }, 8000); // cerrar camara y redirigir a vista salida despues de 8 segundos
  }

  stopScanning() {
    this.isScanning = false;
    if (this.scanner) {
      this.scanner.reset();
    }
  }

  onCodeResult(result: string, asignatura: string) {
    console.log(`Código escaneado para ${asignatura}:`, result);
  
    // Datos a enviar a la API
    const attendanceData = {
      nombre: this.username,
      apellido: 'ApellidoDeEjemplo',//ejemplo para test
      correo: 'correo@ejemplo.com',//ejemplo para test
      rol: this.role,
      asignatura: asignatura,
      fecha: new Date().toISOString(),
    };

    // Envía los datos a la API
    this.http.post('http://localhost:3000/api/save-data', attendanceData)
    .subscribe(
      response => {
        console.log('Datos guardados en Excel:', response);
        this.alertController.create({
          header: 'Escaneo Completo',
          message: `Código escaneado para ${asignatura}: ${result}`,
          buttons: ['OK']
        }).then(alert => alert.present());
      },
      error => {
        console.error('Error al guardar los datos:', error);
        this.alertController.create({
          header: 'Error',
          message: 'No se pudo guardar la asistencia.',
          buttons: ['OK']
        }).then(alert => alert.present());
      }
    );
    this.isScanning = false;
  }

  toggleExpand(asignatura: any) {
    this.asignaturas.forEach(a => {
      if (a !== asignatura) {
        a.expanded = false;
        a.showQRCode = false; // Asegura que el QR se cierre al colapsar la tarjeta
      }
    });
    asignatura.expanded = !asignatura.expanded;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('ion-card')) {
      this.asignaturas.forEach(asignatura => {
        asignatura.expanded = false;
        asignatura.showQRCode = false; // Cierra todas las tarjetas y el QR al hacer clic fuera de las tarjetas
      });
    }
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
