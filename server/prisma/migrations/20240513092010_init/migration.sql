-- CreateTable
CREATE TABLE "TemperatureReadings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "published" DATETIME NOT NULL,
    "time" TEXT,
    "sensorId" INTEGER NOT NULL,
    CONSTRAINT "TemperatureReadings_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "TempSensor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TempSensor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "sensorFor" TEXT,
    "fittedOn" TEXT
);
