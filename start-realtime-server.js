#!/usr/bin/env node

/**
 * Standalone Real-Time WebSocket Server
 * 
 * Starts the WebSocket server on port 3001 for real-time data synchronization
 * Run this script alongside your Next.js development server
 */

// Import the WebSocket server using dynamic import for ES modules
async function importWebSocketServer() {
  try {
    const module = await import('./src/services/realTimeWebSocketServer.ts');
    return module.realTimeWebSocketServer;
  } catch (error) {
    console.error('Failed to import WebSocket server:', error);
    process.exit(1);
  }
}

async function startServer() {
  console.log('🌐 Starting PropIE Real-Time WebSocket Server...');
  console.log('📡 This will enable live updates for:');
  console.log('   • Task assignments and completions');
  console.log('   • Property status and price changes');
  console.log('   • HTB application updates');
  console.log('   • Professional role assignments');
  console.log('   • Cross-stakeholder communications');
  console.log();

  try {
    serverInstance = await importWebSocketServer();
    await serverInstance.start();
    
    console.log('✅ WebSocket server is running!');
    console.log('🔗 Endpoint: ws://localhost:3001/realtime');
    console.log('📊 Connected clients: 0');
    console.log();
    console.log('💡 Start your Next.js dev server now with: npm run dev');
    console.log('🔄 The app will automatically connect to this WebSocket server');
    
  } catch (error) {
    console.error('❌ Failed to start WebSocket server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
let serverInstance = null;

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WebSocket server...');
  try {
    if (serverInstance) {
      await serverInstance.stop();
    }
    console.log('✅ WebSocket server stopped gracefully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  if (serverInstance) {
    await serverInstance.stop();
  }
  process.exit(0);
});

// Start the server
startServer();