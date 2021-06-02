import * as THREE from "three";
import {ThreeTestComponent} from "../three-test.component";



export interface IAlarms {
    noCom: boolean;
    safePosition: boolean;
    battery: boolean;
    motor: boolean;
  }

  export interface IGeoPosition{
    longitude: number;
    latitude: number;
  }
  
  const colorAlarm=new THREE.Color(  0xf01010);
  const colorOk=new THREE.Color( 0x10f010);

  const lpanelMaterial=new THREE.MeshLambertMaterial({color: 0x2233FF});    
  const panelGeometry = new THREE.BoxBufferGeometry(4, 30, 0.3);
  const indicatorGeom=new THREE.PlaneBufferGeometry(3,1);    
  

  export class T3DTracker {
    private panelMesh:THREE.Mesh;
    private safePosMesh:THREE.Mesh;
    private NoComMesh:THREE.Mesh;
    public get Mesh():THREE.Mesh {return this.panelMesh;}
    public set rotation(a:number){
      this.panelMesh.rotation.y=a;
    }   

    public get rotation():number{
      return this.panelMesh.rotation.y;
    }

    public set alarmCom(v: boolean){
      let color;
      if(v) color=colorAlarm;
      else color=colorOk;
      (<THREE.LineBasicMaterial>this.safePosMesh.material).color=color;
    }

    public set alarmSafePos(v: boolean){
      const color=v?colorAlarm:colorOk;      
      (<THREE.LineBasicMaterial>this.NoComMesh.material).color=color;
    }
    
    public constructor(public x: number, public y: number, public z:number=0) {
      this.createMesh();
    } 

    private createMesh(): void{
      const panelMesh = new THREE.Mesh(panelGeometry, lpanelMaterial);
      panelMesh.receiveShadow = true;
      panelMesh.castShadow = true;
      panelMesh.position.x = this.x;
      panelMesh.position.y = this.y;
      panelMesh.position.z=this.z + 3;
      panelMesh.rotation.y=0;
      const spMat=new THREE.LineBasicMaterial({color:0x10f010 })   ;
      const sp=new THREE.Mesh(indicatorGeom, spMat);
      sp.position.set(0, 0, 0.2);
      panelMesh.add(sp);      
      this.safePosMesh=sp;
      const ncMat=new THREE.LineBasicMaterial({color:0x10f010 })   ;
      const nc=new THREE.Mesh(indicatorGeom, ncMat);
      nc.position.z=0.2;
      nc.position.set(0, 1.5, 0.2);
      panelMesh.add(nc);
      this.NoComMesh=nc;

      this.panelMesh=panelMesh;
    }
  }