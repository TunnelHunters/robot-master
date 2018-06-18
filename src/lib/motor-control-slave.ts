import net from 'net';

const port: number = 8081;
const debug: boolean = process.argv.indexOf('--debug') !== -1;

const socket: net.Socket = !debug
    ? net.connect(port, 'localhost')
    : undefined;

export function sendMotorVectors(motorVectors: [number, number]): void {
    if (debug) return;

    socket.write(JSON.stringify(motorVectors));
}
