import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

import { DateTime } from 'luxon'; 
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { LocationRaw, Location, BodyLocations } from '../location_types';
import { BODIES } from '../bodies';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-solarsystem',
  templateUrl: './solarsystem.component.html',
  styleUrls: ['./solarsystem.component.scss']
})
export class SolarsystemComponent implements OnInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //* Sun Properties

  @Input() public rotationSpeedX: number = 0;
  @Input() public rotationSpeedY: number = 0.005;
  @Input() public dt: number = 1;
  @Input() public index: number = 0;
  @Input() public delta: number = 0;
  @Input() public stopper: number = 0;
  @Input() public interval: number = 1/20;  // 1/X = X frames per second
  @Input() public numSteps: number = 62;

  @Input() public bg_texture: string = '/assets/texture-background.jpeg';

  //* Stage Properties

  @Input() public cameraZ: number = 93e6;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1e20;

  //? Helper Properties (Private Properties);

  private bodyLocations: BodyLocations = {};
  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock = new THREE.Clock();
  private earthPos!: THREE.Vector3;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();

  private bg_geometry = new THREE.SphereGeometry(5e9, 32, 32);
  private bg_material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.bg_texture), side: THREE.BackSide });

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: OrbitControls; 

  private solarSystem: { body: string, mesh: THREE.Mesh}[] = [];
  private backgroundStars: THREE.Mesh = new THREE.Mesh(this.bg_geometry, this.bg_material);


  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animate(): void {
    if (this.index < this.numSteps) {
      this.solarSystem.forEach((b) => {
        b.mesh.position.setX(this.bodyLocations[b.body][this.index].x);
        b.mesh.position.setY(this.bodyLocations[b.body][this.index].y);
        b.mesh.position.setZ(this.bodyLocations[b.body][this.index].z);
      });
      
      this.controls.update();
      this.index += this.dt;
    }
    else {
      this.index = 0;
      this.controls.update();
    }
  }

  private startRenderingLoop(): void {
    console.log('set up rendering loop');

    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, logarithmicDepthBuffer: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: SolarsystemComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.delta += component.clock.getDelta();

        if (component.delta > component.interval) {
          component.animate();
          component.delta = component.delta % component.interval;
        }

      component.renderer.render(component.scene, component.camera);
    }());

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    
    this.controls.update();
    console.log('rendering loop done')
  }

  private createScene(): void {
    console.log('create scene begin');
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.solarSystem.forEach( (b) => { this.scene.add(b.mesh) });

    this.backgroundStars.name = 'backgroundStars';
    this.scene.add(this.backgroundStars);
    console.log(this.scene);

    //* Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.set(this.earthPos.x, this.earthPos.y, this.earthPos.z);
    
    this.camera.lookAt(this.bodyLocations['sun'][0].x, this.bodyLocations['sun'][0].y, this.bodyLocations['sun'][0].z);
    this.camera.zoom = 1e-10;

    const light = new THREE.PointLight( 0xffffff, 1, 0, 2);
    light.position.set(0,0,0);
    this.scene.add(light);

    this.clock.start();
    console.log('scene created')
    this.startRenderingLoop();
  }

  private createSolarSystem(): void {
    console.log('create solar system begin');

    for (let i in BODIES) {
      let b = BODIES[i];
      let texture: string = '/assets/texture-' + b.body + '.jpeg';

      let geometry = new THREE.SphereGeometry(b.radius, 32, 32);
      let material = new THREE.MeshBasicMaterial({ map: this.loader.load(texture) });

      let newMesh: THREE.Mesh = new THREE.Mesh(geometry, material);
      newMesh.name = b.body;
      
      newMesh.position.set( this.bodyLocations[b.body][0].x, this.bodyLocations[b.body][0].y, this.bodyLocations[b.body][0].z );
      this.solarSystem.push({ body: b.body, mesh: newMesh });
      console.log(b.body + ' added to system')
    }
    this.createScene();
  }


  private getEarthData(): void {
    console.log('get earth data')
    this.httpClient
      .get('assets/earth_coords.json')
      .subscribe(data => {
        this.convertData(Object.values(data), 'earth');
        this.earthPos = new THREE.Vector3(Object.values(data)[0].x, Object.values(data)[0].y, Object.values(data)[0].z);
        console.log('earth completed')
        this.createSolarSystem();
      });
  };
  
  // shiftData(locs: Location[]): Location[] {
  //   let shifted: Location[] = [];

  //   locs.forEach((l, i) => {
  //     let x: number = l.x = 
  //   })

  //   return shifted;
  // };

  convertData(locs: LocationRaw[], body: string): void {
    console.log('begin converting data for ' + body)
    let locations: Location[] = [];

    locs.forEach(d => {
      locations.push({
        id: Math.floor(Number(d.jdtdb)),
        calendar_date: (DateTime.fromFormat(d.calendar_date.split(' ')[1], 'yyyy-LLL-dd').toLocaleString(DateTime.DATE_MED)),
        x: Number(d.x),
        y: Number(d.y),
        z: Number(d.z)
      })
    })
    if (body !== 'earth') { 
      this.bodyLocations[body] = locations;
    };

    console.log(body + ' conversion done!');
    if (Object.keys(this.bodyLocations).length === BODIES.length && this.stopper === 0) { 
      this.getEarthData();
      this.stopper++;
    };
  }

  private getData(b: string): void {
    console.log('begin fetching data for ' + b)
    this.httpClient
      .get('assets/' + b + '_coords.json')
      .subscribe(data => {
        this.convertData(Object.values(data), b);
      });
  };


  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    console.log('onInit');
    BODIES.forEach((b) => {
      this.getData(b.body);
    });
  }

  ngAfterViewInit(): void {
  }

}
