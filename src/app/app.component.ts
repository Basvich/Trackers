import { Component } from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trackers';
  private canvasP5: p5;

  ngOnInit(): void {
    this.setupP5();    
  }
  setupP5() {
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

  protected draw() {
    this.canvasP5.background(250); 
  }
}
