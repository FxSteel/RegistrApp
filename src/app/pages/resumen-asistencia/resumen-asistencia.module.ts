import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumenAsistenciaPage } from './resumen-asistencia.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ResumenAsistenciaPage }])
  ],
  declarations: [ResumenAsistenciaPage]
})
export class ResumenAsistenciaPageModule {}
