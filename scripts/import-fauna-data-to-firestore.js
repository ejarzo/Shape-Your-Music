const admin = require('firebase-admin');
const fs = require('fs');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    ),
  });
}
const db = admin.firestore();

async function importProjects() {
  try {
    // Read the exported JSON file
    const jsonData = JSON.parse(fs.readFileSync('./Project.json', 'utf8'));
    console.log(`Found ${jsonData.length} projects to import`);

    // Get existing project IDs from Firestore
    const existingProjects = await db.collection('projects').get();
    const existingIds = new Set(existingProjects.docs.map(doc => doc.id));
    console.log(`Found ${existingIds.size} existing projects in Firestore`);

    let importedCount = 0;
    let skippedCount = 0;

    // Process each project
    for (const project of jsonData) {
      // Use Fauna's id as Firestore document ID
      const projectId = project.id;

      // Skip if project already exists
      if (existingIds.has(projectId)) {
        console.log(
          `Skipping existing project: ${project.name} (${projectId})`
        );
        skippedCount++;
        continue;
      }

      // Prepare project data for Firestore
      const projectData = {
        name: project.name,
        tempo: project.tempo,
        scale: project.scale,
        tonic: project.tonic,
        isGridActive: project.isGridActive,
        isSnapToGridActive: project.isSnapToGridActive,
        isAutoQuantizeActive: project.isAutoQuantizeActive,
        isProximityModeActive: project.isProximityModeActive ?? false,
        proximityModeRadius: project.proximityModeRadius ?? 400,
        shapesList: (project.shapesList || []).map(shape => ({
          // nested arrays are not allowed in Firestore -- convert to object
          points: { value: shape.points },
          colorIndex: shape.colorIndex,
          volume: shape.volume,
          isMuted: shape.isMuted ?? false,
          quantizeFactor: shape.quantizeFactor ?? 1,
        })),
        selectedSynths: project.selectedSynths,
        userId: project.userId,
        userName: project.userName,
        dateCreated: project.dateCreated,
        // nested arrays fix
        knobVals: (project.knobVals || []).map(vals => ({
          value: vals,
        })),
        // Convert Fauna's ts to Firestore timestamp
        createdAt: admin.firestore.Timestamp.fromMillis(
          new Date(project.ts.isoString).getTime()
        ),
        // Store original Fauna ID for reference
        faunaId: project.id,
      };

      console.log(projectData);

      // Add to Firestore
      await db
        .collection('projects')
        .doc(projectId)
        .set(projectData);
      console.log(`Imported project: ${project.name} (${projectId})`);
      importedCount++;
    }

    console.log('\nImport Summary:');
    console.log(`Total projects processed: ${jsonData.length}`);
    console.log(`Successfully imported: ${importedCount}`);
    console.log(`Skipped (already exists): ${skippedCount}`);
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    // Clean up
    admin.app().delete();
  }
}

// Run the import
importProjects();
