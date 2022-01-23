import * as THREE from "three";



const sphereGeometry = new THREE.SphereGeometry(2, 6, 6);
const earthMaterial = new THREE.MeshStandardMaterial({color: 0xff33ff});

export class T3Dtsm{
    
    private _windSped=0;
    private _windDir=0;
    private mesh:THREE.Mesh;
    private arrow : THREE.ArrowHelper;
    public get Mesh():THREE.Mesh {return this.mesh;}

    public constructor(public x: number, public y: number, public z:number=0) {
      this.createMesh();
    } 

    public set windSpeed(v:number){
      if(v===this._windSped) return;
      this._windSped=v;
      const l=3+3*v;
      this.arrow.setLength(l);
    }

    public set windDir(v:number){
      if(v===this._windDir) return;
      this.arrow.rotation.z=v;
    }

    public Delete(scene: THREE.Scene):void{
      while (this.mesh.children.length){
        this.mesh.remove(this.mesh.children[0]);
      }
      scene.remove(this.mesh);
    }

    private createMesh(): void{
      this.mesh = new THREE.Mesh(sphereGeometry, earthMaterial);
      this.mesh.receiveShadow = true;
      this.mesh.castShadow = true;
      this.mesh.position.set(this.x, this.y, this.z);
      this.arrow = new THREE.ArrowHelper(
        // first argument is the direction
        new THREE.Vector3(0, 2, 0).normalize(),
        // second argument is the orgin
        new THREE.Vector3(0, 0, 0),
        // length
        5,
        // color
        0x10ff00, 0.8, 0.6);
       
       this.mesh.add(this.arrow) ;
      //this.scene.add(arrow);
    }

}