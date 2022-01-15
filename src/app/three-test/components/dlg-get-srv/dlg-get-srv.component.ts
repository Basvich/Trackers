import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface ServerData {
  srv: string;
  plant:string;
  tsm: string;
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

  constructor(public dialogRef: MatDialogRef<DlgGetSrvComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServerData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConnectClick(): void {

  }

}
