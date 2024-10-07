const fs = require('fs').promises;
const path = require('path');
const {isDirectory, getFileInfo} = require('./fileUtils');


/**
 * This function generates teh stats for a given directory path using 
 * the inbuilt methods in the fileUtils file
 * @param {String} dirPath 
 */
async function analyzeDirectory(dirPath){
    const result = {
        totalSize: 0,
        fileCount: 0,
        directoryCount: 0,
        largestFiles: [],
        fileTypes: {}
    };

    try{

        const isPathDirectory = await isDirectory(dirPath);

        if(!isPathDirectory){
            throw new Error(`"Given path is not a directory ${dirPath}`);
        }

        const items = await fs.readdir(dirPath);

        await Promise.all(items.map(async (item) => {

            const itemPath = path.join(dirPath, item);

            if(await isDirectory(itemPath)){
                // Hanlde directory
                result.directoryCount ++;
                const subDirResult = await analyzeDirectory(itemPath);
                //  Merge subDir Result with result
                result.totalSize += subDirResult.totalSize;
                result.fileCount += subDirResult.fileCount;

                result.directoryCount += subDirResult.directoryCount;

                for (const fileType in subDirResult.fileTypes) {
                    result.fileTypes[fileType] = (result.fileTypes[fileType] || 0) + subDirResult.fileTypes[fileType];
                }
            } else {
                // handle file
                result.fileCount ++;
                const fileInfo = await getFileInfo(itemPath);
                result.totalSize += fileInfo.size;
                
                result.fileTypes[fileInfo.type] = (result.fileTypes[fileInfo.type] || 0) + 1;

                // Update largeFiles array
                updateLargestFiles(result.largestFiles, { path: itemPath, size: fileInfo.size });

            }

        }));


    } catch(error) {
        console.error(`Error in analyzeDirectory try/catch ${error}`);
        throw Error(error);
    }

    return result;
}

function updateLargestFiles(largestFiles, newFile, maxFiles = 10) {
    
    //  find the last index of the file that is larger than this file
    if(largestFiles.length == 0){
        largestFiles.push(newFile)
        return;
    }

    // Case 2: New file is larger than or equal to the largest file
    if (newFile.size >= largestFiles[0].size) {
        largestFiles.unshift(newFile);
    } else {
        // Case 3: Find the correct position to insert the new file
        const insertIndex = largestFiles.findIndex(file => file.size < newFile.size);

        // If all existing files are larger, append to the end
        if (insertIndex === -1) {
            largestFiles.push(newFile);
        } else {
            // Insert at the correct position
            largestFiles.splice(insertIndex, 0, newFile);
        }
    }

    if (largestFiles.length > maxFiles) {
        largestFiles.pop();
    }
    
}

module.exports = { analyzeDirectory };
