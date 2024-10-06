const fs = require('fs').promises;
const getExtension = require('path').extname

/**
 * Checks if a given path exists or not
 * @param {String} path 
 * @returns Boolean
 */
function pathExists(path) {

}


/**
 * This function returns the file stats
 * @param {String} path
 * 
 */
async function getStats(path){
    const stats = await fs.stat(path);
    return stats;
}

/**
 * This funtion calculates and returns the hash of a file
 * @param {String} filePath 
 */
function calculateHash(filePath){

}


/**
 * This is an async function that takes in a path and returns true if it is a directory
 * @param {String} path 
 */
async function isDirectory(path) {

    try{
        const stats = await getStats(path);
        return stats.isDirectory();
    } catch(error) {
        console.info(`Error in isDir function caught at try/catch ${error}`);
        return false;
    }
    
}   

/**
 * This function returns the file information about 
 * the given file.
 * @param {String} path 
 */
async function getFileInfo(path) {
   

    try{
        const isDir = await isDirectory(path);

        if(isDir){
            throw new Error(`${path} points to a directory`);
        }
    
    } catch(error){
        throw new Error(`Error in getFileInfo ${path} ${error}`);
    }

    try{
        const stats = await getStats(path);
        const {size, ctime, mtime } = stats;
    
        const extension = getExtension(path).slice(1).toLowerCase() || 'unknown';
    
        return {
            size,
            createdAt: ctime,
            lastModified: mtime,
            type: extension
        }
    } catch(error){
        console.info(`Error in getFileInfo caught in try/catch ${error}`);
        return null;
    }


    
}

module.exports = { isDirectory, getFileInfo };
