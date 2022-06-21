import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DateTime } from 'luxon'; 
import * as THREE from "three";

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
  // @Input() public size: number = 200;
  @Input() public texture: string = '/assets/texture-sun.jpeg';
  @Input() public bg_texture: string = '/assets/texture-background.jpeg';

  //* Stage Properties

  @Input() public cameraZ: number = 93000000;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1e20;

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  private geometry = new THREE.SphereGeometry(432690, 32, 32);
  private material = new THREE.MeshLambertMaterial({ map: this.loader.load(this.texture) });

  private sun: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;
  /**
   *Animate the sun
   *
   * @private
   * @memberof SolarsystemComponent
   */
  private animateSun() {
    // if (this.i < this.locations.length) {
    //   this.sun.position.x= this.locations[this.i];
    // }
    // console.log(this.i);
    this.sun.rotation.x += this.rotationSpeedX;
    this.sun.rotation.y += this.rotationSpeedY;
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
    this.scene.background = new THREE.TextureLoader().load(this.bg_texture)
    this.scene.add(this.sun);
    //* Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = this.cameraZ;
    
    const light = new THREE.PointLight( 0xffffff, 1, 0, 2);
    light.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    this.scene.add(light);

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
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SolarsystemComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateSun();
      component.renderer.render(component.scene, component.camera);
    }());
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
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

}
