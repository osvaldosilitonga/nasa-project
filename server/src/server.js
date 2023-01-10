const http = require("http");
require("dotenv").config();

const app = require("./app");
const { mongoConnect } = require("./utils/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// --- STARTING A SERVER ---
async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Server up and running on Port:${PORT}`);
  });
}

startServer();
