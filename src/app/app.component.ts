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

  private zoom = 1;
  private tx = -20;
  private ty = 0;
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
    this.canvasP5.noLoop();  // Se desactiva el bucle sobre la funcion draw
    this.canvasP5.draw = () => {
      this.draw();
    };
    this.canvasP5.mouseWheel = (event: Record<string, unknown>) => {
      if (event.target != (this.canvasP5 as any).drawingContext.canvas)
        return true;
      const x0 = <number>(event.offsetX);
      const y0 = <number>(event.offsetY);     
      const z0 = this.zoom;
      this.zoom += 0.001 * <number>event.delta;
      this.zoom = this.canvasP5.constrain(this.zoom, 0.05, 8);
      const zz=(1/this.zoom-1/z0);
      this.tx = x0*zz+this.tx;
      this.ty = y0*zz+this.ty;
      this.invalidateDrawn();
      return false;
    };

    this.canvasP5.mouseDragged = (event: Record<string, unknown>) => {
      if (event.target != ((this.canvasP5) as any).drawingContext.canvas)
        return true;
      this.tx = <number>event.offsetX;
      this.ty = <number>event.offsetY;
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
    this.canvasP5.translate(this.tx, this.ty);
    this.trackers.forEach(element => {
      element.drawn(this.canvasP5);
    });
  }

  protected setupTrackers(): void {
    const f = 5000;
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
