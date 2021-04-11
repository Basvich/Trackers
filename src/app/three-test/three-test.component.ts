import {Component, OnInit} from '@angular/core';
import * as THREE from 'three'
import {Material} from 'three';

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
  camera: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.createScene();
  }

  public startWebGl(): void {
    // Solicita al navegador que programe el repintado de la ventana
    requestAnimationFrame(this.render.bind(this));
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

    this.scene = new THREE.Scene();
    {
      const color = 0xFFFFFF;
      const intensity = 2;
      const light = new THREE.PointLight(color, intensity, 100);
      light.castShadow=true;
      //Set up shadow properties for the light
      light.shadow.mapSize.width = 512; // default
      light.shadow.mapSize.height = 512; // default
      light.position.set(-10,3,6);
      this.scene.add(light);
    }

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
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;   
    earthMesh.position.x = -20;
    solarSystem.add(earthMesh);
    this.objects.push(earthMesh);

    //Panel
    const panelGeometry = new THREE.BoxGeometry(4,20,1);
    const panelMaterial=new THREE.MeshStandardMaterial({color: 0x2233FF});
    const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
    panelMesh.receiveShadow = true;
    panelMesh.castShadow = true;
    panelMesh.position.x = +10;
    panelMesh.position.z=2;
    panelMesh.rotation.y=-Math.PI/6;
    solarSystem.add(panelMesh);
    this.objects.push(panelMesh);

    const panelMaterial2=new THREE.MeshStandardMaterial({color: 0x2233FF});
    const panelMesh2 = new THREE.Mesh(panelGeometry, panelMaterial2);
    panelMesh2.receiveShadow = true;
    panelMesh2.castShadow = true;
    panelMesh2.position.x = 15;
    panelMesh2.position.z=2;
    panelMesh2.rotation.y=-Math.PI/4;
    solarSystem.add(panelMesh2);
    this.objects.push(panelMesh2);


    const floor_geometry = new THREE.PlaneGeometry(1000,1000);
    const floor_material = new THREE.MeshStandardMaterial({color: 0x00ff00});
    const floor = new THREE.Mesh(floor_geometry, floor_material);
    floor.position.set(0,0,0);
    floor.rotation.x -= 0;//Math.PI/8;
    floor.receiveShadow = true;
    floor.castShadow = false;
    this.scene.add(floor);
    this.objects.push(floor);

    // add an AxesHelper to each node
    this.objects.forEach((node) => {
      const axes = new THREE.AxesHelper();
      (<Material>axes.material).depthTest = false;
      axes.renderOrder = 1;
      node.add(axes);
    });

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

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

}
