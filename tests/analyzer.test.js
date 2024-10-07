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
        expect(result.totalSize).toBe(14);
        expect(result.fileTypes).toEqual({
            txt: 2,
            jpg: 1
        });
        // expect(result.largestFiles.length).toBe(3); // Assuming you're tracking all files
        expect(result.largestFiles[0].size).toBe(5);
        expect(result.largestFiles[1].size).toBe(5);
        // expect(result.largestFiles[2].size).toBe(4);
        // expect(result.largestFiles.map(f => path.basename(f.path))).toEqual(
        //     expect.arrayContaining(['file1.txt', 'file2.jpg', 'file3.txt'])
        // );
    });

    test('handles non-existent directory', async () => {
        const nonExistentDir = path.join(os.tmpdir(), 'non-existent-dir');
        await expect(analyzeDirectory(nonExistentDir)).rejects.toThrow();
    });   
    
    test('handles empty directory', async () => {
        const emptyDir = await fs.mkdtemp(path.join(os.tmpdir(), 'empty-dir-'));
        const result = await analyzeDirectory(emptyDir);
        
        expect(result.fileCount).toBe(0);
        expect(result.directoryCount).toBe(0);
        expect(result.totalSize).toBe(0);
        expect(result.fileTypes).toEqual({});
        expect(result.largestFiles).toEqual([]);
    
        await fs.rmdir(emptyDir);
    });    
});
