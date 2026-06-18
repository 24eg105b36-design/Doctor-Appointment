const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    let mongoUri = process.env.MONGO_URI;
    
    // Check if it is standard default template URI
    const isPlaceholder = !mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>');

    if (isPlaceholder) {
        console.log('MONGO_URI is a placeholder. Falling back to MongoMemoryServer...');
        try {
            mongoServer = await MongoMemoryServer.create();
            mongoUri = mongoServer.getUri();
            console.log(`In-memory MongoDB started at: ${mongoUri}`);
        } catch (err) {
            console.error(`Failed to start MongoMemoryServer: ${err.message}`);
            process.exit(1);
        }
    }

    try {
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Primary connection failed to ${mongoUri}: ${error.message}`);
        
        // If we didn't already start MongoMemoryServer, let's try it as a fallback
        if (!mongoServer) {
            console.log('Attempting connection to In-memory MongoDB...');
            try {
                mongoServer = await MongoMemoryServer.create();
                const fallbackUri = mongoServer.getUri();
                console.log(`In-memory MongoDB started at: ${fallbackUri}`);
                
                const conn = await mongoose.connect(fallbackUri);
                console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
                return;
            } catch (err) {
                console.error(`Failed to start/connect MongoMemoryServer: ${err.message}`);
            }
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;
