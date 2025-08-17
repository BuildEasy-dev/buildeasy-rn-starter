#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to rename "overlay" to "modal" throughout the codebase
 * This includes file names, directory names, and content replacements
 */

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

// Patterns to replace in file content
const CONTENT_REPLACEMENTS = [
  // Component names and types
  { from: /overlay/g, to: 'modal' },
  { from: /Overlay/g, to: 'Modal' },
  { from: /OVERLAY/g, to: 'MODAL' },

  // File and directory references
  { from: /overlay-/g, to: 'modal-' },
  { from: /\/overlay\//g, to: '/modal/' },
  { from: /\.overlay\./g, to: '.modal.' },

  // Common naming patterns
  { from: /overlays/g, to: 'modals' },
  { from: /Overlays/g, to: 'Modals' },
  { from: /OVERLAYS/g, to: 'MODALS' },
];

// File extensions to process
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'build', '.expo', 'android', 'ios'];

function log(message, level = 'info') {
  if (level === 'verbose' && !VERBOSE) return;
  const prefix = DRY_RUN ? '[DRY RUN] ' : '';
  console.log(`${prefix}${message}`);
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

function shouldProcessDirectory(dirName) {
  return !EXCLUDE_DIRS.includes(dirName);
}

function replaceInContent(content) {
  let newContent = content;
  let hasChanges = false;

  CONTENT_REPLACEMENTS.forEach(({ from, to }) => {
    const beforeReplace = newContent;
    newContent = newContent.replace(from, to);
    if (beforeReplace !== newContent) {
      hasChanges = true;
    }
  });

  return { content: newContent, hasChanges };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, hasChanges } = replaceInContent(content);

    if (hasChanges) {
      log(`Processing file: ${filePath}`, 'verbose');
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, newContent, 'utf8');
      }
      return true;
    }
    return false;
  } catch (error) {
    log(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

function getNewFileName(fileName) {
  return fileName
    .replace(/overlay/g, 'modal')
    .replace(/Overlay/g, 'Modal')
    .replace(/OVERLAY/g, 'MODAL');
}

function renameFile(oldPath, newPath) {
  if (oldPath === newPath) return false;

  log(`Renaming: ${oldPath} → ${newPath}`);
  if (!DRY_RUN) {
    fs.renameSync(oldPath, newPath);
  }
  return true;
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const filesToRename = [];
  const dirsToRename = [];

  // First pass: process files and collect renames
  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (shouldProcessDirectory(entry.name)) {
        processDirectory(fullPath);

        const newName = getNewFileName(entry.name);
        if (newName !== entry.name) {
          dirsToRename.push({
            old: fullPath,
            new: path.join(dirPath, newName),
          });
        }
      }
    } else if (entry.isFile()) {
      if (shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }

      const newName = getNewFileName(entry.name);
      if (newName !== entry.name) {
        filesToRename.push({
          old: fullPath,
          new: path.join(dirPath, newName),
        });
      }
    }
  });

  // Second pass: rename files first, then directories
  filesToRename.forEach(({ old, new: newPath }) => {
    renameFile(old, newPath);
  });

  dirsToRename.forEach(({ old, new: newPath }) => {
    renameFile(old, newPath);
  });
}

function updateImportPaths() {
  log('Updating import paths...');

  // Find all TypeScript/JavaScript files and update import paths
  try {
    const command = `find src -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) -not -path "*/node_modules/*"`;
    const files = execSync(command, { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter((f) => f);

    files.forEach((filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Update import paths
        newContent = newContent.replace(
          /from\s+['"]([^'"]*overlay[^'"]*)['"]/g,
          (match, importPath) => {
            const newImportPath = importPath
              .replace(/overlay/g, 'modal')
              .replace(/Overlay/g, 'Modal');
            return match.replace(importPath, newImportPath);
          }
        );

        // Update require paths
        newContent = newContent.replace(
          /require\s*\(\s*['"]([^'"]*overlay[^'"]*)['"]\s*\)/g,
          (match, requirePath) => {
            const newRequirePath = requirePath
              .replace(/overlay/g, 'modal')
              .replace(/Overlay/g, 'Modal');
            return match.replace(requirePath, newRequirePath);
          }
        );

        if (content !== newContent) {
          log(`Updating imports in: ${filePath}`, 'verbose');
          if (!DRY_RUN) {
            fs.writeFileSync(filePath, newContent, 'utf8');
          }
        }
      } catch (error) {
        log(`Error updating imports in ${filePath}: ${error.message}`);
      }
    });
  } catch (error) {
    log(`Error finding files for import updates: ${error.message}`);
  }
}

function main() {
  console.log('🔄 Starting overlay → modal rename script...\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE: No changes will be made\n');
  }

  // Start from src directory
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.error('❌ src directory not found');
    process.exit(1);
  }

  log('Processing files and directories...');
  processDirectory(srcDir);

  log('Updating import paths...');
  updateImportPaths();

  // Also process app directory if it exists
  const appDir = path.join(process.cwd(), 'src', 'app');
  if (fs.existsSync(appDir)) {
    log('Processing app directory...');
    processDirectory(appDir);
  }

  console.log('\n✅ Overlay → Modal rename completed!');

  if (!DRY_RUN) {
    console.log('\n📋 Next steps:');
    console.log('1. Run: pnpm lint');
    console.log('2. Run: pnpm typecheck');
    console.log('3. Test the application');
    console.log(
      '4. Commit changes: git add . && git commit -m "refactor: rename overlay to modal"'
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = { replaceInContent, getNewFileName };
