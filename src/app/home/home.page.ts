import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { WeatherService } from '../services/weather.service';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

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
  isBlocked: boolean = false;
  selectedDate: Date | null = null;
  weatherData: any;
  chart: any;
  attendancePercentage: number = 70;
  loading: any;

  asignaturas: { nombre: string, expanded: boolean, showQRCode?: boolean, qrCodeUrl?: string, seccion?: string, generatedQR?: string }[] = [
    { nombre: 'Arquitectura de Software', expanded: false, seccion: 'MDY3131' },
    { nombre: 'Prog. App Moviles', expanded: false, seccion: 'MDY2424' },
    { nombre: 'Diseño de Software', expanded: false, seccion: 'MDY1515' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private weatherService: WeatherService,
    private modalController: ModalController,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.getUsername() || '';
      this.role = this.authService.getRole();
      this.loadWeather('Santiago');
      this.createAttendanceChart();
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

  createAttendanceChart() {
    setTimeout(() => {
      const ctx = document.getElementById('attendanceChart') as HTMLCanvasElement;
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Asistencia', 'Inasistencia'],
            datasets: [
              {
                data: [this.attendancePercentage, 100 - this.attendancePercentage],
                backgroundColor: ['#4caf50', '#f44336'],
                hoverBackgroundColor: ['#66bb6a', '#e57373']
              }
            ]
          },
          options: {
            cutout: '60%',
            plugins: {
              tooltip: {
                enabled: false
              }
            }
          }
        });
      }
    });
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

  onDateChange(event: any) {
    this.selectedDate = new Date(event.detail.value);
    const currentDate = new Date();
    this.isBlocked = this.selectedDate.getFullYear() !== currentDate.getFullYear() ||
                     this.selectedDate.getMonth() !== currentDate.getMonth() ||
                     this.selectedDate.getDate() !== currentDate.getDate();
  }

  async showModal(message: string) {
    const alert = await this.alertController.create({
      header: 'Acción bloqueada',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  startScanning() {
    if (this.isBlocked) {
      const message = this.selectedDate
        ? `No puedes escanear códigos QR en la fecha seleccionada: ${this.selectedDate.toLocaleDateString()}.`
        : 'No puedes escanear códigos QR en esta fecha.';
      this.showModal(message);
    } else {
      this.isScanning = true;
    }
  }

  stopScanning() {
    this.isScanning = false;
    if (this.scanner) {
      this.scanner.reset();
    }
  }

  onCodeResult(result: string, asignatura: string) {
    const qrFormatRegex = /^([A-Z0-9]+)\|([\w\s]+)\|([\w\s]+)\|(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z})\|([0-9]+)$/;
    if (qrFormatRegex.test(result)) {
      const [_, seccion, asignaturaNombre, usuario, fecha, uniqueID] = result.match(qrFormatRegex) || [];

      // Verificar si el código QR es único
      const scannedQR = localStorage.getItem('scannedQR');
      if (scannedQR === uniqueID) {
        this.alertController.create({
          header: 'Error',
          message: 'Este código QR ya ha sido escaneado.',
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }

      if (asignaturaNombre !== asignatura) {
        this.alertController.create({
          header: 'Error',
          message: `El QR escaneado no pertenece a la asignatura seleccionada (${asignatura}).`,
          buttons: ['OK']
        }).then(alert => alert.present());
        return;
      }

      this.alertController.create({
        header: 'Escaneo Completo',
        message: `Sección: ${seccion}\nAsignatura: ${asignaturaNombre}\nUsuario: ${usuario}\nFecha: ${new Date(fecha).toLocaleString()}`,
        buttons: ['OK']
      }).then(alert => alert.present());

      // Almacenar el ID del QR escaneado para evitar escaneos múltiples
      localStorage.setItem('scannedQR', uniqueID);

      this.authService.registerAttendance({ username: usuario, subject: asignaturaNombre, timestamp: fecha }).subscribe(
        response => console.log('Asistencia registrada:', response),
        error => console.error('Error al registrar asistencia:', error)
      );
    } else {
      this.alertController.create({
        header: 'Error',
        message: 'El formato del código QR no es válido.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  toggleExpand(asignatura: { nombre: string, expanded: boolean, showQRCode?: boolean }) {
    this.asignaturas.forEach(a => {
      if (a !== asignatura) {
        a.expanded = false;
        a.showQRCode = false;
      }
    });
    asignatura.expanded = !asignatura.expanded;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('ion-card')) {
      this.asignaturas.forEach(a => {
        a.expanded = false;
        a.showQRCode = false;
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

  async generateQRCodeForAsignatura(asignatura: any) {
    if (!this.isBlocked) {
      // Muestra el loading spinner mientras se genera el QR
      this.loading = await this.loadingController.create({
        message: 'Generando código QR...',
        spinner: 'crescent',
        cssClass: 'loading-spinner'
      });
      await this.loading.present();

      // Genera un ID único basado en el timestamp
      const uniqueID = `${new Date().getTime()}`;
      
      // Crea el QR con todos los datos, incluyendo el uniqueID
      const qrData = `${asignatura.seccion}|${asignatura.nombre}|${this.username}|${new Date().toISOString()}|${uniqueID}`;
      
      // Crea la URL del código QR
      asignatura.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200`;
      
      // Muestra el QR generado
      asignatura.showQRCode = true;
      asignatura.generatedQR = uniqueID; // Guardamos el ID único para uso posterior

      setTimeout(() => {
        this.loading.dismiss();
      }, 1000); // solo 1 segundos
    } else {
      this.showModal('No puedes generar códigos QR en esta fecha.');
    }
  }
}
