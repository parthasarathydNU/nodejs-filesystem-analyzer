const EventEmitter = require('events');

class AnalyzerEmitter extends EventEmitter {
    constructor() {
        super();
        this.totalItems = 0;
        this.processedItems = 0;
    }

    setTotalItems(total) {
        this.totalItems = total;
    }

    itemProcessed() {
        this.processedItems++;
        this.emit('progress', {
            processed: this.processedItems,
            total: this.totalItems,
            percentComplete: (this.processedItems / this.totalItems) * 100
        });
    }
}

module.exports = AnalyzerEmitter;
