import {Component, OnInit} from '@angular/core';
import * as THREE from 'three'
import {Material, RGBA_ASTC_10x10_Format} from 'three';
import * as DAT from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {IAlarms, IGeoPosition, T3DTracker} from './tracksHelpers/trackHelper';
import {MatSliderChange} from '@angular/material/slider';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import * as suncalc from "suncalc"
import * as dateFn from "date-fns"
import {th} from 'date-fns/locale';


@Component({
  selector: 'app-three-test',
  templateUrl: './three-test.component.html',
  styleUrls: ['./three-test.component.scss']
})
export class ThreeTestComponent implements OnInit {
  private solarHour=12;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  // an array of objects who's rotation to update
  objects: THREE.Object3D[] = [];
  panels:THREE.Object3D[]=[];
  trackers:T3DTracker[]=[];
  camera: THREE.PerspectiveCamera;
  camControl: OrbitControls
  panel1:THREE.Object3D;
  earthMesh:THREE.Object3D;
  sunLight:THREE.DirectionalLight;
  floor:THREE.Mesh;
  // El sufijo ! indica que nunca sera nulo
  gui!: DAT.GUI;

  public geoPos: IGeoPosition={
    longitude:-5.6629861,
    latitude: 43.5481303
  }

  eulerX:number=0;
  eulerZ:number=0; 

  selectedAllTrackers = true;
  selectedIdTracker = 245;
  alarms: IAlarms = {
    noCom: false,
    safePosition: false,
    battery: false,
    motor: false
  };

