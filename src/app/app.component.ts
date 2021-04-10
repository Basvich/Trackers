import {Component} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatSliderChange} from '@angular/material/slider';
import * as p5 from 'p5';
import {IAlarms, VTracker} from './visual-tracker/VTracker';

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


  /** Zoom del viewPort */
  private zoom = 1;
  /** Vector de traslado de corrdenandas de viewPort*/
  private translateV: p5.Vector;
  /** Limite inferior segun zoom and pan */
  private lowBound = [0, 0];
  /** Limite superior */
  private hightBound = [800, 400];
  title = 'trackers';
  selectedAllTrackers = true;
  selectedIdTracker = 15;
  alarms: IAlarms = {
    noCom: false,
    safePosition: false,
    battery: false,
    motor: false
  };

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
    this.translateV = this.canvasP5.createVector(0, 0);
    this.mouseClicked = this.canvasP5.createVector(0, 0);
    this.canvasP5.noLoop();  // Se desactiva el bucle sobre la funcion draw
    this.canvasP5.draw = () => {
      this.draw();
    };

    this.canvasP5.touchStarted = (event: Record<string, unknown>) => {
      if (event.target != (this.canvasP5 as any).drawingContext.canvas) return true;
      //Guardamos donde se hizo click para el manejar el pan
      this.mouseClicked.set(<number>(event.offsetX), <number>(event.offsetY));
    }

    this.canvasP5.mouseWheel = (event: Record<string, unknown>) => {
      if (event.target != (this.canvasP5 as any).drawingContext.canvas)
        return true;
      const mouseP = this.canvasP5.createVector(<number>(event.offsetX), <number>(event.offsetY));
      const z0 = this.zoom;
      this.zoom += 0.001 * <number>event.delta;
      this.zoom = this.canvasP5.constrain(this.zoom, 0.05, 8);
      const zz = (1 / this.zoom - 1 / z0);
      /* this.tx = x0*zz+this.tx; this.ty = y0*zz+this.ty; */
      this.translateV.add(mouseP.mult(zz));
      this.recalcBounds();
      this.invalidateDrawn();
      return false;
    };

    this.canvasP5.mouseDragged = (event: Record<string, unknown>) => {
      if (event.target != ((this.canvasP5) as any).drawingContext.canvas)
        return true;
      const mouseP = this.canvasP5.createVector(<number>(event.offsetX), <number>(event.offsetY));
      // tx2=(x0p-x0)/z0+tx0;
      const dif = p5.Vector.sub(mouseP, this.mouseClicked).div(this.zoom);
      this.translateV.add(dif);
      this.mouseClicked = mouseP;
      this.recalcBounds();
      this.invalidateDrawn();
      return false;
    };
    this.canvasP5.mouseMoved
  }

  public invalidateDrawn(): void {
    setTimeout(() => this.canvasP5.redraw(), 0);
  }

  public onAngleChanged(event: MatSliderChange): void {
    const g = event.value * Math.PI / 180;
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.rot = g;
    });
    this.invalidateDrawn();
  }

  public onBatteryChanged(event: MatSliderChange): void {
    const g = event.value;
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.battery = g;
    });
    this.invalidateDrawn();
  }

  public onAlarmsChanged(event: MatSlideToggleChange): void {
    const trackers = this.getSelectedTrackers();
    trackers.forEach(tracker => {
      tracker.alarms = this.alarms;
    });
    this.invalidateDrawn();
  }

  protected draw(): void {
    const t0 = performance.now();
    this.canvasP5.background(250);
    this.canvasP5.scale(this.zoom);
    const opt={
      labels:this.zoom>=1
    };
    this.canvasP5.translate(this.translateV);
    this.trackers.forEach(element => {
      if (this.inBounds(element.x, element.y)) {
        element.drawn(this.canvasP5, opt);
      }
    });
    const t1 = performance.now();
    console.log(`Call to doSomething took ${(t1 - t0)} milliseconds.`);
  }

  protected setupTrackers(): void {
    const f = 5000;
    let gx=0;
    let gy=0;
    let y = 20;
    let x = 20;
    for (let i = 0; i < f; i++) {
      if(i>0 && i%500===0){
        gx+=500;
        y=0;
      }
      const nTrack = new VTracker(x+gx, y+gy);
      x += 40;
      if (x > 400) {
        x = 20;
        y += 200;
      }
      this.trackers.push(nTrack);
    }
  }

  protected getSelectedTrackers(): VTracker[] {
    if (this.selectedAllTrackers) return this.trackers;
    return [this.trackers[this.selectedIdTracker]];
  }

  /** Cambia el vector  */
  protected recalcBounds(): void {
    const z = 1 / this.zoom;
    this.lowBound[0] = -this.translateV.x;
    this.lowBound[1] = -this.translateV.y;
    this.hightBound[0] = 800 * z - this.translateV.x;
    this.hightBound[1] = 400 * z - this.translateV.y;
  }

  protected inBounds(x: number, y: number) {
    if (x < this.lowBound[0] || y < this.lowBound[1]) return false;
    if (x > this.hightBound[0] || y > this.hightBound[1]) return false;
    return true;
  }
}
