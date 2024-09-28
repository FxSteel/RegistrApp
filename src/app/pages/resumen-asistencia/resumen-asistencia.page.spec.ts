import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenAsistenciaPage } from './resumen-asistencia.page';

describe('ResumenAsistenciaPage', () => {
  let component: ResumenAsistenciaPage;
  let fixture: ComponentFixture<ResumenAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
