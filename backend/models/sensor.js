const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    pulse: { type: Number, required: true },
    spo2: { type: Number, required: true },  // SpO2 sensor reading
    temperature: { type: Number, required: true },  // Temperature sensor reading
}, { timestamps: true });

module.exports = mongoose.model('Sensor', sensorSchema);
