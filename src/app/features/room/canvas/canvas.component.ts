import { Component, AfterViewInit } from '@angular/core';
import * as easel from 'createjs-module';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  stage: any;
  layer: any;
  isDrawing: boolean = false;
  oldX: number = 0;
  oldY: number = 0;
  strokeColor: string = 'black';
  strokeWidth: number = 5;
  shape: any;

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
      if (this.isDrawing) {
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
}
