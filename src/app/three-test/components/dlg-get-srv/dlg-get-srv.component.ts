import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dlg-get-srv',
  templateUrl: './dlg-get-srv.component.html',
  styleUrls: ['./dlg-get-srv.component.scss']
})
export class DlgGetSrvComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DlgGetSrvComponent>) { }

  ngOnInit(): void {
  }

}
