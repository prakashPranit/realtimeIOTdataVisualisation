const axios = require('axios');

// Function to create a sensor
async function createSensor(type, sensorFor, fittedOn) {
  try {
    const response = await axios.post('http://localhost:5000/api/sensors', {
      type,
      sensorFor,
      fittedOn,
    });
    console.log('Sensor created:', response.data);
    return response.data.id; // Return the ID of the created sensor
  } catch (error) {
    console.error('Error creating sensor:', error);
  }
}

// Function to create a temperature reading
async function createTempReading(name, value, time, sensorId) {
  try {
    const response = await axios.post('http://localhost:5000/api/sensors/readings', {
      name,
      value,
      time,
      sensorId,
    });
    console.log('Temperature reading created:', response.data);
  } catch (error) {
    console.error('Error creating temperature reading:', error);
  }
}

// Function to simulate creating temp readings for different sensors in a regular interval
async function createTempReadingsRegularly(sensorIds) {
  const interval = 2000; // 2 seconds interval
  let readingCounter = 0;
  for (const sensorId of sensorIds) {
    setInterval(async () => {
      const name = `${(readingCounter % 24)>12?(readingCounter % 24 +" PM"):(readingCounter % 24)+" AM"}`;
      const value = Math.floor(Math.random() * 400); // Random temperature value for demo
      const time = name.split(" ")[0]+":00";
      await createTempReading(name, value, time, sensorId);
      readingCounter++;
    }, interval);
  }
}

// Main function to start the process
async function main() {
  // Create 3 different sensors for different locations
  const sensorIds = [];
  for (let i = 1; i <= 3; i++) {
    const sensorId = await createSensor(`TMP 0${i}`, `Location ${i}`, '14 May 2024');
    sensorIds.push(sensorId);
  }

  // Create temp readings for the different sensors in a regular interval
  createTempReadingsRegularly(sensorIds);
}

// Call the main function to start the process
main();