import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _username: string = '';

  constructor() {
    // Cargar el nombre de usuario desde LocalStorage si existe
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this._username = storedUsername;
    }
  }

  /**
   * Establece el nombre de usuario y lo almacena en LocalStorage.
   * @param username El nombre de usuario que voy a almacenar.
   */
  setUsername(username: string) {
    this._username = username;
    localStorage.setItem('username', username);
  }

  /**
   * Obtiene el nombre de usuario almacenado.
   * @returns El nombre de usuario.
   */
  getUsername(): string {
    return this._username;
  }

  /**
   * Limpia el nombre de usuario del servicio y de LocalStorage.
   * Verificar en el siguiente commit por que no se esta limpiando el localstorage
   */
  clear() {
    this._username = '';
    localStorage.removeItem('username');
  }

  /**
   * Verifica si el usuario ha iniciado sesión.
   * @returns `true` si el usuario ha iniciado sesión, de lo contrario `false`.
   */
  isLoggedIn(): boolean {
    return this._username !== '';
  }
}
