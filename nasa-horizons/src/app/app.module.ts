import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationsComponent } from './locations/locations.component';
import { CubeComponent } from './cube/cube.component';
import { SolarsystemComponent } from './solarsystem/solarsystem.component';

@NgModule({
  declarations: [
    AppComponent,
    LocationsComponent,
    CubeComponent,
    SolarsystemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
