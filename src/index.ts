import { readFileSync } from 'fs';
import SocketIOClient from 'socket.io-client';
// import VideoSlave from './lib/video-slave'

// const serverURL = process.env.THZ_serverURL;
const serverURL = 'localhost';
const robotNum = process.env.THZ_robotNum || 1;
const DOFMap = {
    // F/B, rotate
    L: [ 1,  1 ],
    R: [ 1, -1 ]
};

const socket = SocketIOClient.connect(`http://${serverURL}:8000/robot?botNum=${robotNum}`);
// const videoSlave = new VideoSlave();
// videoSlave.on('frame', (frame: Buffer) => {
//     console.log(frame.length);
// });

// MAIN MESSAGE LISTENER
socket.on('connect', () => console.log(`Connected to ${serverURL}!!`));
socket.on('clientConnected', () => socket.emit('frame', readFileSync('scrungus.jpg')));
socket.on('DOF', onDOF);
function onDOF(data: DOFToken): void {
    const motorVectors: [number, number] = [
        DOFMap.L.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0),
        DOFMap.R.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0)
    ];
    console.log(motorVectors);
}
