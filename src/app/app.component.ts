import { Component } from '@angular/core';
import * as p5 from 'p5';
import {VTracker} from './visual-tracker/VTracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 
  private canvasP5: p5;
  private trackers: VTracker[]= [];
  title = 'trackers';
  ngOnInit(): void {
    this.setupP5();    
    this.setupTrackers();
  }
 

  setupP5():void {
    const sketch = (s) => {
      s.preload = () => {
        // preload code
      };
      s.setup = () => {
        const cc = s.createCanvas(800, 400);
        cc.parent('containerP5');
      };
    };
    this.canvasP5 = new p5(sketch);
    this.canvasP5.noLoop();  // Se desactiva el bucle sobre la funcion draw
    this.canvasP5.draw = () => {
      this.draw();
    };
  }

  public invalidateDrawn(): void{
    this.canvasP5.redraw();
  }

  protected draw(): void {
    this.canvasP5.background(250); 
    this.trackers.forEach(element => {
      element.drawn(this.canvasP5);
    });
  }

  protected setupTrackers(): void{
    const f=10;
    let y=20;
    let x=20;
    for(let i=0; i<f ;i++){
      const nTrack=new VTracker(x,y);
      x+=40;
      if(x>400){
        x=0;
        y+=40;
      }
    this.trackers.push(nTrack);
    }
    
  }
}
