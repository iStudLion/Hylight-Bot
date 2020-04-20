module.exports = {
    queue: [],
    /** 
     * @param {string} query
    */
    play: () => {
        
    },
    /**
     * @param {Object} song
     */
    addToQueue(song) {
        // check if song is valid
        this.queue.push(song);
        if(this.queue.length == 1) {
            
        }
    }
}