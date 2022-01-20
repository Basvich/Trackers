import {T3DTracker} from "../tracksHelpers/trackHelper";

export interface v3D{
    x:number;
    y:number;
    z:number;
}

export class Tsm{
  public Id:string;
  public name:string;
  public Topic:string;
  public pos:v3D;
  /**
   * Tscs con clave Id
   *
   * @type {Map<string,Tsc>}
   * @memberof Tsm
   */
  public TscId:Map<string,Tsc>= new Map<string,Tsc>(); 
  /**
   * Ordenados por el mqtt topic
   *
   * @type {Map<string,Tsc>}
   * @memberof Tsm
   */
  public TscTopic:Map<string,Tsc>= new Map<string,Tsc>();  

  public Add(tsc: Tsc){
    this.TscId.set(tsc.id, tsc);
    this.TscTopic.set(tsc.topic, tsc);
  }
}

export class Tsc{
  public id:string;
  public topic:string;
  public pos:v3D;
  /** Referencia al tracker 3D */
  public Tracker: T3DTracker;

  public setVariableValue(varName: string, value:number){
    switch (varName){
      case "Position_a1_rad":{
        //Vienen con el angulo al reves de lo que usamos
        this.Tracker.rotation=-value;
      }
    }
  }

  public setAlarm(varName: string, value:boolean){
    switch(varName){
      case "CommLost":
        this.Tracker.alarmCom=value;
    }
  }
}