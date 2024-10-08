import { io } from 'socket.io-client';
import { URL } from './untils';



export const socketMessage = io(URL);