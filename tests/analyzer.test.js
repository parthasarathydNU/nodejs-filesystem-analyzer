const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { analyzeDirectory } = require('../src/analyzer');

describe('analyzeDirectory function', () => {
    let testDir;

    beforeAll(async () => {
        testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-analyzer-test-'));
        
        // Create test directory structure
        await fs.mkdir(path.join(testDir, 'subdir'));
        await fs.writeFile(path.join(testDir, 'file1.txt'), 'Hello');
        await fs.writeFile(path.join(testDir, 'file2.jpg'), 'World');
        await fs.writeFile(path.join(testDir, 'subdir', 'file3.txt'), 'Test');
    });

    afterAll(async () => {
        await fs.rm(testDir, { recursive: true });
    });

    test('correctly analyzes directory structure', async () => {
        const result = await analyzeDirectory(testDir);

        expect(result.fileCount).toBe(3);
        expect(result.directoryCount).toBe(1);
        expect(result.totalSize).toBe(14); // 'Hello' + 'World' + 'Test' = 5 + 5 + 4 = 14 bytes
        expect(result.fileTypes).toEqual({
            txt: 2,
            jpg: 1
        });
        // expect(result.largestFiles.length).toBe(3);
        expect(result.largestFiles[0].size).toBe(5); // 'Hello' or 'World'
    });
});
