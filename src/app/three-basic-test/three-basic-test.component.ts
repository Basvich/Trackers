import { Component, OnInit } from '@angular/core';
import * as THREE from 'three'
import {Material} from 'three';

@Component({
  selector: 'app-three-basic-test',
  templateUrl: './three-basic-test.component.html',
  styleUrls: ['./three-basic-test.component.scss']
})
export class ThreeBasicTestComponent implements OnInit {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  // an array of objects who's rotation to update
  objects:THREE.Object3D[] = [];
  camera: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
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
    this.camera.position.set(0, 50, 0);
    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    {
      const color = 0xFFFFFF;
      const intensity = 3;
      const light = new THREE.PointLight(color, intensity);
      this.scene.add(light);
    }

    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius, widthSegments, heightSegments);

    const solarSystem = new THREE.Object3D();
    this.scene.add(solarSystem);
    this.objects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    this.objects.push(sunMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    solarSystem.add(earthMesh);
    this.objects.push(earthMesh);

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
    time *= 0.001;
    if (this.resizeRendererToDisplaySize(this.renderer)) {
      const canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

}
