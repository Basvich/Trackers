import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { P5TestComponent } from '../p5-test/p5-test.component';
import { ThreeTestComponent } from '../three-test/three-test.component';


const routes: Routes = [  
  { path: 'home', component: HomeComponent},
  { path: 'p5Test', component: P5TestComponent},
  { path: 'threeTest', component: ThreeTestComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
         enableTracing: false, // <-- debugging purposes only
       })
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
