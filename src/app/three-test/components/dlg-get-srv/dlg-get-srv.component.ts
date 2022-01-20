import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {id} from 'date-fns/locale';
import {GstRestSrvService} from '../../../services/gst-rest-srv.service';

export interface ServerData {
  srv: string;
  plantId:string;  
  login: string;
  pass: string;
  jwt: string;
}

interface SPlant {
  Id: string;
  Name: string;
}

@Component({
  selector: 'app-dlg-get-srv',
  templateUrl: './dlg-get-srv.component.html',
  styleUrls: ['./dlg-get-srv.component.scss']
})
export class DlgGetSrvComponent implements OnInit {
  public Host:string;
  
  public Plants:SPlant[]= [];
  public SelectedPlantId:string;
  public hidePass = true

  constructor(
    public dialogRef: MatDialogRef<DlgGetSrvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServerData,
    private restApi:GstRestSrvService
  ) {
    // vacio
   }

  ngOnInit(): void {
    if(!this.data.srv){
      this.data.srv=localStorage.getItem("host");
      this.data.login=localStorage.getItem("login");
      this.data.pass=localStorage.getItem("pass");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.data.plantId=this.SelectedPlantId;
    this.dialogRef.close(this.data);
  }
  onConnectClick(): void {
    let b=this.restApi.IsGood();
    console.log(this.data.srv);
    console.log(b)  ;
    this.restApi.Host=this.data.srv;
    this.restApi.Login(this.data.login, this.data.pass).subscribe(jwt=>{
      console.log(jwt);
      if(jwt!=null){
        this.data.jwt=jwt;
        localStorage.setItem("host", this.data.srv);
        localStorage.setItem("login", this.data.login);
        localStorage.setItem("pass", this.data.pass);
        this.getListPlants();
      }
    });
  }

  private getListPlants():void{
    this.restApi.ListPlants().subscribe( ps=>{
      ps.forEach(p=>{
        if(p.status>1) {
          const n:SPlant={Id:p.id, Name:p.name};
          this.Plants.push(n);
        }
      });
      if(this.Plants.length>0){
        this.SelectedPlantId=this.Plants[0].Id;
      }
    }
    );
  }

  public ChangeSelectedPlant(data){
    console.log(data) ;
  }

}
