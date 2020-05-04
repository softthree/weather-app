import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import * as mapboxgl from "mapbox-gl";
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  public foreCastData: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public forecastType: string = 'conustorseasonalresults'
  public date: any;
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  lat = 38.9;
  lng = -77.0;
  constructor(private appService: AppService) {
    this.date = this.dateFormat(new Date);
    this.appService.getToken().subscribe((res: any) => {
      this.appService.token = res.token;
      console.log(res)
      // Get data for tornado with the given lat lng and date
      let data = {
        date: this.date,
        longitude: this.lng,
        latitude: this.lat
      }
      console.log(data)
      this.appService.getForecast(data, this.forecastType).subscribe((res: any) => {
        console.log(res)
        this.foreCastData = res
      })
    })
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1Ijoid2VhdGhlcmRlZXAiLCJhIjoiY2s3d2g5d2d0MDB5djNmb3lnOWU1NHdoMCJ9.Uifvvc54HT-meJPiRtBfXw",
      container: "map",
      style: this.style,
      zoom: 7,
      center: [this.lng, this.lat]
    });

    
    // add source and layer for museums

    // Add map controls
    // this.map.addControl(new mapboxgl.NavigationControl());
  }
  public setAddress(location) {
    console.log(location);
    this.map.setCenter([location.lng, location.lat]);
    this.lat = location.lat;
    this.lng = location.lng
    let data = {
      date: this.date,
      longitude: location.lng,
      latitude: location.lat
    }
    console.log(data)
    this.appService.getForecast(data, this.forecastType).subscribe((res: any) => {
      console.log(res)
      this.foreCastData = res
    })
  }

  onCheckboxChange(val) {
    console.log(val)
    // Get layer images
    let data = {
      date: this.date,
      filename: "jdpng"
    }
    this.appService.getFile(data, val).subscribe((res: any) => {
      console.log(res)
    })
  }

  updateForecastType(type) {
    this.forecastType = type;
    let data = {
      date: this.date,
      longitude: this.lng,
      latitude: this.lat
    }
    console.log(data)
    this.appService.getForecast(data, type).subscribe((res: any) => {
      console.log(res)
      this.foreCastData = res
    })
  }

  dateFormat(date) {
    let day: string = date.getDate().toString();
    day = +day < 10 ? "0" + day : day;
    let month: string = (date.getMonth() + 1).toString();
    month = +month < 10 ? "0" + month : month;
    let year = date.getFullYear();
    return `${year}-${month}-01`;
  }
}
