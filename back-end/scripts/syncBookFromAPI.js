const { saveBook } = require("../controllers/bookController");

(async () => {
  const externalId = process.argv[2];

  if (!externalId) {
    console.log("Usage: node scripts/syncBookFromAPI.js <externalId>");
    process.exit(1);
  }

  console.log("Syncing:", externalId);

  await saveBook(
    { params: { externalId } },
    {
      json: (data) => console.log("Done:", data),
      status: (c) => ({ json: (m) => console.log("Error:", c, m) }),
    }
  );
})();