import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {id} from 'date-fns/locale';
import {GstRestSrvService} from '../../../services/gst-rest-srv.service';

export interface ServerData {
  srv: string;
  plant:string;  
  login: string;
  pass: string;
  jwt: string;
}

@Component({
  selector: 'app-dlg-get-srv',
  templateUrl: './dlg-get-srv.component.html',
  styleUrls: ['./dlg-get-srv.component.scss']
})
export class DlgGetSrvComponent implements OnInit {
  public Host:string;

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
      this.data.srv=localStorage.getItem("pass");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      }
    });
  }

  private showPlants():void{

  }

}
