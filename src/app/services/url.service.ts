import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private urlBase : string = "https://reqres.in/api/";

  constructor() { }

  getURLBase() : string {
    return this.urlBase;
  }
}