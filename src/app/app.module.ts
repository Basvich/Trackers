import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { P5TestComponent } from './p5-test/p5-test.component';
import { RoutingModule } from './routing/routing.module';
import { HomeComponent } from './home/home.component';
import { ThreeTestComponent } from './three-test/three-test.component';
import { ThreeBasicTestComponent } from './three-basic-test/three-basic-test.component';


@NgModule({
  declarations: [
    AppComponent,  
    HomeComponent,
    P5TestComponent,
    ThreeTestComponent,
    ThreeBasicTestComponent
  ],
  imports: [    
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatListModule,
    MatSlideToggleModule,
    MatFormFieldModule ,
    MatInputModule,
    MatTooltipModule,
    RoutingModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
