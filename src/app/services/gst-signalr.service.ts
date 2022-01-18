import {HttpHeaders} from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class GstSignalrService implements OnInit  {
  private headers:HttpHeaders;
  private jwt:string;
  private connection:signalR.HubConnection;
  messageReceived = new EventEmitter<string>();

  public get Jwt(){ return this.jwt;}

  public set Jwt(v:string) {
    this.jwt=v;   
  } 
  
  constructor() { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  public Connect(path:string){
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
