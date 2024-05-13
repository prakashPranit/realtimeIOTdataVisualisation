// Import required modules and libraries
const express = require('express');
const { apiRouter } = require('./api');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const prisma = require("./prisma/client");

// Create an Express application
const app = express();

// Define the port
const port = 5000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Configure Socket.IO with CORS settings
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Mount the API router
app.use('/api', apiRouter);

// Socket.IO event handler for client connections
io.on('connection', (socket) => {
  console.log('a client connected');

  // Join a specific room
  socket.join('TEMP-SENSOR-ROOM');

  // Socket disconnection event handler
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Periodically emit time to clients in the 'TEMP-SENSOR-ROOM' room
setInterval(() => {
  io.to('TEMP-SENSOR-ROOM').emit('time', new Date().toTimeString());
}, 2000);

// Route handler for the root endpoint
app.get('/', async (req, res) => {
  try {
    // Retrieve data from the tempSensor table along with tempReadings
    const data = await prisma.tempSensor.findMany({
      include: {
        tempReadings: true
      }
    });
    // Send retrieved data as JSON response
    res.json(data);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to perform cleanup tasks when main execution completes
async function main() {
  // Empty function for now
}

// Execute main function and handle cleanup
main()
  .then(async () => {
    // Disconnect from Prisma client
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Log and handle errors
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// Start the server and listen on defined port
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export the Socket.IO server object
module.exports.ioObject = io;
