const { analyzeDirectory, AnalyzerEmitter } = require('./src/analyzer');

async function runAnalysis(dirPath) {
    const emitter = new AnalyzerEmitter();

    emitter.on('progress', ({ processed, total, percentComplete }) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Progress: ${processed}/${total} (${percentComplete.toFixed(2)}%)`);
    });
    
    const result = await analyzeDirectory(dirPath, emitter);    
    
    console.log('\nAnalysis complete:');
    console.log(JSON.stringify(result, null, 2));    

}

const directoryPath = process.argv[2];

if (!directoryPath) {
    console.error('Please provide a directory path');
    process.exit(1);
}

runAnalysis(directoryPath).catch(console.error);
