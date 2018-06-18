import WebSocket from 'ws';
import EventEmitter from 'events';
import * as motorSlave from './lib/motor-control-slave'

const serverURL = process.env.THZ_serverURL;

const socket: WebSocket = new WebSocket(`ws://${serverURL}:8080/?robot_num=1`);
const emitter = new EventEmitter();
// MAIN MESSAGE LISTENER
socket.on('message', (data: string) => {
    const _data = JSON.parse(data);
    emitter.emit(_data.type, _data);
});

const DOFMap = {
    // F/B, rotate
    L: [ 1,  1 ],
    R: [ 1, -1 ]
};

emitter.on('DOF', onDOF);

function onDOF(data: DOFToken): void {
    const motorVectors: [number, number] = [
        DOFMap.L.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0),
        DOFMap.R.reduce((accum, val, index) => accum + val * data.DOF[index] / 2, 0)
    ];
    console.log(motorVectors);
    motorSlave.sendMotorVectors(motorVectors)
}
