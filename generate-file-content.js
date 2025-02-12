const fs = require('fs');
const path = require('path');

// Get the current directory where the script is running
const rootDir = process.cwd();
const folderName = path.basename(rootDir);
const outputFile = 'output.txt';
let output = '';

// Queue for BFS
const queue = [];

// Function to wrap content with boltAction tag
function wrapWithBoltAction(filePath, content) {
    return `<boltAction type="file" filePath="${filePath}">\n${content}\n</boltAction>\n\n`;
}

// Function to check if directory should be skipped
function shouldSkipDirectory(dirName) {
    const skipDirs = ['node_modules', 'dist', '.git', '.angular'];
    return skipDirs.includes(dirName);
}

// Function to check if file should be processed
function shouldProcessFile(fileName) {
    // Files to explicitly exclude
    const excludeFiles = [
        'package-lock.json',
        'angular.json',
        'CHANGELOG.md',
        'README.md',
        'generate-file-content.js',
    ];
    
    if (excludeFiles.includes(fileName)) {
        return false;
    }

    const processExtensions = ['.ts', '.js', '.html', '.css', '.md'];
    return processExtensions.includes(path.extname(fileName));
}

// Start with the opening boltArtifact tag
output = `<boltArtifact id="${folderName}" title="${folderName}">\n`;

// Initialize BFS with root directory
queue.push('');

while (queue.length > 0) {
    const currentPath = queue.shift();
    const fullPath = path.join(rootDir, currentPath);
    
    try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            if (!shouldSkipDirectory(path.basename(fullPath))) {
                const items = fs.readdirSync(fullPath);
                
                // Add directories to queue first (BFS)
                items.forEach(item => {
                    const itemPath = path.join(currentPath, item);
                    const fullItemPath = path.join(rootDir, itemPath);
                    
                    try {
                        if (fs.statSync(fullItemPath).isDirectory()) {
                            queue.push(itemPath);
                        }
                    } catch (error) {
                        console.error(`Error processing directory ${fullItemPath}:`, error.message);
                    }
                });
                
                // Then process files in current directory
                items.forEach(item => {
                    const itemPath = path.join(currentPath, item);
                    const fullItemPath = path.join(rootDir, itemPath);
                    
                    try {
                        if (fs.statSync(fullItemPath).isFile() && shouldProcessFile(item)) {
                            const content = fs.readFileSync(fullItemPath, 'utf8');
                            output += wrapWithBoltAction(itemPath, content);
                        }
                    } catch (error) {
                        console.error(`Error processing file ${fullItemPath}:`, error.message);
                    }
                });
            }
        }
    } catch (error) {
        console.error(`Error accessing ${fullPath}:`, error.message);
    }
}

// Add shell commands
output += `<boltAction type="shell">\nnpm i\n</boltAction>\n\n`;
output += `<boltAction type="shell">\nnpm run dev\n</boltAction>\n\n`;

// Close the boltArtifact tag
output += `</boltArtifact>`;

// Write output to file
try {
    fs.writeFileSync(outputFile, output);
    console.log(`File processing complete. Output written to ${outputFile}`);
} catch (error) {
    console.error(`Error writing to output file:`, error.message);
}