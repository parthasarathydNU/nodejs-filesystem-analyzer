const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { isDirectory, getFileInfo } = require('../src/fileUtils');

describe('isDirectory function', () => {
    let testDir;
  
    beforeAll(async () => {
      // Create a temporary test directory
      testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-analyzer-test-'));
      // Create a file in the test directory
      await fs.writeFile(path.join(testDir, 'testfile.txt'), 'test content');
    });
  
    afterAll(async () => {
      // Clean up: remove the test directory
      await fs.rm(testDir, { recursive: true });
    });
  
    test('returns true for a directory', async () => {
      expect(await isDirectory(testDir)).toBe(true);
    });
  
    test('returns false for a file', async () => {
      expect(await isDirectory(path.join(testDir, 'testfile.txt'))).toBe(false);
    });
  
    test('returns false for non-existent path', async () => {
      expect(await isDirectory(path.join(testDir, 'non-existent'))).toBe(false);
    });
  });

  describe('getFileInfo Function', () => {
    let testDir;
    let testFilePath;

    beforeAll(async () => {
        testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'file-analyzer-test-'));
        testFilePath = path.join(testDir, 'testfile.txt');
        await fs.writeFile(testFilePath, 'test content');
      });
    
      afterAll(async () => {
        await fs.rm(testDir, { recursive: true });
      });
    
      test('returns correct file info for a file', async () => {
        const fileInfo = await getFileInfo(testFilePath);
  
        expect(fileInfo).toHaveProperty('size');
        expect(typeof fileInfo.size).toBe('number');
      
        expect(fileInfo).toHaveProperty('createdAt');
        expect(fileInfo.createdAt.getTime).toBeDefined();
        expect(typeof fileInfo.createdAt.getTime).toBe('function');
      
        expect(fileInfo).toHaveProperty('lastModified');
        expect(fileInfo.lastModified.getTime).toBeDefined();
        expect(typeof fileInfo.lastModified.getTime).toBe('function');
      
        expect(fileInfo).toHaveProperty('type');
        expect(typeof fileInfo.type).toBe('string');
      });
    
      test('returns null for non-existent file', async () => {
        const nonExistentPath = path.join(testDir, 'non-existent.txt');
        const fileInfo = await getFileInfo(nonExistentPath);
        expect(fileInfo).toBeNull();
      });
    
      test('throws error for a directory', async () => {
        await expect(getFileInfo(testDir)).rejects.toThrow('points to a directory');
      });
})
