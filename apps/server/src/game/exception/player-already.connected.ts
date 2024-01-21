export class PlayerAlreadyConnected extends Error {
    constructor() {
        super('Player has an active connection');
        this.name = 'Player Already Connected';
    }
}