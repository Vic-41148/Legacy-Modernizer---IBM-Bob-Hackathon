const DemoDataLoader = require('./demoDataLoader.cjs');

/**
 * DemoPlaybackEngine - Simulates realistic migration process with actual PetClinic data
 * Executes 5 phases with realistic timing and progress updates
 */
class DemoPlaybackEngine {
  constructor(io) {
    this.io = io;
    this.dataLoader = new DemoDataLoader();
    this.isRunning = false;
    this.currentPhase = 0;
    this.processedFiles = [];
  }

  /**
   * Main entry point - play the full migration demo
   */
  async playMigration() {
    if (this.isRunning) {
      console.log('Migration already running');
      return;
    }

    this.isRunning = true;
    this.currentPhase = 0;
    this.processedFiles = [];

    try {
      // Load data first
      await this.dataLoader.loadAnalysisOutput();
      await this.dataLoader.loadMigrationPlan();

      this.emit('migration:started', {
        message: 'Starting PetClinic migration: Java 8/Spring Boot 1.5 → Java 17/Spring Boot 3',
        timestamp: new Date().toISOString()
      });

      // Execute all 5 phases
      await this.playPhase1(); // Configuration (10s)
      await this.playPhase2(); // Model Layer (15s)
      await this.playPhase3(); // Controllers (12s)
      await this.playPhase4(); // Tests (10s)
      await this.playPhase5(); // Validation (8s)

      this.emit('migration:completed', {
        message: 'Migration completed successfully!',
        totalFiles: this.processedFiles.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Migration error:', error);
      this.emit('migration:error', {
        message: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Phase 1: Configuration (10 seconds)
   * Update pom.xml and application properties
   */
  async playPhase1() {
    this.currentPhase = 1;
    this.emit('phase:started', {
      phase: 1,
      name: 'Configuration Updates',
      description: 'Updating build configuration and dependencies'
    });

    await this.log('🔧 Phase 1: Configuration Updates', 'info');
    await this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    await this.delay(500);

    const configFiles = await this.dataLoader.getFilesByPhase(1);
    
    await this.log('📋 Analyzing build configuration...', 'info');
    await this.delay(1000);

    // Process pom.xml
    await this.log('📝 Updating pom.xml:', 'info');
    await this.delay(800);
    await this.log('  ✓ Spring Boot: 1.5.4.RELEASE → 3.2.x', 'success');
    await this.delay(600);
    await this.log('  ✓ Java version: 1.8 → 17', 'success');
    await this.delay(600);
    await this.log('  ✓ Dependencies: javax → jakarta', 'success');
    await this.delay(600);
    await this.log('  ✓ Hibernate Validator: 5.x → 8.x', 'success');
    await this.delay(600);

    await this.processFile('pom.xml', 'config');
    await this.delay(1000);

    // Process application.properties
    await this.log('📝 Updating application.properties:', 'info');
    await this.delay(800);
    await this.log('  ✓ Management endpoints configuration', 'success');
    await this.delay(600);
    await this.log('  ✓ JPA properties updated', 'success');
    await this.delay(600);

    await this.processFile('src/main/resources/application.properties', 'config');
    await this.delay(1000);

    await this.log('✅ Phase 1 complete: Configuration updated', 'success');
    await this.delay(500);

    this.emit('phase:completed', {
      phase: 1,
      filesProcessed: configFiles.length
    });
  }

  /**
   * Phase 2: Model Layer (15 seconds)
   * Migrate entity classes - javax → jakarta
   */
  async playPhase2() {
    this.currentPhase = 2;
    this.emit('phase:started', {
      phase: 2,
      name: 'Model Layer Migration',
      description: 'Migrating entity classes: javax → jakarta'
    });

    await this.log('', 'info');
    await this.log('🏗️  Phase 2: Model Layer Migration', 'info');
    await this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    await this.delay(500);

    const modelFiles = await this.dataLoader.getFilesByPhase(2);
    
    await this.log(`📊 Found ${modelFiles.length} entity classes to migrate`, 'info');
    await this.delay(1000);

    // Base entities first (highest priority)
    await this.log('', 'info');
    await this.log('🔹 Migrating base entity classes...', 'info');
    await this.delay(800);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/model/BaseEntity.java', [
      'javax.persistence → jakarta.persistence'
    ]);
    await this.delay(1200);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/model/NamedEntity.java', [
      'javax.persistence → jakarta.persistence'
    ]);
    await this.delay(1200);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/model/Person.java', [
      'javax.persistence → jakarta.persistence',
      '@NotEmpty → @NotBlank'
    ]);
    await this.delay(1200);

    // Domain entities
    await this.log('', 'info');
    await this.log('🔹 Migrating domain entities...', 'info');
    await this.delay(800);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/Owner.java', [
      'javax.persistence → jakarta.persistence',
      'javax.validation → jakarta.validation',
      '@NotEmpty → @NotBlank'
    ]);
    await this.delay(1500);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/Pet.java', [
      'javax.persistence → jakarta.persistence',
      'Date → LocalDate',
      '@Temporal removed'
    ]);
    await this.delay(1500);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/PetType.java', [
      'javax.persistence → jakarta.persistence'
    ]);
    await this.delay(1000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/vet/Vet.java', [
      'javax.persistence → jakarta.persistence',
      'javax.xml.bind → jakarta.xml.bind'
    ]);
    await this.delay(1200);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/vet/Specialty.java', [
      'javax.persistence → jakarta.persistence'
    ]);
    await this.delay(1000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/visit/Visit.java', [
      'javax.persistence → jakarta.persistence',
      'Date → LocalDateTime',
      '@NotEmpty → @NotBlank'
    ]);
    await this.delay(1200);

    await this.log('✅ Phase 2 complete: All entities migrated', 'success');
    await this.delay(500);

    this.emit('phase:completed', {
      phase: 2,
      filesProcessed: modelFiles.length
    });
  }

  /**
   * Phase 3: Controllers (12 seconds)
   * Update controller classes
   */
  async playPhase3() {
    this.currentPhase = 3;
    this.emit('phase:started', {
      phase: 3,
      name: 'Controller Migration',
      description: 'Updating REST controllers and validators'
    });

    await this.log('', 'info');
    await this.log('🎮 Phase 3: Controller Migration', 'info');
    await this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    await this.delay(500);

    const controllerFiles = await this.dataLoader.getFilesByPhase(3);
    
    await this.log(`📊 Found ${controllerFiles.length} controllers to update`, 'info');
    await this.delay(1000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java', [
      'javax.validation.Valid → jakarta.validation.Valid'
    ]);
    await this.delay(2000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/PetController.java', [
      'javax.validation.Valid → jakarta.validation.Valid'
    ]);
    await this.delay(2000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/VisitController.java', [
      'javax.validation.Valid → jakarta.validation.Valid'
    ]);
    await this.delay(2000);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/owner/PetValidator.java', [
      'Updated validation logic'
    ]);
    await this.delay(1500);

    await this.migrateFile('src/main/java/org/springframework/samples/petclinic/vet/VetController.java', [
      'Controller updated for Spring Boot 3'
    ]);
    await this.delay(1500);

    await this.log('✅ Phase 3 complete: All controllers updated', 'success');
    await this.delay(500);

    this.emit('phase:completed', {
      phase: 3,
      filesProcessed: controllerFiles.length
    });
  }

  /**
   * Phase 4: Tests (10 seconds)
   * Update test classes
   */
  async playPhase4() {
    this.currentPhase = 4;
    this.emit('phase:started', {
      phase: 4,
      name: 'Test Migration',
      description: 'Updating test classes and validators'
    });

    await this.log('', 'info');
    await this.log('🧪 Phase 4: Test Migration', 'info');
    await this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    await this.delay(500);

    const testFiles = await this.dataLoader.getFilesByPhase(4);
    
    await this.log(`📊 Found ${testFiles.length} test files to update`, 'info');
    await this.delay(1000);

    await this.migrateFile('src/test/java/org/springframework/samples/petclinic/model/ValidatorTests.java', [
      'javax.validation → jakarta.validation'
    ]);
    await this.delay(1500);

    await this.migrateFile('src/test/java/org/springframework/samples/petclinic/service/ClinicServiceTests.java', [
      'Date → LocalDate',
      'Test assertions updated'
    ]);
    await this.delay(2000);

    await this.migrateFile('src/test/java/org/springframework/samples/petclinic/owner/OwnerControllerTests.java', [
      'JUnit 4 → JUnit 5',
      'MockMvc updated'
    ]);
    await this.delay(2000);

    await this.log('🔍 Running test suite...', 'info');
    await this.delay(2000);
    await this.log('  ✓ All tests passing', 'success');
    await this.delay(1000);

    await this.log('✅ Phase 4 complete: Tests updated and passing', 'success');
    await this.delay(500);

    this.emit('phase:completed', {
      phase: 4,
      filesProcessed: testFiles.length
    });
  }

  /**
   * Phase 5: Validation (8 seconds)
   * Final validation and compilation
   */
  async playPhase5() {
    this.currentPhase = 5;
    this.emit('phase:started', {
      phase: 5,
      name: 'Validation & Compilation',
      description: 'Running final checks and compilation'
    });

    await this.log('', 'info');
    await this.log('✅ Phase 5: Validation & Compilation', 'info');
    await this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    await this.delay(500);

    await this.log('🔍 Running final validation checks...', 'info');
    await this.delay(1500);

    await this.log('  ✓ Checking namespace migrations', 'success');
    await this.delay(1000);
    await this.log('  ✓ Verifying dependency versions', 'success');
    await this.delay(1000);
    await this.log('  ✓ Validating configuration files', 'success');
    await this.delay(1000);

    await this.log('', 'info');
    await this.log('🔨 Compiling project...', 'info');
    await this.delay(1500);
    await this.log('  ✓ Compilation successful', 'success');
    await this.delay(1000);

    await this.log('', 'info');
    await this.log('📊 Migration Summary:', 'info');
    await this.delay(500);
    const stats = await this.dataLoader.getStatistics();
    await this.log(`  • Total files processed: ${this.processedFiles.length}`, 'info');
    await this.delay(300);
    await this.log(`  • Configuration files: ${stats.byCategory.config}`, 'info');
    await this.delay(300);
    await this.log(`  • Model classes: ${stats.byCategory.model}`, 'info');
    await this.delay(300);
    await this.log(`  • Controllers: ${stats.byCategory.controller}`, 'info');
    await this.delay(300);
    await this.log(`  • Test files: ${stats.byCategory.test}`, 'info');
    await this.delay(500);

    await this.log('', 'info');
    await this.log('✅ Phase 5 complete: Migration validated', 'success');
    await this.delay(500);

    this.emit('phase:completed', {
      phase: 5,
      filesProcessed: 5
    });
  }

  /**
   * Helper: Migrate a file with changes
   */
  async migrateFile(filePath, changes) {
    await this.log(`📝 Migrating: ${filePath}`, 'info');
    await this.delay(400);
    
    for (const change of changes) {
      await this.log(`    • ${change}`, 'success');
      await this.delay(300);
    }
    
    await this.processFile(filePath, 'migrated');
  }

  /**
   * Helper: Process a file and update status
   */
  async processFile(filePath, status) {
    this.processedFiles.push(filePath);
    
    this.emit('file:updated', {
      path: filePath,
      status: status,
      phase: this.currentPhase
    });
  }

  /**
   * Helper: Log message to terminal
   */
  async log(message, level = 'info') {
    this.emit('terminal:output', {
      message,
      level,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Helper: Emit event to all connected clients
   */
  emit(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  /**
   * Helper: Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      currentPhase: this.currentPhase,
      processedFiles: this.processedFiles.length
    };
  }
}

module.exports = DemoPlaybackEngine;


