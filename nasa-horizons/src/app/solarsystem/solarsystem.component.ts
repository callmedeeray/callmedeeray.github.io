import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from 'luxon'; 
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


import { LocationRaw, Location } from '../location';

@Component({
  selector: 'app-solarsystem',
  templateUrl: './solarsystem.component.html',
  styleUrls: ['./solarsystem.component.scss']
})
export class SolarsystemComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  //* Sun Properties

  @Input() public rotationSpeedX: number = 0;
  @Input() public rotationSpeedY: number = 0.005;
  @Input() public dt: number = 1;
  @Input() public index: number = 0;
  @Input() public delta: number = 0;
  @Input() public interval: number = 1/20;  // 1/X = X frames per second

  @Input() public texture: string = '/assets/texture-sun.jpeg';
  @Input() public bg_texture: string = '/assets/texture-background.jpeg';

  //* Stage Properties

  @Input() public cameraZ: number = 93e6;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1e20;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock = new THREE.Clock();

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.SphereGeometry(432690*30, 32, 32);
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });

  private bg_geometry = new THREE.SphereGeometry(1e9, 32, 32);
  private bg_material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.bg_texture), side: THREE.BackSide });

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: OrbitControls; 

  private sun: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private background: THREE.Mesh = new THREE.Mesh(this.bg_geometry, this.bg_material);


  /**
   *Animate the sun
   *
   * @private
   * @memberof SolarsystemComponent
   */
  private animateSun() {

    if (this.index < this.locations.length) {
      this.sun.position.x = this.locations[this.index].x;
      this.sun.position.y = this.locations[this.index].y;
      this.sun.position.z = this.locations[this.index].z;
    }
    else {
      this.index = 0;
    }
    this.sun.rotation.x += this.rotationSpeedX;
    this.sun.rotation.y += this.rotationSpeedY;
    this.index += this.dt;
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof SolarsystemComponent
   */
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); //new THREE.TextureLoader().load(this.bg_texture)
    this.scene.add(this.sun);
    // this.scene.add(this.background);

    //* Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
    // this.camera.rotateZ(THREE.MathUtils.DEG2RAD*37.98)
    // this.camera.lookAt(this.sun.position);

    
    const light = new THREE.PointLight( 0xffffff, 1, 0, 2);
    light.position.set(0,0,0);
    this.scene.add(light);
    this.clock.start();

  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
 * Start the rendering loop
 *
 * @private
 * @memberof SolarsystemComponent
 */
  private startRenderingLoop() {
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
          component.animateSun();
          component.delta = component.delta % component.interval;
        }

      component.renderer.render(component.scene, component.camera);
    }());

    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.target.set(0,0,0);
    this.controls.update();
  }

  constructor(private httpClient: HttpClient) { }

  locationsRaw: LocationRaw[] = [];
  locations: Location[] = [];
  
  ngOnInit(): void {

    this.httpClient
      .get('assets/horizons_results.json')
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
    this.sun.position.x = this.locations[0].x;
    this.sun.position.y = this.locations[0].y;
    this.sun.position.z = this.locations[0].z;
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

}
