import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { EnergyComponent } from "../../pages/energy/energy.component";
import { AgricultureComponent } from "../../pages/agriculture/agriculture.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "energy", component: EnergyComponent },
  { path: "agricluture", component: AgricultureComponent }
];
