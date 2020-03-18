// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
// 
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "field", "map", "latitude", "longitude" ];

  connect() {
    if(typeof(google) != "undefined"){
      this.initMap();
    }
  }

  initMap(){
    this.map = new google.maps.Map(this.mapTarget, {
      center: new google.maps.LatLng(this.data.get("latitude") || 39.5, this.data.get("longitude") || -98.35),
      zoom: this.data.get("latitude") == null ? 4 : 17
    });
    this.autocomplete = new google.maps.places.Autocomplete(this.fieldTarget) // Grabs the DOM element
    this.autocomplete.bindTo('bounds', this.map);
    this.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']) // Can be customized to return only certain fields
    this.autocomplete.addListener('place_changed', this.placeChanged.bind(this));

    this.marker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    })
  }

  placeChanged(){
      let place = this.autocomplete.getPlace();
      if(!place.geometry){
        window.alert(`No details available for input: ${place.name}`);
        console.log(place);
        return null;
      }

      if(place.geometry.viewport){ // If it knows where the event is, then set the bounds of the map
        this.map.fitBounds(place.geometry.viewport);
      } else { // If it does not know where the event is, then that's an issue
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17); // If doesn't know where to focus in, then zooms out
      }

      this.marker.setPosition(place.geometry.location);
      this.marker.setVisible(true);

      this.latitudeTarget.value = place.geometry.location.lat();
      this.longitudeTarget.value = place.geometry.location.long();


  }

  keydown(event){
      if(event.key == "Enter"){
          event.preventDefault();
      }
  }
}
