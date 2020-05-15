import { Component, OnInit } from "@angular/core";
import { AppService } from 'src/app/services/app.service';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: "app-agriculture",
  templateUrl: "agriculture.component.html",
  styleUrls: ["agriculture.component.scss"]
})
export class AgricultureComponent implements OnInit {
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;
  public agricultureType: string = 'conustemp7dayresults'
  public agricultureDisplayValue: string = 'Week 1 Temp';
  date;
  chartData;
  public canvas: any;
  public ctx;
  myChart;
  public datasets: any;
  public data: any;
  public myChartData;
  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  layers = [];


  map: mapboxgl.Map;
  style = "mapbox://styles/weatherdeep/cka6d3s670frr1is6nxmndbfd";
  lat = 38.9;
  lng = -77.0;
  data1 = [];
  data2 = [];
  inputLat;
  inputLng;
  energyCategory;
  agricultureData;
  month;
  constructor(private appService: AppService) {
    this.date = this.dateFormat(new Date);
    this.month = this.getMonth();
    this.appService.getToken().subscribe((res: any) => {
      this.appService.token = res.token;
      // Get data for tornado with the given lat lng and date
      let data = {
        date: this.date,
        longitude: this.lng,
        latitude: this.lat
      }
      this.appService.getForecast(data, this.agricultureType).subscribe((res: any) => {
        this.agricultureData = res
        this.energyCategory = this.forecastCategoryFunc();
      })

      let obj = {
        date: this.date,
        longitude: this.lng,
        latitude: this.lat
      }
    })
  }

  ngOnInit() {
    this.map = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1Ijoid2VhdGhlcmRlZXAiLCJhIjoiY2s3d2g5d2d0MDB5djNmb3lnOWU1NHdoMCJ9.Uifvvc54HT-meJPiRtBfXw",
      container: "map-agri",
      style: this.style,
      zoom: 4,
      center: [this.lng, this.lat]
    });
  }

  ngOnDestroy() {
    this.map.remove()
  }

  updateAgricultueType(type, displayName) {
    this.agricultureType = type;
    this.agricultureDisplayValue = displayName;
    let data = {
      date: this.date,
      longitude: this.lng,
      latitude: this.lat
    }
    this.appService.getForecast(data, type).subscribe((res: any) => {
      this.agricultureData = res
      this.energyCategory = this.forecastCategoryFunc();
      this.month = this.getMonth();

    })
  }

  public setAddress(location) {
    this.map.setCenter([location.lng, location.lat]);
    this.lat = location.lat;
    this.lng = location.lng
    this.inputLat = ''
    this.inputLng = ''
    let data = {
      date: this.date,
      longitude: location.lng,
      latitude: location.lat
    }
    this.appService.getForecast(data, this.agricultureType).subscribe((res: any) => {
      this.agricultureData = res
      this.energyCategory = this.forecastCategoryFunc();
      this.month = this.getMonth();

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
  forecastCategoryFunc() {
    console.log(this.agricultureData['forecast category'])
    switch (this.agricultureData['forecast category']) {
      case '1.0':
        return `Much Below Normal ${this.agricultureDisplayValue} Activity Expected`
        break;

      case '2.0':
        return `Below Normal ${this.agricultureDisplayValue} Activity Expected`

        break;
      case '3.0':
        return `Average Normal ${this.agricultureDisplayValue} Activity Expected`

        break;
      case '4.0':
        return `Above Average Normal ${this.agricultureDisplayValue} Activity Expected`

        break;
      default:
        return `Much Above Average Normal ${this.agricultureDisplayValue} Activity Expected`

    }
  }

  seasonChanged(e) {
    if (e.target.value) {
      this.month = e.target.options[e.target.selectedIndex].innerHTML;
      this.date = e.target.value;
      let data = {
        date: this.date,
        longitude: this.lng,
        latitude: this.lat
      }
      this.appService.getForecast(data, this.agricultureType).subscribe((res: any) => {
        this.agricultureData = res
        this.energyCategory = this.forecastCategoryFunc();
        this.month = this.getMonth();
      })
      for (let i = 0; i < this.layers.length; i++) {
        this.map.removeLayer(this.layers[i])
        this.map.removeSource(this.layers[i])
        // Get layer images
        let data = {
          date: this.date,
          filename: "jdpng"
        }
        this.appService.getFile(data, this.layers[i]).subscribe((res: any) => {
          this.map.addSource(this.layers[i], {
            type: 'image',
            url: res.download_url,
            coordinates: [
              [-134.0, 49.0],
              [-64.0, 49.0],
              [-64.0, 22.0],
              [-134.0, 22.0]
            ]
          });
          this.map.addLayer({
            'id': this.layers[i],
            'type': 'raster',
            'source': this.layers[i],
            'layout': {
              // make layer visible by default
              'visibility': 'visible'
            },
            'paint': {
              'raster-opacity': 0.65
            },
            'source-layer': this.layers[i]
          });

        })
      }
    }
  }

  onCheckboxChange(val) {
    let index = this.layers.findIndex(x => x == val)
    if (this.layers.length > 0 && index != -1) {
      let visibility = this.map.getLayoutProperty(val, 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty(val, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(val, 'visibility', 'visible');
      }
    } else {
      this.layers.push(val)
      // Get layer images
      let data = {
        date: this.date,
        filename: "jdpng"
      }
      this.appService.getFile(data, val).subscribe((res: any) => {
        this.map.addSource(val, {
          type: 'image',
          url: res.download_url,
          coordinates: [
            [-134.0, 49.0],
            [-64.0, 49.0],
            [-64.0, 22.0],
            [-134.0, 22.0]
          ]
        });
        this.map.addLayer({
          'id': val,
          'type': 'raster',
          'source': val,
          'layout': {
            // make layer visible by default
            'visibility': 'visible'
          },
          'paint': {
            'raster-opacity': 0.65
          },
          'source-layer': val
        });

      })
    }
  }

  getMonth() {
    let now = new Date(this.date);
    let month = now.getMonth();
    return this.monthNames[month]
  }

  findAgricultureForecast() {
    if (this.inputLng && this.inputLat) {
      this.lat = this.inputLat;
      this.lng = this.inputLng;
      this.map.setCenter([this.lng, this.lat]);
      let data = {
        date: this.date,
        longitude: this.lng,
        latitude: this.lat
      }
      this.appService.getForecast(data, this.agricultureType).subscribe((res: any) => {
        this.agricultureData = res
        this.energyCategory = this.forecastCategoryFunc();
        this.month = this.getMonth();
      })
    }
  }
}