  public selectedDate:Date;
  public utcDate:Date;
  startDate = new Date(2021, 0, 1);
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;    
    this.createScene();
    setTimeout(() => {
      console.log("hola");
      this.startWebGl();
    }, 0); 
    //this.buildDatGui();  
    const d=new Date();  
    d.setUTCHours(0);
    this.selectedDate=new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDay(),0,0,0,0));
    console.log(this.selectedDate);
    this.changeSunPos()
  }

  public startWebGl(): void {
    // Solicita al navegador que programe el repintado de la ventana
    requestAnimationFrame(this.render.bind(this));
  }

  public onAngleChanged(event: MatSliderChange): void {
    const g = event.value * Math.PI / 180;
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.rotation=g;
    });
  }

  public onHourChanged(event: MatSliderChange): void{
    this.solarHour=(event.value);
    this.changeSunPos();
    /* const ang=0.08+(event.value-8)*2.96/10;    
    const d=1000;
    this.sunLight.position.set(d*Math.cos(ang), 20, d*Math.sin(ang)); */
  }
  public changedDate(event: any):void{
    console.log(event.value);
     console.log(this.selectedDate);
     this.changeSunPos();
  }

  public changedGeoPos(event: any):void{
    this.changeSunPos();
  }

  public onBatteryChanged(event: MatSliderChange): void {
    
  }

  public onAlarmsChanged(event: MatSlideToggleChange): void {
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.alarmCom = this.alarms.noCom;
      tracker.alarmSafePos=this.alarms.safePosition;
    });    
  }

  private createScene(): void {
    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, -10, 50);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 0, 0);
    //const cameraHelper = new THREE.CameraHelper( this.camera );
    //this.scene.add( cameraHelper );

    this.camControl = new OrbitControls( this.camera, this.renderer.domElement );
    this.camControl.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.camControl.dampingFactor = 0.05;
    this.camControl.screenSpacePanning = false;
    this.camControl.minDistance = 10;
    this.camControl.maxDistance = 500;
    //this.camControl.maxPolarAngle = Math.PI / 2;

    this.scene = new THREE.Scene();
    {
      //const color = 0xFFFFFF;
      //const intensity = 2;
      //const light = new THREE.PointLight(color, intensity, 100);
      //light.castShadow=true;
      //Set up shadow properties for the light
      //light.shadow.mapSize.width = 512; // default
      //light.shadow.mapSize.height = 512; // default
      //light.position.set(-10,3,6);
      //this.scene.add(light);
    }

    this.sunLight=new THREE.DirectionalLight( 0xffffff, 1 );
    this.sunLight.position.set( 0,200,0 );
    this.sunLight.position.applyEuler(new THREE.Euler(Math.PI/4, 0, 0, 'XYZ'));
    
    this.sunLight.castShadow=true;     
    this.sunLight.shadow.mapSize.width = 2048; 
    this.sunLight.shadow.mapSize.height = 2048; 
    this.sunLight.shadow.camera = new THREE.OrthographicCamera( -200, 200, 200, -200, 0.5, 2000 ); 
    const d = 300;    
    this.sunLight.name = "sunLight";
    this.scene.add(this.sunLight);

    /* const cameraHelper = new THREE.CameraHelper( this.sunLight.shadow.camera );
    this.scene.add( cameraHelper ); */

    const sunLightHelper=new THREE.DirectionalLightHelper(this.sunLight, 5);
    this.scene.add(sunLightHelper);

    const skyLight=new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.5 );
    this.scene.add(skyLight);

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const solarSystem = new THREE.Object3D();
    this.scene.add(solarSystem);
    this.objects.push(solarSystem);

    const arrow = new THREE.ArrowHelper(
      // first argument is the direction
      new THREE.Vector3(2, 2, 0).normalize(),
      // second argument is the orgin
      new THREE.Vector3(0, 0, 7),
      // length
      5,
      // color
      0x10ff00, 0.8, 0.6);
    this.scene.add(arrow);

    //Tierra
    const earthMaterial = new THREE.MeshStandardMaterial({color: 0x10ff00});
    this.earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    this.earthMesh.receiveShadow = true;
    this.earthMesh.castShadow = true;   
    this.earthMesh.position.set(0,0,7); 
    solarSystem.add(this.earthMesh);
    this.objects.push(this.earthMesh);

    this.createPanels();  
    
    const floor_geometry = new THREE.PlaneGeometry(1000,1000);
    const floor_material = new THREE.MeshStandardMaterial({color: 0xFAD7A0, emissive: 0xFAD7A0, emissiveIntensity:0});
    this.floor = new THREE.Mesh(floor_geometry, floor_material);
    
    this.floor.position.set(0,0,0);
    this.floor.rotation.x -= 0;//Math.PI/8;
    this.floor.receiveShadow = true;
    this.floor.castShadow = false;
    this.scene.add(this.floor);
    this.objects.push(this.floor);

    // add an AxesHelper to each node
    /* this.objects.forEach((node) => {
      const axes = new THREE.AxesHelper();
      (<Material>axes.material).depthTest = false;
      axes.renderOrder = 1;
      node.add(axes);
    }); */

  }

  private buildDatGui(): void{
    this.gui = new DAT.GUI();
    const cam=this.gui.addFolder('Camera');
    cam.add(this.camera.position, 'y', -20, 20).listen();
    cam.add(this.camera.position, 'x', -20, 20).listen();    
    const panLight=this.gui.addFolder('Light');
    panLight.add(this.sunLight.position, 'y', -100, 100).listen;
    const panFloor=this.gui.addFolder('floor');
    const params = {
      modelcolor: "#ff0000",
      emissiveIntensity:1
    };
    const floor=this.floor;
    panFloor.addColor(params, 'modelcolor')
    .name('Model Color')
    .onChange(function() {
      (<THREE.MeshStandardMaterial>(floor.material)).color.set(params.modelcolor);
    });
    panFloor.add(params, 'emissiveIntensity',0,1)
    .name('intensity')
    .onChange(function() {
      (<THREE.MeshStandardMaterial>(floor.material)).emissiveIntensity=params.emissiveIntensity;
    });
    const pan2=this.gui.addFolder('tsm');
    pan2.add(this.earthMesh.position, 'x',-20, 20).listen;
  }

  private resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer): boolean {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  private render(time: number) {
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
    this.camControl.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  private changeSunPos(){
    console.log(`changeSunPos: ${this.solarHour}`);
    const sunPos=new THREE.Vector3(0, -200, 0);        
    let minutes=Math.floor(this.solarHour*60-this.geoPos.longitude*4);
    const hours=Math.floor(minutes/60);
    minutes=minutes-hours*60;
    console.log({hours, minutes});
    this.utcDate=new Date(Date.UTC(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDay(), hours, minutes));
    console.log(this.utcDate);
    const sp= suncalc.getPosition(this.utcDate, this.geoPos.latitude, this.geoPos.longitude);
    const sunTimes=suncalc.getTimes(this.utcDate, this.geoPos.latitude, this.geoPos.longitude);
    console.debug(sunTimes);    
    const dir= -sp.azimuth; //this.solarHour*2*Math.PI/24;// 
    const elev= -sp.altitude; //Math.PI/4;
    if(this.utcDate>sunTimes.dusk || this.utcDate<sunTimes.dawn) this.sunLight.intensity=0;
    else this.sunLight.intensity=1;

   
    sunPos.applyEuler(new THREE.Euler(elev, 0, dir, "ZXY"));
    console.log(sunPos);
    this.sunLight.position.set(sunPos.x, sunPos.y, sunPos.z); 
  }

  private createPanels(){
    let x=-200; let y=-100;
    const f=500;   
    for(let i=1; i<f; i++){
      const nTracker=new T3DTracker(x,y);
      this.trackers.push(nTracker);
      this.scene.add(nTracker.Mesh);      
      if(i>0 && i%10==0) x+=10;
      x+=5;
      if(x>220){
        y+=35;
        x=-200;
      }
    }
    this.panel1=this.panels[0];
  }

  private createPanelsOld(){
    let x=-200; let y=-100;
    const f=500;
    const panelGeometry = new THREE.BoxBufferGeometry(4, 30, 0.3);
    const indicatorGeom=new THREE.PlaneBufferGeometry(3,1);    
    const panelMaterial=new THREE.MeshLambertMaterial({color: 0x2233FF}); 
    const indicMat=new THREE.LineBasicMaterial({color:0xf01010 })   ;
    for(let i=1; i<f; i++){
      const lpanelMaterial=new THREE.MeshLambertMaterial({color: 0x2233FF});    
      const panelMesh = new THREE.Mesh(panelGeometry, lpanelMaterial);
      const indMesh=new THREE.Mesh(indicatorGeom, indicMat);
      indMesh.position.z=0.2;
      panelMesh.receiveShadow = true;
      panelMesh.castShadow = true;
      panelMesh.position.x = x;
      panelMesh.position.y = y;
      panelMesh.position.z=2;
      panelMesh.rotation.y=0;
      panelMesh.add(indMesh);
      this.scene.add(panelMesh);
      this.objects.push(panelMesh);
      this.panels.push(panelMesh);
      if(i>0 && i%10==0) x+=10;
      x+=5;
      if(x>220){
        y+=35;
        x=-200;
      }
    }
    this.panel1=this.panels[0];
  }

  protected getSelectedTrackers(): T3DTracker[] {
    if (this.selectedAllTrackers) return this.trackers;
    return [this.trackers[this.selectedIdTracker]];
  }

}
