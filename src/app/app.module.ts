import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCardModule} from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { P5TestComponent } from './p5-test/p5-test.component';
import { RoutingModule } from './routing/routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ThreeTestComponent } from './three-test/three-test.component';
import { ThreeBasicTestComponent } from './three-basic-test/three-basic-test.component';
import { DlgGetSrvComponent } from './three-test/components/dlg-get-srv/dlg-get-srv.component';
import {GstRestSrvService} from './services/gst-rest-srv.service';
import {GstSignalrService} from './services/gst-signalr.service';


@NgModule({
  declarations: [
    AppComponent,  
    HomeComponent,
    P5TestComponent,
    ThreeTestComponent,
    ThreeBasicTestComponent,
    DlgGetSrvComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    MatToolbarModule,
    MatMenuModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatFormFieldModule ,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    RoutingModule
  ],
  providers: [
    GstRestSrvService,
    GstSignalrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
