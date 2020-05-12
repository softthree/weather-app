import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { EnergyComponent } from "../../pages/energy/energy.component";
import { AgricultureComponent } from "../../pages/agriculture/agriculture.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { GooglePlacesDirective } from 'src/app/place-search/google-places.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule

  ],
  declarations: [
    DashboardComponent,
    EnergyComponent,
    AgricultureComponent,
    GooglePlacesDirective
  ],
  exports: [
    GooglePlacesDirective
  ]
})
export class AdminLayoutModule { }
