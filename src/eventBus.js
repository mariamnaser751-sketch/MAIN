// Event Emitter - will be shared across the application

// Make single instance of Event Emitter

// export the event emitter to be used in the application

// eventBus.js


//////////////////////////////////////////////


const EventEmitter = require('events');
const bus = new EventEmitter();

module.exports = bus;
