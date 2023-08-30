import { Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime, DurationUnits } from 'luxon';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { NgxSpinnerService } from 'ngx-spinner';

import { LocationRaw, Location, BodyLocations } from '../location_types';
import { BODIES, planetMultiplier, sunMultiplier } from '../bodies';

@Component({
  selector: 'app-solarsystem',
  templateUrl: './solarsystem.component.html',
  styleUrls: ['./solarsystem.component.scss']
})
export class SolarsystemComponent implements OnInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @Input() public dt: number = 1;
  @Input() public dtType = 'HOURS';
  @Input() public startDate = '2021-05-17';
  @Input() public endDate = '2023-05-17';
  @Input() public interval: number = 1 / 60;  // 1/X = X frames per second
  @Input() public timeout: number = 2500; // wait this many milliseconds to do an API call
  public sunMultiplier: number = sunMultiplier;
  public planetMultiplier: number = planetMultiplier;

  //* Stage Properties

  private fieldOfView: number = 1500;
  private nearClippingPlane: number = 1;
  private farClippingPlane: number = 1e20;

  //? Helper Properties (Private Properties);
  private index: number = 0; // for looping through the positions
  private delta: number = 0; // for use with the clock to slow down the animation speed
  private stopper: number = 0; // to make sure the setup is only performed once

  private dur: any = this.dtType.toLocaleLowerCase();
  private numSteps = (DateTime.fromISO(this.endDate)).diff(DateTime.fromISO(this.startDate), this.dur).as(this.dur) + 1;
  private baseURLPath: string = '';
  private proxyURL: string = 'https://quiet-shelf-35635.fly.dev/';
  public headerImagePath: string = '';

  private bodyLocations: BodyLocations = {};
  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock = new THREE.Clock();
  private earthPos!: THREE.Vector3;
  private loader = new THREE.TextureLoader();
  private renderer!: THREE.WebGLRenderer;
  private labelRenderer!: CSS2DRenderer;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  private solarSystem: { body: string, mesh: THREE.Mesh, label: CSS2DObject }[] = [];
  private light = new THREE.PointLight(0xffffff, 1, 0, 2);

  constructor(private httpClient: HttpClient, private spinner: NgxSpinnerService) { }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animate(): void {
    if (this.index < this.numSteps) {
      this.solarSystem.forEach((b) => {
        b.mesh.position.setX(this.bodyLocations[b.body][this.index].x);
        b.mesh.position.setY(this.bodyLocations[b.body][this.index].y);
        b.mesh.position.setZ(this.bodyLocations[b.body][this.index].z);

        b.label.position.copy(b.mesh.position);
      });

      this.controls.target.set(this.bodyLocations['sun'][this.index].x, this.bodyLocations['sun'][this.index].y, this.bodyLocations['sun'][this.index].z);
      this.light.position.set(this.bodyLocations['sun'][this.index].x, this.bodyLocations['sun'][this.index].y, this.bodyLocations['sun'][this.index].z)
      this.controls.update();
      this.index++;
    }
    else {
      this.index = 0;
    }
  }

  private startRenderingLoop(): void {
    console.log('set up rendering loop');

    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, logarithmicDepthBuffer: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '5vh';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.getElementById('solarSystemContainer')!.appendChild(this.labelRenderer.domElement)!;

    let component: SolarsystemComponent = this;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(this.bodyLocations['sun'][0].x, this.bodyLocations['sun'][0].y, this.bodyLocations['sun'][0].z);
    this.controls.enableZoom = false;
    this.controls.update();

    (function render() {
      requestAnimationFrame(render);
      component.delta += component.clock.getDelta();

      if (component.delta > component.interval) {
        component.animate();
        component.delta = component.delta % component.interval;
      }

      component.renderer.render(component.scene, component.camera);
      component.labelRenderer.render(component.scene, component.camera);
    }());

    console.log('rendering loop done');
    let imgHeight = document.getElementById('header-img')!.clientHeight * 0.9;
    document.getElementById('ss-header')!.style!.transform! = 'translate(' + imgHeight / 4 + 'px,' + imgHeight + 'px)';
    this.spinner.hide();
  }

  private createScene(): void {
    console.log('create scene begin');
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.solarSystem.forEach((b) => {
      this.scene.add(b.mesh);
      this.scene.add(b.label);
    });

    let bg_texture: string = this.baseURLPath + 'assets/texture-background.jpeg';
    let bg_geometry = new THREE.SphereGeometry(1e10, 32, 32);
    let bg_material = new THREE.MeshBasicMaterial({ map: this.loader.load(bg_texture), side: THREE.BackSide });
    let backgroundStars: THREE.Mesh = new THREE.Mesh(bg_geometry, bg_material);

    backgroundStars.name = 'backgroundStars';
    this.scene.add(backgroundStars);

    //* Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.set(this.earthPos.x, this.earthPos.y, this.earthPos.z);
    this.light.position.set(this.bodyLocations['sun'][0].x, this.bodyLocations['sun'][0].y, this.bodyLocations['sun'][0].z);
    this.scene.add(this.light);

    this.clock.start();
    console.log('scene created')
    this.startRenderingLoop();
  }

  private createSolarSystem(): void {
    console.log('create solar system begin');

    BODIES.forEach((b) => {
      if (b.body !== 'earth') {
        let texture: string = this.baseURLPath + 'assets/texture-' + b.body + '.jpeg';
        let geometry = new THREE.SphereGeometry(b.radius * 1.60934, 32, 32); // convert miles to km
        let material = b.body === 'sun' ? new THREE.MeshBasicMaterial({ map: this.loader.load(texture) }) : new THREE.MeshBasicMaterial({ map: this.loader.load(texture) });

        let newMesh: THREE.Mesh = new THREE.Mesh(geometry, material);
        newMesh.name = b.body;
        newMesh.position.set(this.bodyLocations[b.body][0].x, this.bodyLocations[b.body][0].y, this.bodyLocations[b.body][0].z);

        const text = document.createElement('div')
        text.className = 'bodyLabel';
        text.textContent = b.body === 'sun' ? '' : b.body;

        const label = new CSS2DObject(text);
        label.position.copy(newMesh.position);

        this.solarSystem.push({ body: b.body, mesh: newMesh, label: label });
        console.log(b.body + ' added to system')
      }
    })
    this.createScene();
  }

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

    this.bodyLocations[body] = locations;

    console.log(body + ' conversion done!');
    if (Object.keys(this.bodyLocations).length === BODIES.length && this.stopper === 0) {
      this.stopper++;
      this.createSolarSystem();
    };
  }

  private csvJSON(csv: string): any {
    // source: http://techslides.com/convert-csv-to-json-in-javascript

    let lines = csv.split("\n");

    let result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    let headers: string[] = lines[0].split(",");

    for (let i = 1; i < lines.length - 1; i++) {

      let obj: any = {};
      let currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j].trim();
      }
      result.push(obj);
    }
    //return result; //JavaScript object
    return result; //JSON
  }

  private getData(b: { body: string, id: number }): void {
    let a: Date = new Date();
    console.log('begin fetching data for ' + b.body + ' at ' + a)

    let str: string = this.proxyURL + 'https://ssd.jpl.nasa.gov/api/horizons.api?' + "MAKE_EPHEM=YES&CSV_FORMAT=YES&COMMAND=" + b.id.toString() + "&EPHEM_TYPE=VECTORS&CENTER='coord@399'&COORD_TYPE=GEODETIC&SITE_COORD='-122.34700,+37.93670,0'&START_TIME='" + this.startDate + "'&STOP_TIME='" + this.endDate + "'&STEP_SIZE='" + this.dt.toString() + " " + this.dtType + "'&VEC_TABLE='1'&REF_SYSTEM='ICRF'&REF_PLANE='FRAME'&VEC_CORR='NONE'&OUT_UNITS='KM-D'&VEC_LABELS='NO'&VEC_DELTA_T='NO'&OBJ_DATA='NO'"
    this.httpClient
      .get(str)
      .subscribe(data => {
        let dat: any = data;
        let result = this.csvJSON('jdtdb,calendar_date,x,y,z,' + dat.result.split('$$SOE')[1].split('$$EOE')[0]);
        b.body === 'earth' ? this.earthPos = new THREE.Vector3(result[0].x, result[0].y, result[0].z) : '';
        this.convertData(result, b.body);
      })

  };

  private sleep(x: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve as any, x));
  };

  private async doThings(): Promise<void> {
    for (let i = 0; i < BODIES.length; i++) {
      this.getData(BODIES[i]);
      await this.sleep(this.timeout);
    }
  };

  ngOnInit(): void {

    this.spinner.show(undefined,
      {
        type: 'ball-circus',
        size: 'large',
        bdColor: 'rgba(100, 100, 100, 1)',
        color: 'white',
        fullScreen: true
      }
    );
    this.baseURLPath = this.proxyURL + window.location.protocol + '//' + window.location.host + window.location.pathname.replace('index.html', '');

  }

  ngAfterViewInit(): void {
    console.log('onInit');
    this.doThings();
  }
}
