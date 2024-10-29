import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resumen-asistencia',
  templateUrl: './resumen-asistencia.page.html',
  styleUrls: ['./resumen-asistencia.page.scss'],
})
export class ResumenAsistenciaPage implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
