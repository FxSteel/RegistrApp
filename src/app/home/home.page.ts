import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { WeatherService } from '../services/weather.service';

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

  asignaturas: { nombre: string, expanded: boolean }[] = [
    { nombre: 'Arquitectura de Software', expanded: false },
    { nombre: 'Prog. App Moviles', expanded: false },
    { nombre: 'Diseño de Software', expanded: false }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername() || '';
      this.role = this.authService.getRole();
      this.loadWeather('Santiago'); // Llama a la función de clima con una ciudad
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

  startScanning() {
    this.isScanning = true;
  }

  stopScanning() {
    this.isScanning = false;
    if (this.scanner) {
      this.scanner.reset();
    }
  }

  onCodeResult(result: string, asignatura: string) {
    console.log(`Código escaneado para ${asignatura}:`, result);

    // Guardar la información en localStorage
    const attendanceData = {
        username: this.username,
        asignatura: asignatura,
        fecha: new Date().toISOString(), // Formato ISO para la fecha
    };

    // Obtener los datos de asistencia existentes o inicializar un arreglo vacío
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    attendanceRecords.push(attendanceData);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    this.alertController.create({
        header: 'Escaneo Completo',
        message: `Código escaneado para ${asignatura}: ${result}`,
        buttons: ['OK']
    }).then(alert => alert.present());

    this.isScanning = false;
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
