const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    answers: {
        type: [String], // Store answers in order
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Application", applicationSchema);
