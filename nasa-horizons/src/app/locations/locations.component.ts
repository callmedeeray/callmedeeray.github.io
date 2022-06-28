import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from 'luxon'; 

import { LocationRaw, Location } from '../location_types';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})


export class LocationsComponent implements OnInit {

  locationsRaw: LocationRaw[] = [];
  public locations: Location[] = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient
      .get('assets/sun_coords.json')
      .subscribe(data => {
        this.locationsRaw = Object.values(data);
        this.convertData();
      });
  }

  convertData(): void {
    this.locationsRaw.forEach(d => {
      this.locations.push({
        id: Math.floor(Number(d.jdtdb)),
        calendar_date: (DateTime.fromFormat(d.calendar_date.split(' ')[1], 'yyyy-LLL-dd').toLocaleString(DateTime.DATE_MED)),
        x: Number(d.x),
        y: Number(d.y),
        z: Number(d.z)
      })
    })
  }

}
