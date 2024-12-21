export class Room {
  id: number; // The ID will be a number in TypeScript (similar to Long in Java)
  codeRoom: string; // Default to an empty string, it will be assigned from the backend or generated
  design: string; // Design can be a string or null if not provided

  constructor(id: number, codeRoom: string, design: string) {
    this.id = id;
    this.codeRoom = codeRoom;
    this.design = design;
  }
}

