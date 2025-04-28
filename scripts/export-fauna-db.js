const { Client, fql } = require('fauna');
const fs = require('fs');
const client = new Client({
  secret: process.env.FAUNA_DB_SECRET,
});

// Specify the collections to export.
// You can retrieve a list of user-defined collections
// using a `Collection.all()` query.
const collectionsToExport = ['Project'];

// Loop through the collections.
const main = async () => {
  for (const collectionName of collectionsToExport) {
    try {
      // Compose a query using an FQL template string.
      // The query returns a Set containint all documents
      // in the collection.
      const query = fql`
      let collection = Collection(${collectionName})
      collection.all()`;

      // Run the query.
      const pages = client.paginate(query);

      // Iterate through the resulting document Set.
      const documents = [];
      for await (const page of pages.flatten()) {
        documents.push(page);
      }

      // Convert the 'documents' array to a JSON string.
      const jsonData = JSON.stringify(documents, null, 2);

      // Write the JSON string to a file named `<collectionName>.json`.
      fs.writeFileSync(`${collectionName}.json`, jsonData, 'utf-8');

      console.log(
        `${collectionName} collection data written to ${collectionName}.json`
      );
    } catch (error) {
      console.error(`Error exporting ${collectionName}:`, error);
      // if (error instanceof FaunaError) {
      // } else {
      //   console.error(
      //     `An unexpected error occurred for ${collectionName}:`,
      //     error
      //   );
      // }
    }
  }

  // Close the Fauna client.
  client.close();
};

main();
