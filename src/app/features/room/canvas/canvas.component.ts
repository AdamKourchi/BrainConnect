import {Component, AfterViewInit} from '@angular/core';
import * as easel from 'createjs-module';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzColorBlockComponent, NzColorPickerComponent} from 'ng-zorro-antd/color-picker';
import {FormsModule} from '@angular/forms';
import {Menubar} from 'primeng/menubar';
import {NzButtonComponent, NzButtonModule} from 'ng-zorro-antd/button';
import {NzSpaceCompactComponent} from 'ng-zorro-antd/space';
import {NgClass} from '@angular/common';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-canvas',
  imports: [NzIconModule, NzColorPickerComponent, FormsModule, Menubar, NzButtonComponent, NzColorBlockComponent, NzButtonModule, NzSpaceCompactComponent, NgClass, Toast, Button],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  stage: any;
  layer: any;
  isDrawing: boolean = false;
  drawingSelected: boolean = false;
  erasingSelected: boolean = false;
  oldX: number = 0;
  oldY: number = 0;
  strokeColor: string = 'black';
  strokeWidth: number = 5;
  shape: any;
  textSelected: boolean = false;

  ngAfterViewInit(): void {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    // Adjust for device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Set canvas width and height for high resolution
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    // Scale canvas back to logical size
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Initialize the EaselJS canvas
    this.stage = new easel.Stage('canvas');
    this.layer = new easel.Container();
    this.stage.addChild(this.layer);

    //remove style={}
    const canvasElement = this.stage.canvas;
    canvasElement.removeAttribute("style");


    // Create a new shape for drawing
    this.shape = new easel.Shape();
    this.layer.addChild(this.shape);

    // Initialize drawing and eraser
    this.initializeDrawingErase();

    // Add background or initial UI setup if needed
    this.stage.update();
  }

  initializeDrawingErase() {
    // Pencil drawing event handlers
    this.stage.on('stagemousedown', (event: any) => {
      this.isDrawing = true;
      this.oldX = event.stageX;
      this.oldY = event.stageY;
    });

    this.stage.on('stagemousemove', (event: any) => {
      if (this.isDrawing) {
        const newX = event.stageX;
        const newY = event.stageY;

        if (this.drawingSelected) {
          // Drawing mode
          this.shape.graphics
            .setStrokeStyle(this.strokeWidth)
            .beginStroke(this.strokeColor)
            .moveTo(this.oldX, this.oldY)
            .lineTo(newX, newY);
        } else if (this.erasingSelected) {
          // Erasing mode
          this.shape.graphics
            .setStrokeStyle(25)
            .beginStroke('white')
            .moveTo(this.oldX, this.oldY)
            .lineTo(newX, newY);
        }

        this.oldX = newX;
        this.oldY = newY;

        this.stage.update();
      }
    });

    this.stage.on('stagemouseup', () => {
      this.isDrawing = false;
    });
  }

  clearCanvas() {
    // Remove all children from the layer
    this.layer.removeAllChildren();

    // Reinitialize the shape
    this.shape = new easel.Shape();
    this.layer.addChild(this.shape);

    // Reinitialize the drawing logic
    this.initializeDrawingErase();

    // Update the stage
    this.stage.update();
  }

  addText() {
    const text = new easel.Text('', 'bold 40px Arial', this.strokeColor);

    const stageWidth = this.stage.canvas.width;
    const stageHeight = this.stage.canvas.height;

    // Center the text on the stage
    text.x = stageWidth / 2;
    text.y = stageHeight / 2;

    text.textBaseline = 'top';
    this.layer.addChild(text);
    this.stage.update();

    // Create a temporary input element to capture text
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = '50%';
    input.style.top = '50%';
    input.style.transform = 'translate(-50%, -50%)';
    input.style.border = '2px solid black';
    input.style.borderRadius = '8px';
    input.style.padding = '10px';
    input.placeholder = 'Enter text here...';
    input.id = 'input-message';

    input.style.fontSize = '40px';
    input.style.color = this.strokeColor;
    input.focus();

    let foundInput = document.getElementById('input-message');

    // Add input to the DOM
    foundInput == null
      ? document.body.appendChild(input)
      : document.body.removeChild(foundInput);

    // Handle text input and cleanup
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        text.text = input.value;
        this.stage.update();
        document.body.removeChild(input);
        this.makeTextMovable(text);
      }
    });
  }

  makeTextMovable(text: any) {
    text.on('mousedown', (event: any) => {
      const offsetX = text.x - event.stageX;
      const offsetY = text.y - event.stageY;

      // Attach event listeners for dragging
      let listener = this.stage.on('stagemousemove', (moveEvent: any) => {
        text.x = moveEvent.stageX + offsetX;
        text.y = moveEvent.stageY + offsetY;
        this.stage.update();
      });

      this.stage.on('stagemouseup', () => {
        this.stage.off('stagemousemove', listener);
      });
    });
  }



  handleColorChange() {
    console.log(this.strokeColor);
  }

  handleSelectText() {
    // Deselect other modes
    this.drawingSelected = false;
    this.erasingSelected = false;

    // Toggle text mode
    this.textSelected = !this.textSelected;

    // If text mode is activated, add text to the canvas
    if (this.textSelected) {
      this.addText();
    }
  }

  handleSelectDraw() {
    // Deselect other modes
    this.textSelected = false;
    this.erasingSelected = false;

    // Toggle drawing mode
    this.drawingSelected = !this.drawingSelected;
  }

  handleSelectErase() {
    // Deselect other modes
    this.textSelected = false;
    this.drawingSelected = false;

    // Toggle eraser mode
    this.erasingSelected = !this.erasingSelected;
  }




  saveStage(stage:any) {
    const stageData = stage.children.map((child:any) => child.toJSON());
    console.log(stageData);
    return JSON.stringify(stageData);
  }
  

  
}
