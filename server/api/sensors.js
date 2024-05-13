// Import required modules and libraries
const { Router } = require('express');
const prisma = require("../prisma/client");
const socketIOserver = require("../index");

// Create a router for handling requests related to sensors
const sensorsRouter = Router();

// Route handler for GET requests to retrieve sensor data
sensorsRouter.get('/', async (req, res) => {
    try {
        // Retrieve sensor data with recent temperature readings
        const data = await prisma.tempSensor.findMany({
            include: {
                tempReadings: {
                    take: 12, // Limit to 12 most recent readings
                    orderBy: {
                        published: 'desc' // Order by publication date in descending order
                    }
                }
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

// Route handler for POST requests to create a new sensor
sensorsRouter.post('/', async (req, res) => {
    try {
        // Extract necessary data from request body
        const { type, fittedOn, sensorFor } = req.body;

        // Create a new sensor entry in the database
        const data = await prisma.tempSensor.create({
            data: {
                type: type,
                fittedOn: fittedOn,
                sensorFor: sensorFor
            }
        });

        // Send the created sensor data as JSON response
        res.json(data);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route handler for POST requests to create a new sensor reading
sensorsRouter.post('/readings', async (req, res) => {
    try {
        // Extract necessary data from request body
        const { name, value, time, sensorId } = req.body;

        // Create a new sensor reading entry in the database
        const data = await prisma.temperatureReadings.create({
            data: {
                name: name,
                value: value,
                time: time,
                sensorId: sensorId
            },
        });

        // Emit a socket.io event to inform clients about the new reading
        socketIOserver.ioObject.to('TEMP-SENSOR-ROOM').emit('reading', { newRedaing: "Reading Updated", data: data });

        // Send the created sensor reading data as JSON response
        res.json(data);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route handler for DELETE requests (Placeholder)
sensorsRouter.delete('/', (req, res) => res.send('Got a DELETE request at /api/sensors'));

// Export the sensors router for use in other modules
module.exports = {
    sensorsRouter,
};
