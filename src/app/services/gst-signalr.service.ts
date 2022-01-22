import {HttpHeaders} from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {Observable, Subject} from 'rxjs';

export interface IValueInfo{
  value:{
    t: string,
    v: number
  },
  info:{
    variableId: string,
    tsmId: string,
    tscId: string
  }
}

export interface IDataChanged{
  value:{
    t: string,
    v: IValueInfo[]
  },
  info:{
    tsmId:string
  }
}

@Injectable({
  providedIn: 'root'
})
export class GstSignalrService implements OnInit  {
  private headers:HttpHeaders;
  private jwt:string;
  
  private connection:signalR.HubConnection;
  private path="/samplesEmiterHub";
  messageReceived = new EventEmitter<string>();

  public Host:string;
  public PlantId:string;

  public get Jwt(){ return this.jwt;}

  public set Jwt(v:string) {
    this.jwt=v;   
  } 
  
  constructor() { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  public SubscribeToPlant(plantId: string):Observable<IDataChanged>{
    const url=this.Host+this.path;
    if(this.connection!=null){
      this.connection.stop();
      this.connection=null;
    }  
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {accessTokenFactory:()=>this.jwt})
    .build();

    const subject: Subject<IDataChanged> = new Subject<IDataChanged>();

    // On reciving an event when the hub method with the specified method name is invoked
    this.connection.on("DataChanged", (...args: any[]) => {
      // Multicast the event.
      subject.next(args[0]);
      });

       // When the connection is closed.
    this.connection.onclose((err?: Error) => {
      if (err) {
          // An error occurs
          subject.error(err); 
      } else {
          // No more events to be sent.
          subject.complete();
      }
    });
    this.connection.start().then(()=>{
      setTimeout(() => {
        var r=this.connection.send("ConnectToPlant", plantId).then(v=>{
          console.log("ConnectToPlant ok")
        }).catch( err => console.error(err));
      }, 2000);      
    });
    return subject;
  }

  public GetLastData(plantId:string, tsmId: string){
    if(this.connection==null) return;
    this.connection.send("GetAllVariableLastValues", plantId, tsmId).then(v=>{
      console.log("GetAllVariableLastValues ok")
    });
  }


  /* private restartConnection(err: Error): void {
    console.log(`Error ${err}`);
    console.log('Retrying connection to SignalR Hub ...');
    setTimeout(() => {
      this.startConnection();
    }, 10000);
  } */
  
}
