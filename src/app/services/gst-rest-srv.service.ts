import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {map, Observable, tap} from 'rxjs';



interface loginJwt{
  jwt:string
}

interface apiResponse<T>{
  result: T
}

export interface PlantR{
  id:string;
  name:string;
  status:number;
  trackerGroups?: TsmR[];
  geoLocation?: {x:number, y: number};
}

export interface AlarmR{
  alarm: boolean;
  name: string;
  tsmId: string;
  tscId: string;  
}

export interface UtmLocationR{
  x:number,
  y:number
}

export interface TsmR{
  id:string;
  name:string;
  mqttTopic: string;
  utmLocation: UtmLocationR;
  tsCs: TscR[];
}

export interface TscR{
  id:string;
  mqttTopic:string;
  name:string;
  utmLocation: UtmLocationR;
  zCoordinate: number;
}

@Injectable({
  providedIn: 'root'
})
export class GstRestSrvService {
  private headers:HttpHeaders;
  private jwt:string;
  public Host:string;

  public get Jwt(){ return this.jwt;}

  public set Jwt(v:string) {
    this.jwt=v;
    this.generateHeaders();
  } 

  constructor(private http: HttpClient) {
    this.generateHeaders();
  }

  public IsGood():boolean{
    return true;
  }

  public Login(login:string, pass:string): Observable<string> {
    let path="api/Account/login";
    let url=`${this.Host}/${path}`;
    const dataIn={userName:login, password:pass};

    let resp=this.http.post<loginJwt>(url, dataIn).pipe(map(r=>r.jwt)).pipe(tap(jwt=>{this.Jwt=jwt}));   
    return resp;
  }

  public ListPlants(): Observable<PlantR[]>{
    let url=this.getUrl("api/plants");
    let resp=this.http.get<apiResponse<PlantR[]>>(url, {headers:this.headers} ).pipe(map(r=>r.result));
    return resp;
  }

  public GetPlant(id: string): Observable<PlantR>{
    const p=`api/plants/${id}?nesting=2&includeCleanningZones=false`;
    const url=this.getUrl(p);
    let resp=this.http.get<apiResponse<PlantR[]>>(url, {headers:this.headers} )
      .pipe(map(r=>r.result[0]));
    return resp;
  }

  public GetAlarms(id: string): Observable<AlarmR[]>{
    const p=`api/AlarmsView/plant/${id}/all`;
    const url=this.getUrl(p);
    let resp=this.http.get<apiResponse<AlarmR[]>>(url, {headers:this.headers} )
      .pipe(map(r=>r.result));
    return resp;
  }

  

  private getUrl(path: string):string {
    return `${this.Host}/${path}`;
  }

  private generateHeaders(){
    if(!this.jwt){
      this.headers=new HttpHeaders();
    }else{
      this.headers=new HttpHeaders().set("Authorization", "Bearer " + this.jwt);
    }
  }
}
