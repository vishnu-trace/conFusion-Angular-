import { Injectable } from '@angular/core';
import {Promotion} from '../shared/promotion';
import {PROMOTIONS} from '../shared/promotions';
import {of, Observable} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {baseURL} from '../shared/baseurl';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'prmotions');
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions/' + id);
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true').pipe(map(Promotions => Promotions[0] ));
  }

}
