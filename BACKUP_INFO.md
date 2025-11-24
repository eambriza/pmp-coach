# PMP Drill Coach - Backup Information

## Backups Created: November 24, 2025 at 14:57

### Available Backups:

1. **Full Backup (with node_modules)**
   - Location: `../pmp-coach-backup-20251124_145642/`
   - Type: Folder
   - Includes: All files including node_modules

2. **Clean Backup (recommended)**
   - Location: `../pmp-coach-backup-20251124_145702-clean/`
   - Type: Folder
   - Size: ~0.57 MB
   - Excludes: node_modules, .git, dist, build
   - Includes: All source code, configs, and questions.xlsx

3. **Compressed Backup**
   - Location: `../pmp-coach-backup-20251124_145719.zip`
   - Type: ZIP Archive
   - Size: 0.07 MB
   - Excludes: node_modules, .git, dist, build, questions.xlsx
   - Includes: All source code and configuration files

### What Was Backed Up:

- ✅ All source code (`src/` folder)
- ✅ Configuration files (package.json, tsconfig.json, etc.)
- ✅ Vite and build configs
- ✅ Tailwind and PostCSS configs
- ✅ ESLint configuration
- ✅ README and documentation
- ✅ questions.xlsx (in folder backups only)

### To Restore from Backup:

#### From Folder Backup:
```bash
# Copy the clean backup folder
cp -r ../pmp-coach-backup-20251124_145702-clean ./pmp-coach-restored

# Navigate to restored folder
cd pmp-coach-restored

# Install dependencies
npm install

# Run the app
npm run dev
```

#### From ZIP Backup:
```bash
# Extract the zip file
unzip ../pmp-coach-backup-20251124_145719.zip -d pmp-coach-restored

# Navigate to restored folder
cd pmp-coach-restored

# Install dependencies
npm install

# Copy your questions.xlsx file back
cp ../pmp-coach/questions.xlsx .

# Run the app
npm run dev
```

### Recent Changes (Backed Up):

1. **File Parser Updates**
   - Added support for Excel format with single "Options" column
   - Handles line breaks in options (A., B., C., D.)
   - Filters invalid questions automatically
   - Parses 1,386 valid questions from 1,417 total

2. **HomePage Updates**
   - Updated file format documentation table
   - Shows correct column structure: #, Question, Options, Answer

3. **Design System**
   - Glassmorphism effects throughout
   - Consistent styling across all pages
   - Smooth animations and transitions

### Notes:

- The compressed backup excludes `questions.xlsx` because it was locked by another process
- You should keep your original `questions.xlsx` file separately as source data
- To create a new backup, run: `npm run backup` (if script is added to package.json)
