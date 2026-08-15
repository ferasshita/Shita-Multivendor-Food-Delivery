import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import config from './config';
import database from './config/database';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { authenticate, AuthContext } from './middleware/auth';

// Initialize Apollo Server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();

    // Create Apollo Server
    const server = new ApolloServer<AuthContext>({
      typeDefs,
      resolvers,
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          path: error.path,
        };
      },
    });

    // Start standalone server
    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const authContext = await authenticate(token);
        return authContext;
      },
      listen: { port: config.port },
    });

    console.log(`🚀 Server ready at ${url}`);
    console.log(`📊 GraphQL endpoint: ${url}graphql`);
    console.log(`🌍 Environment: ${config.env}`);

    // Graceful shutdown
    const shutdown = async () => {
      console.log('\n⏳ Shutting down gracefully...');
      await server.stop();
      await database.disconnect();
      console.log('✅ Server closed');
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
