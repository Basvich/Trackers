import * as p5 from 'p5';

export class VTracker{
    public constructor(public x:number , public y:number) {

    }

    public drawn(canvasP5: p5){
       canvasP5.triangle(this.x, this.y, this.x+10, this.y+10, this.x-10, this.y+10);
    }
}