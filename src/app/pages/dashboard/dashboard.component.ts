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
  public forecastDisplayValue: string = 'Tornado';
  public curveTypeValue: string = 'conustorlossesseasonal';

  public date: any;
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
  style = "mapbox://styles/mapbox/streets-v11";
  lat = 38.9;
  lng = -77.0;
  data1 = [];
  data2 = [];



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

      let obj = {
        date: '2020-05-01',
        longitude: this.lng,
        latitude: this.lat
      }
      this.appService.getCurvesData(obj, this.curveTypeValue + 'climo').subscribe((res: any) => {
        if (res.date) {
          console.log(res)
          for (var i = 0; i < 100; i = i + 5) {
            let record = res['bin' + i];
            this.data1.push(record);
          }
          let obj = {
            date: '2020-05-01',
            longitude: this.lng,
            latitude: this.lat
          }
          this.appService.getCurvesData(obj, this.curveTypeValue).subscribe((res: any) => {
            for (var i = 0; i < 100; i = i + 5) {
              let record = res['bin' + i];
              this.data2.push(record);
            }
            console.log(this.data1, this.data2)
            this.drawChart();
          })
        }
      })
    })
  }

  ngOnInit() {

    this.map = new mapboxgl.Map({
      accessToken:
        "pk.eyJ1Ijoid2VhdGhlcmRlZXAiLCJhIjoiY2s3d2g5d2d0MDB5djNmb3lnOWU1NHdoMCJ9.Uifvvc54HT-meJPiRtBfXw",
      container: "map",
      style: this.style,
      zoom: 6,
      center: [this.lng, this.lat]
    });

  }

  drawChart() {
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: true
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Probability'
            },
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(29,140,248,0.0)',
              zeroLineColor: "transparent",
            },
            ticks: {
              // suggestedMin: 60,
              // suggestedMax: 125,
              max: 1,
              min: 0,
              stepSize: 0.05,
              padding: 20,
              fontColor: "#9a9a9a"
            }
          }],

        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Losses'
          },
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };
    this.canvas = document.getElementById("chartLineRed");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(65, 171, 246,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(65, 171, 246,0.0)');
    gradientStroke.addColorStop(0, 'rgba(65, 171, 246,0)'); //red colors

    this.chartData = {
      labels: ['100$', '500$', '1000$', '1500$', '2000$', '2500$', '3000$', '3500$', '4000$', '4500$', '5000$', '5500$', '6000$', '6500$', '7000$', '7500$', '8000$', '8500$', '9000$', '9500$'],
      datasets: [{
        label: `${this.forecastDisplayValue} Losses (Climatology)`,
        fill: false,
        backgroundColor: gradientStroke,
        borderColor: '#74b53f',
        borderWidth: 0.7,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#74b53f',
        pointBorderColor: 'rgba(116, 181, 63,0)',
        pointHoverBackgroundColor: '#74b53f',
        pointBorderWidth: 10,
        pointHoverRadius: 2,
        pointHoverBorderWidth: 15,
        pointRadius: 2,
        data: this.data1,
      },
      {
        label: `${this.forecastDisplayValue} Losses`,
        fill: false,
        backgroundColor: gradientStroke,
        borderColor: '#41acf6',
        borderWidth: 3,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#41acf6',
        pointBorderColor: 'rgba(65, 172, 246,0)',
        pointHoverBackgroundColor: '#41acf6',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: this.data2,
      }]
    };

    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: this.chartData,
      options: gradientChartOptionsConfigurationWithTooltipRed
    });
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

    // Map
    let obj = {
      date: '2020-05-01',
      longitude: this.lng,
      latitude: this.lat
    }
    this.data1 = [];
    this.data2 = [];
    this.appService.getCurvesData(obj, this.curveTypeValue + 'climo').subscribe((res: any) => {
      console.log(res)
      if (res.date) {
        for (var i = 0; i < 100; i = i + 5) {
          let record = res['bin' + i];
          this.data1.push(record);
        }
        let obj = {
          date: '2020-05-01',
          longitude: this.lng,
          latitude: this.lat
        }
        this.appService.getCurvesData(obj, this.curveTypeValue).subscribe((res: any) => {
          for (var i = 0; i < 100; i = i + 5) {
            let record = res['bin' + i];
            this.data2.push(record);
          }
          console.log(this.data1, this.data2)
          console.log(this.data1, this.data2)
          this.chartData.datasets[0].data = this.data1;
          this.chartData.datasets[0].label = `${this.forecastDisplayValue} Losses (Climatology)`;
          this.chartData.datasets[1].data = this.data2;
          this.chartData.datasets[1].label = `${this.forecastDisplayValue} Losses`;
          this.myChart.update()
        })
      } else {
        this.chartData.datasets[0].data = [];
        this.chartData.datasets[0].label = `${this.forecastDisplayValue} Losses (Climatology)`;
        this.chartData.datasets[1].data = [];
        this.chartData.datasets[1].label = `${this.forecastDisplayValue} Losses`;
        this.myChart.update()
      }
    })
  }

  onCheckboxChange(val) {
    let index = this.layers.findIndex(x => x == val)
    console.log(index)
    if (this.layers.length > 0 && index != -1) {
      let visibility = this.map.getLayoutProperty(val, 'visibility');
      if (visibility === 'visible') {
        this.map.setLayoutProperty(val, 'visibility', 'none');
      } else {
        this.map.setLayoutProperty(val, 'visibility', 'visible');
      }
    } else {
      this.layers.push(val)
      console.log(val)
      // Get layer images
      let data = {
        date: this.date,
        filename: "jdpng"
      }
      this.appService.getFile(data, val).subscribe((res: any) => {
        console.log(res.download_url)
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

  updateForecastType(type, displayName, curveType) {
    this.forecastType = type;
    this.forecastDisplayValue = displayName;
    this.curveTypeValue = curveType;
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
    // this.drawChart();
    this.data1 = [];
    this.data2 = [];
    let obj = {
      date: '2020-05-01',
      longitude: this.lng,
      latitude: this.lat
    }
    this.appService.getCurvesData(obj, this.curveTypeValue + 'climo').subscribe((res: any) => {
      if (res.date) {
        console.log(res)
        for (var i = 0; i < 100; i = i + 5) {
          let record = res['bin' + i];
          this.data1.push(record);
        }
        let obj = {
          date: '2020-05-01',
          longitude: this.lng,
          latitude: this.lat
        }
        this.appService.getCurvesData(obj, this.curveTypeValue).subscribe((res: any) => {
          for (var i = 0; i < 100; i = i + 5) {
            let record = res['bin' + i];
            this.data2.push(record);
          }
          console.log(this.data1, this.data2)
          this.chartData.datasets[0].data = this.data1;
          this.chartData.datasets[0].label = `${this.forecastDisplayValue} Losses (Climatology)`;
          this.chartData.datasets[1].data = this.data2;
          this.chartData.datasets[1].label = `${this.forecastDisplayValue} Losses`;
          this.myChart.update()
        })
      }
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
    switch (this.foreCastData['forecast category']) {
      case 1.0:
        return `Much Below Normal ${this.forecastDisplayValue} Activity Expected`
        break;

      case 2.0:
        return `Below Normal ${this.forecastDisplayValue} Activity Expected`

        break;
      case 3.0:
        return `Average Normal ${this.forecastDisplayValue} Activity Expected`

        break;
      case 4.0:
        return `Above Average Normal ${this.forecastDisplayValue} Activity Expected`

        break;
      default:
        return `Much Above Average Normal ${this.forecastDisplayValue} Activity Expected`

    }
  }

  getThreeMonths() {

    let now = new Date();
    let currentMonth = now.getMonth();
    let currentMonthName = this.monthNames[currentMonth]
    let future = now.setMonth(now.getMonth() + 2, 1);
    let nextMonth = new Date(future).getMonth()
    let nextMonthName = this.monthNames[nextMonth]
    return currentMonthName + ' - ' + nextMonthName + ' ' + now.getFullYear()
  }
}
