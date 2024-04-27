import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(...message: any[]) {
    if (environment.production) return;
    console.log(...message);
  }

  error(...message: any[]) {
    if (environment.production) return;
    console.error(...message);
  }

  warn(...message: any[]) {
    if (environment.production) return;
    console.warn(...message);
  }

  info(...message: any[]) {
    if (environment.production) return;
    console.info(...message);
  }
}
