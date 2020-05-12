import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl = 'http://weatherdeep.io:5000/'
  token;
  constructor(private http: HttpClient) { }

  getToken() {
    var headers = new HttpHeaders({ "Authorization": "Basic " + btoa("weatherdeepapp:weatherdeepapp!@#$%") });
    const httpOptions = {
      headers: headers
    };
    return this.http.get(this.baseUrl + 'login', httpOptions)
  }

  getForecast(data, type) {
    let headers = new HttpHeaders({ "x-access-token": this.token });
    let params = Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(data[key]);
    }).join('&');
    let httpOptions = {
      headers: headers
    };
    return this.http.get(this.baseUrl + type + '?' + params, httpOptions)
  }

  getFile(data, type) {
    let headers = new HttpHeaders({ "x-access-token": this.token });
    let params = Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(data[key]);
    }).join('&');
    let httpOptions = {
      headers: headers
    };
    return this.http.get(this.baseUrl + type + '?' + params, httpOptions)
  }

  getCurvesData(data, type) {
    console.log(this.token)
    let headers = new HttpHeaders({ "x-access-token": this.token });
    let params = Object.keys(data).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(data[key]);
    }).join('&');

    let httpOptions = {
      headers: headers
    };
    return this.http.get(this.baseUrl + type + '?' + params, httpOptions)
  }


}
