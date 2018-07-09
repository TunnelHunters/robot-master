import WebSocket from 'ws';
import EventEmitter from 'events';
import { VideoSlave } from './lib/video-slave'

const serverURL = process.env.THZ_serverURL;
const DOFMap = {
    // F/B, rotate
    L: [ 1,  1 ],
    R: [ 1, -1 ]
};

// const socket: WebSocket = new WebSocket(`ws://${serverURL}:8080/?robot_num=1`);
const emitter = new EventEmitter();
const videoSlave = new VideoSlave();
videoSlave.on('frame', (frame: Buffer) => {
    console.log(frame.length);
});

// MAIN MESSAGE LISTENER
// socket.on('message', (data: string) => {
//     const _data = JSON.parse(data);
//     emitter.emit(_data.type, _data);
// });

emitter.on('DOF', onDOF);
function onDOF(data: DOFToken): void {
    const motorVectors: [number, number] = [
        DOFMap.L.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0),
        DOFMap.R.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0)
    ];
    console.log(motorVectors);
}
