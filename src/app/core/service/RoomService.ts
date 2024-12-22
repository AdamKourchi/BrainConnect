import { Room } from '../module/room/Room';
import axios from 'axios';
import { User } from '../module/room/User';

export default class RoomService {
  url: string = 'http://localhost:8080/api/rooms';

  public saveRoom(room: Room, user: User) {
    return axios.post(`${this.url}/save/${user.id}`,room);
  }
}
