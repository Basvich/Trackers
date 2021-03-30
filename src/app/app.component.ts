import {Component} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';
import * as p5 from 'p5';
import {VTracker} from './visual-tracker/VTracker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private canvasP5: p5;
  private trackers: VTracker[] = [];
  /** Posicion donde se hizo click */
  private mouseClicked: p5.Vector;
  private offsetMouseClick=[0,0];

  /** Zoom del viewPort */
  private zoom = 1; 
  /** Vector de traslado de corrdenandas de viewPort*/ 
  private translateV: p5.Vector;
  title = 'trackers';
  ngOnInit(): void {
    this.setupP5();
    this.setupTrackers();
  }


  setupP5(): void {
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
    this.translateV= this.canvasP5.createVector(0,0);
    this.mouseClicked=this.canvasP5.createVector(0,0);
    this.canvasP5.noLoop();  // Se desactiva el bucle sobre la funcion draw
    this.canvasP5.draw = () => {
      this.draw();
    };

    this.canvasP5.touchStarted=(event: Record<string, unknown>)=>{
      if (event.target != (this.canvasP5 as any).drawingContext.canvas) return true;
      //Guardamos donde se hizo click para el manejar el pan
      this.mouseClicked.set(<number>(event.offsetX), <number>(event.offsetY));        
    }

    this.canvasP5.mouseWheel = (event: Record<string, unknown>) => {
      if (event.target != (this.canvasP5 as any).drawingContext.canvas)
        return true;      
      const mouseP=this.canvasP5.createVector(<number>(event.offsetX), <number>(event.offsetY) );   
      const z0 = this.zoom;
      this.zoom += 0.001 * <number>event.delta;
      this.zoom = this.canvasP5.constrain(this.zoom, 0.05, 8);
      const zz=(1/this.zoom-1/z0);
      /* this.tx = x0*zz+this.tx; this.ty = y0*zz+this.ty; */
      this.translateV.add(mouseP.mult(zz));
      this.invalidateDrawn();
      return false;
    };

    this.canvasP5.mouseDragged = (event: Record<string, unknown>) => {
      if (event.target != ((this.canvasP5) as any).drawingContext.canvas)
        return true;
      const mouseP=this.canvasP5.createVector(<number>(event.offsetX), <number>(event.offsetY) );   
      // tx2=(x0p-x0)/z0+tx0;
      const dif=p5.Vector.sub(mouseP, this.mouseClicked).div(this.zoom);
      this.translateV.add(dif);
      this.mouseClicked=mouseP;
      this.invalidateDrawn();
      return false;
    };
    this.canvasP5.mouseMoved
  }

  public invalidateDrawn(): void {
    setTimeout(() => this.canvasP5.redraw(), 0);
  }

  public onAngleChanged(event: MatSliderChange): void{
    const g=event.value*Math.PI/180;
    this.trackers.forEach(tracker => {
      tracker.rot=g;
    });
    this.invalidateDrawn();
  }

  public onBatteryChanged(event: MatSliderChange): void{
    const g=event.value;
    this.trackers.forEach(tracker => {
      tracker.battery=g;
    });
    this.invalidateDrawn();
  }

  protected draw(): void {
    this.canvasP5.background(250);
    this.canvasP5.scale(this.zoom);
    this.canvasP5.translate(this.translateV);
    this.trackers.forEach(element => {
      element.drawn(this.canvasP5);
    });
  }

  protected setupTrackers(): void {
    const f = 1000;
    let y = 20;
    let x = 20;
    for (let i = 0; i < f; i++) {
      const nTrack = new VTracker(x, y);
      x += 40;
      if (x > 1200) {
        x = 20;
        y += 80;
      }
      this.trackers.push(nTrack);
    }
  }
}
