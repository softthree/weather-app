import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Weather Analytics",
    rtlTitle: "لوحة القيادة",
    icon: "cloud",
    class: "",
  },
  {
    path: "/energy",
    title: "Energy Analytics",
    rtlTitle: "الرموز",
    icon: "emoji_objects",
    class: "",
  },
  {
    path: "/agricluture",
    title: "Agriculture Analytics",
    rtlTitle: "خرائط",
    icon: "eco",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
