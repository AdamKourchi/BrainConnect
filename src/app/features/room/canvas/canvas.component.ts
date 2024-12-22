import { Component, AfterViewInit } from '@angular/core';
import * as easel from 'createjs-module';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-canvas',
  imports: [NzIconModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  stage: any;
  layer: any;
  isDrawing: boolean = false;
  drawingSelected: boolean = false;
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

    // Create a new shape for drawing
    this.shape = new easel.Shape();
    this.layer.addChild(this.shape);

    // Initialize drawing
    this.initializeDrawing();

    // Add background or initial UI setup if needed
    this.stage.update();
  }

  initializeDrawing() {
    // Pencil drawing event handlers
    this.stage.on('stagemousedown', (event: any) => {
      this.isDrawing = true;
      this.oldX = event.stageX;
      this.oldY = event.stageY;
    });

    this.stage.on('stagemousemove', (event: any) => {
      if (this.isDrawing && this.drawingSelected) {
        const newX = event.stageX;
        const newY = event.stageY;

        this.shape.graphics
          .setStrokeStyle(this.strokeWidth)
          .beginStroke(this.strokeColor)
          .moveTo(this.oldX, this.oldY)
          .lineTo(newX, newY);

        this.oldX = newX;
        this.oldY = newY;

        this.stage.update();
      }
    });

    this.stage.on('stagemouseup', () => {
      this.isDrawing = false;
    });

    // Enable mouse interactions
    this.stage.enableMouseOver();
  }

  clearCanvas() {
    // Remove all children from the layer
    this.layer.removeAllChildren();

    // Reinitialize the shape
    this.shape = new easel.Shape();
    this.layer.addChild(this.shape);

    // Reinitialize the drawing logic
    this.initializeDrawing();

    // Update the stage
    this.stage.update();
  }

  handleSelectDraw() {
    this.drawingSelected = !this.drawingSelected;
  }

  addText(x: number, y: number) {
    const text = new easel.Text('', 'bold 40px Arial', this.strokeColor); // Make it bold
    text.x = x;
    text.y = y;
    text.textBaseline = 'top';

    // Add a transparent rectangle for selection
    const rect = new easel.Shape();
    rect.graphics
      .beginFill('rgba(0, 0, 0, 0)') // Transparent fill
      .drawRect(
        text.x,
        text.y,
        text.getMeasuredWidth(),
        text.getMeasuredHeight()
      );
    rect.cursor = 'pointer'; // Make it easier to select with a cursor change

    this.layer.addChild(rect); // Add the rectangle for interaction
    this.layer.addChild(text); // Add the text above the rectangle
    this.stage.update();

    // Create a temporary input element to capture text
    const input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'absolute';
    input.style.left = '50%';
    input.style.top = '50%';
    input.style.transform = 'translate(-50%, -50%)'; // Center the element
    input.style.border = '2px solid black'; // Add a border
    input.style.borderRadius = '8px'; // Add border radius
    input.style.padding = '10px'; // Optional: Add padding for better appearance
    input.placeholder = 'Enter text here...'; // Add grayed-out placeholder
    input.id = 'input-message';

    input.style.fontSize = '40px';
    input.style.color = this.strokeColor;
    input.focus();

    let foundInput = document.getElementById('input-message');

    // Add input to the DOM
    foundInput == null
      ? document.body.appendChild(input)
      :   foundInput.parentNode?.removeChild(foundInput); // Remove using its parent

    // Handle text input and cleanup
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        text.text = input.value;
        this.stage.update();
        document.body.removeChild(input); // Remove input from DOM
        this.makeTextMovable(text); // Enable drag-and-drop for this text
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

  handleSelectText() {
    this.textSelected = true;
    this.addText(0, 0);
    this.drawingSelected = false; // Disable drawing mode
  }
}
