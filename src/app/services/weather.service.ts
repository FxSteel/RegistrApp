import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = 'e335a56bdfed44a096d231354242710';
  private apiUrl: string = 'http://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) {}

  // Método para obtener el clima de una ciudad
  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}&aqi=no`;
    return this.http.get<any>(url);
  }
}
