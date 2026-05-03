const fs = require('fs').promises;
const path = require('path');

/**
 * DemoDataLoader - Loads real PetClinic migration data for demo playback
 * Uses actual files from Legacy-Modernizer---IBM-Bob-Hackathon directory
 */
class DemoDataLoader {
  constructor() {
    this.basePath = path.join(__dirname, 'data/bob_sessions');
    // Both legacy and modern source live inside the copied bob_sessions data folder
    this.legacyPath = path.join(this.basePath, 'backend/petclinic-legacy');
    this.modernPath = path.join(this.basePath, 'backend/petclinic-legacy');
    this.analysisPath = path.join(this.basePath, 'bob_sessions/02-analysis/output.txt');
    this.migrationPlanPath = path.join(this.basePath, 'bob_sessions/03-plan/migration-plan.md');
    
    this.fileList = [];
    this.analysisData = null;
    this.migrationPlan = null;
  }

  /**
   * Load and parse the analysis output file
   */
  async loadAnalysisOutput() {
    try {
      const content = await fs.readFile(this.analysisPath, 'utf-8');
      this.analysisData = content;
      
      // Parse file list from analysis
      this.fileList = this.parseFileList(content);
      
      return {
        success: true,
        files: this.fileList,
        totalFiles: this.fileList.length,
        data: this.analysisData
      };
    } catch (error) {
      console.error('Error loading analysis output:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Parse file list from analysis output
   */
  parseFileList(content) {
    const files = [];
    const lines = content.split('\n');
    
    // Extract file paths from markdown links like [`path/to/file.java`](path/to/file.java)
    const fileRegex = /\[`([^`]+)`\]/g;
    let match;
    
    while ((match = fileRegex.exec(content)) !== null) {
      const filePath = match[1];
      
      // Determine category and risk level
      let category = 'other';
      let risk = 'low';
      
      if (filePath.includes('/model/')) {
        category = 'model';
        risk = 'high';
      } else if (filePath.includes('/owner/') || filePath.includes('/vet/') || filePath.includes('/visit/')) {
        if (filePath.includes('Controller')) {
          category = 'controller';
          risk = 'medium';
        } else {
          category = 'model';
          risk = 'high';
        }
      } else if (filePath.includes('/test/')) {
        category = 'test';
        risk = 'low';
      } else if (filePath === 'pom.xml') {
        category = 'config';
        risk = 'critical';
      } else if (filePath.includes('application')) {
        category = 'config';
        risk = 'medium';
      }
      
      files.push({
        path: filePath,
        category,
        risk,
        status: 'pending'
      });
    }
    
    return files;
  }

  /**
   * Load migration plan
   */
  async loadMigrationPlan() {
    try {
      const content = await fs.readFile(this.migrationPlanPath, 'utf-8');
      this.migrationPlan = content;
      
      return {
        success: true,
        data: this.migrationPlan
      };
    } catch (error) {
      console.error('Error loading migration plan:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get list of all files to migrate
   */
  async getFileList() {
    if (this.fileList.length === 0) {
      await this.loadAnalysisOutput();
    }
    return this.fileList;
  }

  /**
   * Get files by category
   */
  async getFilesByCategory(category) {
    const files = await this.getFileList();
    return files.filter(f => f.category === category);
  }

  /**
   * Get files by phase
   */
  async getFilesByPhase(phase) {
    const files = await this.getFileList();
    
    switch(phase) {
      case 1: // Configuration
        return files.filter(f => f.category === 'config');
      case 2: // Model Layer
        return files.filter(f => f.category === 'model' && !f.path.includes('/test/'));
      case 3: // Controllers
        return files.filter(f => f.category === 'controller');
      case 4: // Tests
        return files.filter(f => f.category === 'test');
      case 5: // Validation
        return files.slice(0, 5); // Sample files for validation
      default:
        return [];
    }
  }

  /**
   * Get before/after diff for a specific file
   */
  async getFileDiff(filePath) {
    try {
      // Read legacy (before) version
      const legacyFullPath = path.join(this.legacyPath, filePath);
      const modernFullPath = path.join(this.modernPath, filePath);
      
      let beforeContent = '';
      let afterContent = '';
      
      try {
        beforeContent = await fs.readFile(legacyFullPath, 'utf-8');
      } catch (err) {
        console.log(`Legacy file not found: ${legacyFullPath}`);
      }
      
      try {
        afterContent = await fs.readFile(modernFullPath, 'utf-8');
      } catch (err) {
        console.log(`Modern file not found: ${modernFullPath}`);
      }
      
      return {
        success: true,
        filePath,
        before: beforeContent,
        after: afterContent,
        changes: this.summarizeChanges(beforeContent, afterContent)
      };
    } catch (error) {
      console.error(`Error getting diff for ${filePath}:`, error);
      return {
        success: false,
        error: error.message,
        filePath
      };
    }
  }

  /**
   * Summarize changes between before and after
   */
  summarizeChanges(before, after) {
    const changes = [];
    
    if (before.includes('javax.persistence') && after.includes('jakarta.persistence')) {
      changes.push('javax.persistence → jakarta.persistence');
    }
    if (before.includes('javax.validation') && after.includes('jakarta.validation')) {
      changes.push('javax.validation → jakarta.validation');
    }
    if (before.includes('javax.xml.bind') && after.includes('jakarta.xml.bind')) {
      changes.push('javax.xml.bind → jakarta.xml.bind');
    }
    if (before.includes('org.hibernate.validator.constraints.NotEmpty') && 
        after.includes('jakarta.validation.constraints.NotBlank')) {
      changes.push('@NotEmpty → @NotBlank');
    }
    if (before.includes('java.util.Date') && after.includes('java.time.Local')) {
      changes.push('Date → LocalDate/LocalDateTime');
    }
    if (before.includes('<java.version>1.8</java.version>') && 
        after.includes('<java.version>17</java.version>')) {
      changes.push('Java 8 → Java 17');
    }
    if (before.includes('spring-boot-starter-parent') && 
        before.includes('1.5.') && after.includes('3.')) {
      changes.push('Spring Boot 1.5 → 3.x');
    }
    
    return changes;
  }

  /**
   * Get sample files for demo (most interesting changes)
   */
  async getSampleFiles() {
    return [
      'src/main/java/org/springframework/samples/petclinic/model/BaseEntity.java',
      'src/main/java/org/springframework/samples/petclinic/owner/Owner.java',
      'src/main/java/org/springframework/samples/petclinic/owner/Pet.java',
      'src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java',
      'pom.xml'
    ];
  }

  /**
   * Get statistics about the migration
   */
  async getStatistics() {
    const files = await this.getFileList();
    
    return {
      totalFiles: files.length,
      byCategory: {
        config: files.filter(f => f.category === 'config').length,
        model: files.filter(f => f.category === 'model').length,
        controller: files.filter(f => f.category === 'controller').length,
        test: files.filter(f => f.category === 'test').length,
        other: files.filter(f => f.category === 'other').length
      },
      byRisk: {
        critical: files.filter(f => f.risk === 'critical').length,
        high: files.filter(f => f.risk === 'high').length,
        medium: files.filter(f => f.risk === 'medium').length,
        low: files.filter(f => f.risk === 'low').length
      }
    };
  }
}

module.exports = DemoDataLoader;


