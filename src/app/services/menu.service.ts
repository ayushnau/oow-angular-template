import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getBestProducts(menuSharingCode: string): Observable<any> {
    console.log('Getting best products for code:', menuSharingCode);
    return this.http.get(`${this.apiUrl}/menu/best_products/${menuSharingCode}`);
  }

  getItemFavoriteList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/get_item_favourite_list`);
  }

  setItemFavorite(itemId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/set_item_favourite`, { itemId });
  }
} 