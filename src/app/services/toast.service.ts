import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastData {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastData>();
  toast$ = this.toastSubject.asObservable();

  success(message: string, title: string = 'Success', duration: number = 3000) {
    this.toastSubject.next({
      message,
      title,
      duration,
      type: 'success'
    });
  }

  error(message: string, title: string = 'Error', duration: number = 3000) {
    this.toastSubject.next({
      message,
      title,
      duration,
      type: 'error'
    });
  }

  info(message: string, title: string = 'Info', duration: number = 3000) {
    this.toastSubject.next({
      message,
      title,
      duration,
      type: 'info'
    });
  }
} 