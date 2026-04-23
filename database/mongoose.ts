import mongoose from 'mongoose';

// Getting the MongoDB connection string from environment variables (.env.local)
const MONGODB_URI = process.env.MONGODB_URI;

// If MONGODB_URI is not defined, throw an error immediately — fail fast
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

// Telling TypeScript that `mongooseCache` exists on the global object
// Without this, TypeScript would complain: "Property mongooseCache does not exist on global"
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null    // stores the active mongoose connection
        promise: Promise<typeof mongoose> | null  // stores the pending connection promise
    }
}

// Use existing global cache if it exists, otherwise create a fresh one
// This is the key to preventing multiple connections in Next.js hot reloads
let cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

export const connectToDatabase = async () => {

    // If we already have an active connection, return it immediately
    // No need to connect again — this is the caching benefit
    if (cached.conn) return cached.conn;

    // If no connection is in progress, start a new one
    // bufferCommands: false — don't queue mongoose commands if not connected, fail immediately instead
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        // Wait for the connection promise to resolve and store the connection
        cached.conn = await cached.promise;
    } catch (e) {
        // If connection fails, reset the promise so next call tries again fresh
        cached.promise = null;
        console.error('MongoDB connection error. Please make sure MongoDB is running. ' + e);
        throw e; // rethrow so the calling function knows the connection failed
    }

    console.info('Connected to MongoDB');

    // Return the active connection for use in models/queries
    return cached.conn;
}
