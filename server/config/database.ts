import mongoose from 'mongoose';

export type PersistenceMode = 'mongodb' | 'local-json';

let currentMode: PersistenceMode = 'local-json';

export async function connectDatabase(): Promise<PersistenceMode> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    currentMode = 'local-json';
    console.info('[Database] MONGODB_URI not configured; running with seeded local JSON persistence.');
    return currentMode;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    currentMode = 'mongodb';
    console.info('[Database] Connected to MongoDB via Mongoose.');
    return currentMode;
  } catch (err) {
    currentMode = 'local-json';
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.warn(`[Database] MongoDB connection unavailable (${message}); activating local JSON persistence fallback.`);
    return currentMode;
  }
}

export function getPersistenceMode(): PersistenceMode {
  return currentMode;
}
