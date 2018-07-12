import { Socket, Server, createServer } from 'net'
import { existsSync, unlinkSync } from 'fs'
import EventEmitter from 'events'
import exitHook from 'exit-hook'

const socket_path = process.env.THZ_videoSocket;
const endOfFrame = Buffer.from([0xFF, 0xD9]);

exitHook(() => {
    // delete socket file on exit
    if (existsSync(socket_path))
        unlinkSync(socket_path);

    console.log(`Deleted ${socket_path}.`)
});

export default class VideoSlave extends EventEmitter {
    private socket: Socket;
    private server: Server = createServer().listen(socket_path, () => console.log(`listening at ${socket_path}`));
    private accumulator: Buffer = Buffer.alloc(0);

    constructor() {
        super();
        this.server.on('connection', socket => {
            console.log('Video salve connected!!');

            socket.on('data', this.processFrameData.bind(this));
            socket.on('close', hadError => {
                console.log(`Connection to video slave closed${hadError ? ' with error' : ''}`);
                this.socket = undefined;
            });
            this.socket = socket;
        });
    }

    private processFrameData(data: Buffer): void {
        const frameEndIndex = data.indexOf(endOfFrame);
        // If there's an end of frame marker in the data,
        if (frameEndIndex !== -1) {
            // Concatenate the accumulator and everything in data up to (and including) the end of frame marker
            this.emit('frame', Buffer.concat([this.accumulator, data.slice(0, frameEndIndex + 2)]));
            // clear the accumulator
            this.accumulator = Buffer.alloc(0);
            // recursive call on the rest of the data
            this.processFrameData(data.slice(frameEndIndex + 2, data.length));
            return;
        }
        // Otherwise just add everything to the accumulator
        this.accumulator = Buffer.concat([this.accumulator, data]);
    }

}
