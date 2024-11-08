import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resumen-asistencia',
  templateUrl: './resumen-asistencia.page.html',
  styleUrls: ['./resumen-asistencia.page.scss'],
})
export class ResumenAsistenciaPage implements OnInit {
  registrosAsistencia: { nombre: string; asignatura: string; fecha: string }[] = [];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Datos de ejemplo de los registros de asistencia
    this.registrosAsistencia = [
      { nombre: 'Fernando Matus', asignatura: 'Arquitectura de Software', fecha: '2024-11-08 10:00' },
      { nombre: 'Elizabet Gómez', asignatura: 'Prog. App Moviles', fecha: '2024-11-08 11:00' },
      { nombre: 'Jorge Martinez', asignatura: 'Diseño de Software', fecha: '2024-11-08 12:00' }
    ];
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
