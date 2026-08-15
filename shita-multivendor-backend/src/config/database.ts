import mongoose from 'mongoose';
import config from './index';

class Database {
  private static instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const options: mongoose.ConnectOptions = {
        dbName: config.mongodb.dbName,
        ...(config.mongodb.user && config.mongodb.password && {
          auth: {
            username: config.mongodb.user,
            password: config.mongodb.password,
          },
        }),
      };

      await mongoose.connect(config.mongodb.uri, options);

      mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
      });

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.connection.close();
  }
}

export default Database.getInstance();
