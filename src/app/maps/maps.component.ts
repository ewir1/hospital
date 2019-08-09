import { Component, OnInit } from '@angular/core';
import { tileLayer, circle, polygon, marker, icon, latLng, LayerGroup, Layer, Marker } from 'leaflet';
import { HospitalService } from 'app/services/hospital/hospital.service';
import { MedicoService } from 'app/services/medico/medico.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  liteLayer = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  apiKey: 'bfd281d5ef1745a189c5c103b01fa2cf'
  tileLayer: any = tileLayer(`${this.liteLayer}?apikey${this.apiKey}`, { maxZoom: 18, attribution: '...' });

  options: any;

  layersControl = {
    baseLayers: {
      'Abrir el mapa de calles': tileLayer(`${this.liteLayer}`, { maxZoom: 18, attribution: '...' }),
      'Mapa de Ciclo Abierto': tileLayer(`http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png`,
        { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'Circulo Grande': circle([46.95, -122], { radius: 5000 }),
      'Cuadro Grande': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }

  markers: Marker[] = [];
  newMarker: any;

  constructor(
    public _hospitalService: HospitalService,
    public __medicoService: MedicoService
  ) { }

  ngOnInit() {
    this.verMapa();
  }

  verMapa() {
   this._hospitalService.cargarHospitales()
       .subscribe((hospitales: any) => {
         const arrayMapas = [];
         hospitales.hospitales.forEach(mapa => {
           arrayMapas.push(
             marker([mapa.coords.lat, mapa.coords.lng],
               {
                 icon: icon({
                   iconSize: [25, 41],
                   iconAnchor: [12, 4],
                   iconUrl: 'assets/img/marker.png'
                 })
               }
             ).bindPopup(`${mapa.nombre}`)
           )
         });

         const arrayUrl = [];
         arrayUrl.push(this.tileLayer);

         this.markers = arrayUrl.concat(arrayMapas);
         this.options = {
           layers: this.markers,
           zoom: 16,
           center: latLng([10.484526267362597, -66.97349762005864]),
         };
         console.log(this.options);
       });

    this.options = {
      zoom: 12,
      center: latLng(10.484526267362597, -66.97349762005864),
    };
  }

}
