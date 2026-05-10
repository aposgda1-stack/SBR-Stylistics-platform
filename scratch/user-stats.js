const mongoose = require('mongoose');
const fs = require('fs');

async function run() {
  const uri = "mongodb+srv://ruby:1asdfghjkl2zxcvbnm@cluster0.sluq2ca.mongodb.net/?appName=Cluster0";
  try {
    await mongoose.connect(uri, { dbName: 'test' }); // Standard default is 'test' if not specified
    
    // Define model if not already defined
    const UserSchema = new mongoose.Schema({
      name: String,
      totalPoints: Number,
      email: String
    }, { collection: 'userprogresses' }); // Mongoose plurals are weird sometimes
    
    const User = mongoose.models.UserProgress || mongoose.model('UserProgress', UserSchema);
    
    const count = await User.countDocuments();
    const top = await User.find({ totalPoints: { $gt: 0 } }).sort({ totalPoints: -1 }).limit(10);
    
    const stats = {
      timestamp: new Date().toISOString(),
      totalUsers: count,
      topStudents: top.map((u, i) => ({
        rank: i + 1,
        name: u.name || 'Anonymous',
        points: u.totalPoints
      }))
    };
    
    fs.writeFileSync('scratch/live_user_stats.json', JSON.stringify(stats, null, 2));
    console.log("SUCCESS: Data written to scratch/live_user_stats.json");
    process.exit(0);
  } catch (err) {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  }
}

run();
