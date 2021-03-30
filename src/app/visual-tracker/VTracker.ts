import * as p5 from 'p5';

const colorOk=[0, 211, 0, 255];
const colorWarning=[255,128,0,255];
const colorError=[204,0,0,255];
const colorLines=[0,0,0,255];
const colorPanel=[0,76,153,255];  

const CTracker={
  panelWidth:12,
  baseSemiWidth:6,
  battery:{
    posY:12,
    height:4,
    width:10,
    poleY:1,
    poleHeight:2
  }
};

export class VTracker {  
   
  private panDy = 0;
  private panDx = 10;
  private _rot=0;
  private _bat=100;
  private batWidth=CTracker.battery.width-2;
  private batColor=colorLines;

  /**
   * Indica la rotación del panel
   * @memberof VTracker
   */
  public set rot(rot:number){
    if(rot===this._rot) return;
    this._rot=rot;
    if(rot<-Math.PI/2) rot=-Math.PI/2;
    if(rot>Math.PI/2) rot=Math.PI/2;
    this.panDy=CTracker.panelWidth*Math.sin(rot);
    this.panDx=CTracker.panelWidth*Math.cos(rot);
  }

  /** Porcentaje de batería */
  public set battery(batPercent:number){
    this._bat=Math.max(this.battery,0);
    this._bat=Math.min(this._bat,100);
    this.batWidth=CTracker.battery.width*batPercent/100;
    if(batPercent>=50) this.batColor=colorLines;
    else if(batPercent>=25) this.batColor=colorWarning;
    else this.batColor=colorError;
  }

/**
 * Creates an instance of VTracker.
 * @param {number} x
 * @param {number} y
 * @memberof VTracker
 */
public constructor(public x: number, public y: number) {

  }

  public drawn(canvasP5: p5): void {
    
    canvasP5.stroke(colorOk);
    canvasP5.triangle(this.x, this.y, this.x + CTracker.baseSemiWidth, this.y + 10, this.x - CTracker.baseSemiWidth, this.y + 10);
    //El panel
    canvasP5.strokeWeight(3);
    canvasP5.stroke(colorPanel);
    canvasP5.line(this.x-this.panDx, this.y-this.panDy, this.x+this.panDx, this.y+this.panDy);
    canvasP5.strokeWeight(1);
    //La batería
    canvasP5.stroke(colorLines);
    const py=this.y+CTracker.battery.posY;
    canvasP5.rect(this.x-CTracker.baseSemiWidth, py, CTracker.battery.width, CTracker.battery.height );
    canvasP5.rect(this.x-CTracker.baseSemiWidth+CTracker.battery.width, py+CTracker.battery.poleY, 1, CTracker.battery.poleHeight );
    canvasP5.stroke(this.batColor);
    canvasP5.fill(this.batColor);
    canvasP5.rect(this.x-CTracker.baseSemiWidth+1, py+1, this.batWidth, CTracker.battery.height-2 );
    canvasP5.noFill();
  }
}