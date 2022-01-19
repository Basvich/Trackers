import {map} from "rxjs";
import {IGeoPosition} from "../tracksHelpers/trackHelper";
import {Tsc, Tsm, v3D} from "./tsm";


export class Plant{
  box:{
    bottLow:v3D,
    topHight:v3D
  }
  public Id:string;  

  public GeoPos:IGeoPosition={longitude:0, latitude:0};
  /** La clave es el Id del tsm */
  public Tsms:Map<string,Tsm>= new Map<string,Tsm>();
  /** La clave es el topic */
  public TsmsTopic:Map<string,Tsm>= new Map<string,Tsm>();

  public AddTsm(tsm: Tsm){
    this.Tsms.set(tsm.Id,tsm);
    this.TsmsTopic.set(tsm.Topic,tsm);
  }

  /**
   * Acerca la planta a las coordenadas 0,0,0
   *
   * @memberof Plant
   */
  public Center(){
    const fTsm: Tsm=this.Tsms.entries().next().value[1];
    const fTsc: Tsc=fTsm.TscId.entries().next().value[1];

    //Buscamos los limites
    this.box={
      bottLow:{
        x:fTsc.pos.x,
        y:fTsc.pos.y,
        z:fTsc.pos.z
      },
      topHight:{
        x:fTsc.pos.x,
        y:fTsc.pos.y,
        z:fTsc.pos.z
      }
    }   
    this.Tsms.forEach(element => {
      element.TscId.forEach(tsc => {
        if(tsc.pos.x< this.box.bottLow.x) this.box.bottLow.x=tsc.pos.x;
        else if(tsc.pos.x> this.box.topHight.x) this.box.topHight.x= this.box.bottLow.x=tsc.pos.x;   
        if(tsc.pos.y< this.box.bottLow.y) this.box.bottLow.y=tsc.pos.y;
        else if(tsc.pos.y> this.box.topHight.y) this.box.topHight.y= this.box.bottLow.y=tsc.pos.y;   
        if(tsc.pos.z< this.box.bottLow.z) this.box.bottLow.z=tsc.pos.z;
        else if(tsc.pos.z> this.box.topHight.z) this.box.topHight.z= this.box.bottLow.z=tsc.pos.z;     
      });
    });
    const cx=(this.box.bottLow.x+this.box.topHight.x)/2;
    const cy=(this.box.bottLow.y+this.box.topHight.y)/2;
    const cz=this.box.bottLow.z;
    //Restamos el nuevo offset a todos los datos
    this.Tsms.forEach(tsm => {
      tsm.pos.x-=cx;
      tsm.pos.y-=cy;      
      tsm.pos.z-=cz;
      tsm.TscId.forEach(tsc => {
        tsc.pos.x-=cx;
        tsc.pos.y-=cy;
        tsc.pos.z-=cz;
      });
    });
  }

}