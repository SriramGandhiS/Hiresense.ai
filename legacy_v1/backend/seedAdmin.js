require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hiresense";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB");

    const adminEmail = "admin@hiresense.ai";
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
        console.log("Admin already exists. Credentials logic unchanged.");
        process.exit(0);
    }

    await User.create({
        name: "System Admin",
        email: adminEmail,
        password: "adminpassword123",
        role: "admin"
    });

    console.log("Admin user created successfully!");
    process.exit(0);
}).catch(err => {
    console.log(err);
    process.exit(1);
});
