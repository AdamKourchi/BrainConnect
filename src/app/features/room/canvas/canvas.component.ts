import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzColorPickerComponent} from 'ng-zorro-antd/color-picker';
import {FormsModule} from '@angular/forms';
import {NzButtonComponent, NzButtonModule} from 'ng-zorro-antd/button';
import {NzSpaceCompactComponent} from 'ng-zorro-antd/space';
import RoomService from '../../../core/service/RoomService';
import {Room} from '../../../core/module/room/Room';
import {ActivatedRoute} from '@angular/router';
import * as fabric from 'fabric';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-canvas',
  imports: [
    NzIconModule,
    NzColorPickerComponent,
    FormsModule,
    NzButtonComponent,
    NzButtonModule,
    NzSpaceCompactComponent,
    NzDrawerModule
  ],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private readonly REFRESH_INTERVAL = 1000; // Refresh every 1 seconds
  roomId!: number;
  room: any;
  canvas: any;
  drawingSelected: boolean = false;
  erasingSelected: boolean = false;
  oldX: number = 0;
  oldY: number = 0;
  strokeColor: string = 'black';
  strokeWidth: number = 1;
  textSelected: boolean = false;
  roomService: RoomService = new RoomService();
  private lastFetchedData: string = ''; // Stores the last fetched canvas data
  private isUserInteracting: boolean = false; // Tracks user interaction
  private saveSubject = new Subject<void>();
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.canvas = new fabric.Canvas('canvas');

    this.saveSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.saveStage();
    });
  }

  ngOnDestroy(): void {
    this.saveSubject.complete();
    clearInterval(this.intervalId);
  }

  ngAfterViewInit(): void {
    // Set canvas to fullscreen
    this.setCanvasSize();
    // Optionally handle window resize
    window.addEventListener('resize', this.setCanvasSize.bind(this));

    this.setupCanvasListeners();

    this.roomService.getRoomById(this.roomId).then((response) => {
      this.room = response.data;
      this.restoreStage(this.room.design);
    });

    this.intervalId = setInterval(() => {
      console.log('refreshing');
      this.roomService.getRoomById(this.roomId).then((response) => {
        this.room = response.data;
        if (this.isUserInteracting) {
          console.log('No ');
          return;

        }
        this.restoreStage(this.room.design);
      });
    }, this.REFRESH_INTERVAL);
  }

  private setCanvasSize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set canvas size to full screen
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.renderAll(); // Re-render canvas after resizing
  }

  clearCanvas() {
    this.canvas.clear();
  }

  addText() {
    const text = new fabric.Textbox('Enter text here...', {
      left: this.canvas.width / 2,
      top: this.canvas.height / 2,
      fontSize: 40,
      fill: this.strokeColor,
      editable: true,
      selectable: true

    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();

    // Make text movable
    text.on('mousedown', () => {
      text.set({cursor: 'move'});
    });
  }

  handleColorChange() {
    console.log(this.strokeColor);
  }

  handleSelectText() {
    // Deselect other modes
    this.drawingSelected = false;
    this.erasingSelected = false;
    this.canvas.isDrawingMode = this.drawingSelected;

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
    this.drawingSelected = !this.drawingSelected;
    this.canvas.isDrawingMode = this.drawingSelected;

    if (this.drawingSelected) {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.strokeColor; // Brush color
      this.canvas.freeDrawingBrush.width = 5; // Brush width
    }
  }

  handleSelectErase() {
    // Deselect other modes
    this.drawingSelected = false;
    this.textSelected = false;
    this.erasingSelected = !this.erasingSelected;

    // Toggle erase mode
    if (this.erasingSelected) {
      this.canvas.isDrawingMode = false;
      this.canvas.selection = false;
      this.canvas.defaultCursor = 'pointer';
    } else {
      this.canvas.selection = true;
      this.canvas.defaultCursor = 'default';
    }

    // Call deleteSelectedObjects when in erase mode
    if (this.erasingSelected) {
      this.deleteSelectedObjects();
    }
  }

  deleteSelectedObjects(): void {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: fabric.Object) => {
        this.canvas.remove(obj);
      });
      this.canvas.discardActiveObject();
    }
  }


  saveStage() {
    console.log('Svaing...');

    const savedData = JSON.stringify(this.canvas.toJSON());
    // Also save to database
    this.roomService.saveRoomState(savedData, this.roomId);
  }


  restoreStage(savedData: string): void {
    console.log('Restoring canvas state...');

    if (this.isUserInteracting) return;

    if (savedData !== this.lastFetchedData) {

      this.lastFetchedData = savedData;

      this.canvas.loadFromJSON(savedData, () => {
        this.canvas.requestRenderAll();
        console.log('Canvas state restored and rendered');

        this.canvas.forEachObject((obj: fabric.Object) => {
          obj.set('opacity', 1); // Ensure objects are fully visible
          obj.set('selectable', true); // Make sure objects are selectable (if needed)
        });
        this.canvas.requestRenderAll();
      });
    }
  }


  private setupCanvasListeners(): void {
    const events = [
      'object:modified',
      'object:added',
      'object:removed',
      'canvas:modified',
      'mouse:up',
      'mouse:down',
      'selection:created',
      'object:moved',
      'text:changed',
      'text:editing:entered',
      'text:editing:exited',
      'text:selection:changed',
      'text:changed',
      'object:rotating',
      'object:scaling',
      'object:skewing',
      'path:created'
    ];

    events.forEach(event => {
      this.canvas.on(event, () => {
        this.isUserInteracting = true;
        this.saveSubject.next();
        this.resetInteractionFlag();
      });
    });
  }

  private resetInteractionFlag(): void {
    setTimeout(() => {
      this.isUserInteracting = false;
    }, 1000); // Adjust delay as needed
  }


}
