import { Directive, ElementRef, OnInit, Output, EventEmitter } from "@angular/core";
/// <reference types="@types/googlemaps" />

@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    //elRef will get a reference to the element where
    //the directive is placed
    this.element = elRef.nativeElement;
  }

  getFormattedAddress(place) {
    console.log(this.element.value)
    const places: google.maps.places.PlaceResult = place
    // console.log(places.geometry.location.lat() + ' ' + places.geometry.location.lng());
    //@params: place - Google Autocomplete place object
    //@returns: location_obj - An address object in human readable format
    let location_obj = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];

      location_obj['formatted_address'] = place.formatted_address;
      if (item['types'].indexOf("locality") > -1) {
        location_obj['locality'] = item['long_name']
      } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
        location_obj['admin_area_l1'] = item['short_name']
      } else if (item['types'].indexOf("street_number") > -1) {
        location_obj['street_number'] = item['short_name']
      } else if (item['types'].indexOf("route") > -1) {
        location_obj['route'] = item['long_name']
      } else if (item['types'].indexOf("country") > -1) {
        location_obj['country'] = item['long_name']
      } else if (item['types'].indexOf("postal_code") > -1) {
        location_obj['postal_code'] = item['short_name']
      }
      location_obj['lat'] = places.geometry.location.lat().toFixed(1);
      location_obj['lng'] = places.geometry.location.lng().toFixed(1);
      location_obj['value'] = this.element.value;
    }
    return location_obj;
  }

  ngOnInit() {

    const autocomplete = new google.maps.places.Autocomplete(this.element, {
      componentRestrictions: { country: 'us' }
    });
    //Event listener to monitor place changes in the input
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      console.log('Directive')
      //Emit the new address object for the updated place
      this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
    });
  }
}
