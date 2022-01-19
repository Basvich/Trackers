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

  public Connect(){
    const path=this.Host+this.path;
    if(this.connection!=null){
      this.connection.stop();
      this.connection=null;
    }         

    this.connection = new signalR.HubConnectionBuilder()  
    .configureLogging(signalR.LogLevel.Information)  
    .withUrl(path, {accessTokenFactory:() => this.jwt}) 
    .withAutomaticReconnect() 
    .build();  

    this.connection.onclose(err => {
      console.log('SignalR hub connection closed.');
      this.stopHubAndunSubscribeToServerEvents();
      //this.restartConnection(err);
    });  

    this.connection.start().then(() => {
      console.log('SignalR Hub connection started');
      this.subscribeToServerEvents();
    })    
  }

  public SubscribeToPlant(plantId: string):Observable<IDataChanged>{
    const url=this.Host+this.path;
    if(this.connection!=null){
      this.connection.stop();
      this.connection=null;
    }  
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(url)
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
      this.connection.send("ConnectToPlant", plantId);
    });
    return subject;
  }

  public GetLastData(plantId:string, tsmId: string){
    if(this.connection==null) return;
    this.connection.send("GetAllVariableLastValues", plantId, tsmId);
  }

  private subscribeToServerEvents(): void {
    this.connection.on('MessageNotification', (data: any) => {
      this.messageReceived.emit('MessageNotification:' + data);
    });
    this.connection.on('PublishMessageAck', (data: any) => {
      this.messageReceived.emit('MessageNotification - Ack :' + data);
    });
  }

  private stopHubAndunSubscribeToServerEvents(): void {
    this.connection.off('MessageNotification');
    this.connection.off('PublishMessageAck');
    this.connection.stop().then(() => console.log('Hub connection stopped'));
  }

  /* private restartConnection(err: Error): void {
    console.log(`Error ${err}`);
    console.log('Retrying connection to SignalR Hub ...');
    setTimeout(() => {
      this.startConnection();
    }, 10000);
  } */
  
}
