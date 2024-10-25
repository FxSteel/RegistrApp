import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  // Guardar un valor
  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  // Obtener un valor
  async get(key: string) {
    return await this.storage.get(key);
  }

  // Eliminar un valor
  async remove(key: string) {
    await this.storage.remove(key);
  }

  // Limpiar todo el almacenamiento
  async clear() {
    await this.storage.clear();
  }
}
