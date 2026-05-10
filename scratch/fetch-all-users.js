const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function getFullUserStats() {
    const uri = "mongodb+srv://ruby:1asdfghjkl2zxcvbnm@cluster0.sluq2ca.mongodb.net/test?retryWrites=true&w=majority";
    
    try {
        await mongoose.connect(uri);
        
        // Dynamic Model Definition
        const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', new mongoose.Schema({}, { strict: false, collection: 'userprogresses' }));
        
        const users = await UserProgress.find({}).sort({ totalPoints: -1 });
        
        const report = {
            generationTime: new Date().toLocaleString(),
            totalUsers: users.length,
            users: users.map(u => ({
                name: u.toObject().name || "Anonymous",
                email: u.toObject().email || "N/A",
                points: u.toObject().totalPoints || 0,
                solved: u.toObject().questionsSolved || 0,
                lastSeen: u.toObject().updatedAt || "Unknown"
            }))
        };

        const reportPath = path.join(process.cwd(), 'user_database_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 4));
        console.log(`Successfully generated report for ${users.length} users.`);
        process.exit(0);
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

getFullUserStats();
