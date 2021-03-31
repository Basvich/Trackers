import * as p5 from 'p5';

const colorOk = [0, 211, 0, 255];
const colorWarning = [204, 102, 0, 255];
const colorError = [204, 0, 0, 255];
const colorLines = [0, 0, 0, 255];
const colorPanel = [0, 76, 153, 255];
const colorIddle = [192, 192, 192, 255];
const colorHPanel=[153,153,255,255];

const CTracker = {
  panelWidth: 14,
  panelSemiHeight:90,
  baseSemiWidth: 7,
  battery: {
    posY: 12,
    height: 8,
    width: 14,
    poleY: 2,
    poleHeight: 4
  },
  alarms:{
    width:14,
    height:6
  }
};

export interface IAlarms {
  noCom: boolean;
  safePosition: boolean;
  battery: boolean;
  motor: boolean;
}

export class VTracker {

  private panDy = 0;
  private panDx = 14;
  private _rot = 0;
  private _bat = 100;
  private batWidth = CTracker.battery.width - 2;
  private batColor = colorLines;
  private alarmNoComColor=colorIddle;
  private alarmSafePositionColor=colorIddle;
  private alarmBatteryColor=colorIddle;
  private alarmMotorColor=colorIddle;
  public drawPanel=true;

  /**
   * Indica la rotación del panel
   * @memberof VTracker
   */
  public set rot(rot: number) {
    if (rot === this._rot) return;
    this._rot = rot;
    if (rot < -Math.PI / 2) rot = -Math.PI / 2;
    if (rot > Math.PI / 2) rot = Math.PI / 2;
    this.panDy = CTracker.panelWidth * Math.sin(rot);
    this.panDx = CTracker.panelWidth * Math.cos(rot);
  }

  /** Porcentaje de batería */
  public set battery(batPercent: number) {
    this._bat = Math.max(this.battery, 0);
    this._bat = Math.min(this._bat, 100);
    this.batWidth = (CTracker.battery.width - 1) * batPercent / 100;
    if (batPercent >= 50) this.batColor = colorLines;
    else if (batPercent >= 25) this.batColor = colorWarning;
    else this.batColor = colorError;
  }

  public set alarms(alarms: IAlarms) {
    this.alarmNoComColor=this.getAlarmColor(alarms.noCom);
    this.alarmSafePositionColor=this.getAlarmColor(alarms.safePosition);
    this.alarmBatteryColor=this.getAlarmColor(alarms.battery);
    this.alarmMotorColor=this.getAlarmColor(alarms.motor);
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
    canvasP5.noFill();
    //El panel vista superior
    if(this.drawPanel){
      canvasP5.stroke(colorPanel);
      canvasP5.fill(colorHPanel);
      canvasP5.strokeWeight(0.5);
      canvasP5.rect(this.x-this.panDx,this.y-CTracker.panelSemiHeight, 2*this.panDx, 2*CTracker.panelSemiHeight);
    }
    canvasP5.fill(colorOk);
    canvasP5.stroke(colorOk);
    canvasP5.triangle(this.x, this.y, this.x + CTracker.baseSemiWidth, this.y + 10, this.x - CTracker.baseSemiWidth, this.y + 10);
    // El panel vista perfil
    canvasP5.strokeWeight(3);
    canvasP5.stroke(colorPanel);
    canvasP5.line(this.x - this.panDx, this.y - this.panDy, this.x + this.panDx, this.y + this.panDy);
    canvasP5.strokeWeight(1);
    // La batería
    canvasP5.noFill();
    canvasP5.stroke(this.batColor);
    let py = this.y + CTracker.battery.posY;
    canvasP5.rect(this.x - CTracker.baseSemiWidth, py, CTracker.battery.width, CTracker.battery.height);
    canvasP5.rect(this.x - CTracker.baseSemiWidth + CTracker.battery.width, py + CTracker.battery.poleY, 1, CTracker.battery.poleHeight);
    // La carga
    
    canvasP5.fill(this.batColor);
    canvasP5.rect(this.x - CTracker.baseSemiWidth + 1, py + 2, this.batWidth, CTracker.battery.height - 4);
    
    // Zona de alarmas
    canvasP5.stroke(colorLines);
    py+= CTracker.battery.height+2;
    canvasP5.fill(this.alarmNoComColor);
    canvasP5.rect(this.x - CTracker.baseSemiWidth, py, CTracker.alarms.width, CTracker.alarms.height,2);
    py+=CTracker.alarms.height+2;
    canvasP5.fill(this.alarmSafePositionColor);
    canvasP5.rect(this.x - CTracker.baseSemiWidth, py, CTracker.alarms.width, CTracker.alarms.height,2);
    py+=CTracker.alarms.height+2;
    canvasP5.fill(this.alarmBatteryColor);
    canvasP5.rect(this.x - CTracker.baseSemiWidth, py, CTracker.alarms.width, CTracker.alarms.height,2);
    py+=CTracker.alarms.height+2;
    canvasP5.fill(this.alarmMotorColor);
    canvasP5.rect(this.x - CTracker.baseSemiWidth, py, CTracker.alarms.width, CTracker.alarms.height,2);  
  }

  private getAlarmColor(active:boolean){
    if(active) return colorError;
    else return colorIddle;
  }


}