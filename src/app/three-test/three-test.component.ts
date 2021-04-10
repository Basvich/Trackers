import {Component, OnInit} from '@angular/core';
import * as THREE from 'three'

@Component({
  selector: 'app-three-test',
  templateUrl: './three-test.component.html',
  styleUrls: ['./three-test.component.scss']
})
export class ThreeTestComponent implements OnInit {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  // an array of objects who's rotation to update
  objects = [];
  camera: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  ngOnInit(): void {
    const canvas = <HTMLCanvasElement>document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({canvas: canvas});
    this.createScene();
  }

  public startWebGl(): void {
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

    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    this.scene.add(sunMesh);
    this.objects.push(sunMesh);
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
