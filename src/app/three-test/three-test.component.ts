import {Component, OnInit} from '@angular/core';
import * as THREE from 'three'
import {Material, RGBA_ASTC_10x10_Format} from 'three';
import * as DAT from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {IAlarms} from './tracksHelpers/trackHelper';
import {MatSliderChange} from '@angular/material/slider';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-three-test',
  templateUrl: './three-test.component.html',
  styleUrls: ['./three-test.component.scss']
})
export class ThreeTestComponent implements OnInit {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  // an array of objects who's rotation to update
  objects: THREE.Object3D[] = [];
  panels:THREE.Object3D[]=[];
  camera: THREE.PerspectiveCamera;
  camControl: OrbitControls
  panel1:THREE.Object3D;
  earthMesh:THREE.Object3D;
  sunLight:THREE.DirectionalLight;
  floor:THREE.Mesh;
  // El sufijo ! indica que nunca sera nulo
  gui!: DAT.GUI;

  selectedAllTrackers = true;
  selectedIdTracker = 100;
  alarms: IAlarms = {
    noCom: false,
    safePosition: false,
    battery: false,
    motor: false
  };
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;    
    this.createScene();
    this.buildDatGui();
  }

  public startWebGl(): void {
    // Solicita al navegador que programe el repintado de la ventana
    requestAnimationFrame(this.render.bind(this));
  }

  public onAngleChanged(event: MatSliderChange): void {
    const g = event.value * Math.PI / 180;
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.rotation.y=g;
    });
  }

  public onHourChanged(event: MatSliderChange): void{
    const ang=0.08+(event.value-8)*2.96/10;    
    const d=1000;
    this.sunLight.position.set(d*Math.cos(ang), 20, d*Math.sin(ang));
  }

  public onBatteryChanged(event: MatSliderChange): void {
    
  }

  public onAlarmsChanged(event: MatSlideToggleChange): void {
   
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

    this.sunLight=new THREE.DirectionalLight( 0xffffff, 2 );
    this.sunLight.position.set( -0.5,0, 1 );
    this.sunLight.position.multiplyScalar( 50);
    this.sunLight.castShadow=true;     
    this.sunLight.shadow.mapSize.width = 1024; // default
    this.sunLight.shadow.mapSize.height = 1024; // default
    this.sunLight.shadow.camera = new THREE.OrthographicCamera( -200, 200, 200, -200, 0.5, 2000 ); 
    const d = 300;    
    this.sunLight.name = "sunLight";
    this.scene.add(this.sunLight);

    const cameraHelper = new THREE.CameraHelper( this.sunLight.shadow.camera );
    this.scene.add( cameraHelper );

    const sunLightHelper=new THREE.DirectionalLightHelper(this.sunLight, 5);
    this.scene.add(sunLightHelper);

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    const solarSystem = new THREE.Object3D();
    this.scene.add(solarSystem);
    this.objects.push(solarSystem);

    const sunMaterial = new THREE.MeshStandardMaterial({color: 0xFFD700});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial); 
    sunMesh.receiveShadow = true;
    sunMesh.castShadow = true;   
    sunMesh.scale.set(2, 2,2);
    sunMesh.position.set(0,0,3);
    solarSystem.add(sunMesh);
    this.objects.push(sunMesh);

    //Tierra
    const earthMaterial = new THREE.MeshStandardMaterial({color: 0x2233FF});
    this.earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    this.earthMesh.receiveShadow = true;
    this.earthMesh.castShadow = true;   
    this.earthMesh.position.set(0,0,7); 
    solarSystem.add(this.earthMesh);
    this.objects.push(this.earthMesh);

    this.createPanels();
    //Panel
    const panelGeometry = new THREE.BoxBufferGeometry(4, 30, 0.3);
    const panelMaterial=new THREE.MeshStandardMaterial({color: 0x2233FF});
    const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
    panelMesh.receiveShadow = true;
    panelMesh.castShadow = true;
    panelMesh.position.x = +10;
    panelMesh.position.z=2;
    panelMesh.rotation.y=-Math.PI/6;
    solarSystem.add(panelMesh);
    this.objects.push(panelMesh);
    this.panel1=panelMesh;
    
    const floor_geometry = new THREE.PlaneGeometry(1000,1000);
    const floor_material = new THREE.MeshStandardMaterial({color: 0xFAD7A0, emissive: 0xFAD7A0, emissiveIntensity:0.5});
    this.floor = new THREE.Mesh(floor_geometry, floor_material);
    
    this.floor.position.set(0,0,0);
    this.floor.rotation.x -= 0;//Math.PI/8;
    this.floor.receiveShadow = true;
    this.floor.castShadow = false;
    this.scene.add(this.floor);
    this.objects.push(this.floor);

    // add an AxesHelper to each node
    this.objects.forEach((node) => {
      const axes = new THREE.AxesHelper();
      (<Material>axes.material).depthTest = false;
      axes.renderOrder = 1;
      node.add(axes);
    });

  }

  private buildDatGui(): void{
    this.gui = new DAT.GUI();
    const cam=this.gui.addFolder('Camera');
    cam.add(this.camera.position, 'y', -20, 20).listen();
    cam.add(this.camera.position, 'x', -20, 20).listen();
    const pan=this.gui.addFolder('panel1');
    pan.add(this.panel1.rotation, 'y', -Math.PI/2, Math.PI/2).listen;
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
      floor.material.color.set(params.modelcolor);
    });
    panFloor.add(params, 'emissiveIntensity',0,1)
    .name('intensity')
    .onChange(function() {
      floor.material.emissiveIntensity=params.emissiveIntensity;
    });
    const pan2=this.gui.addFolder('hearth');
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

  private createPanels(){
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

  }

  protected getSelectedTrackers(): THREE.Object3D[] {
    if (this.selectedAllTrackers) return this.panels;
    return [this.panels[this.selectedIdTracker]];
  }

}
