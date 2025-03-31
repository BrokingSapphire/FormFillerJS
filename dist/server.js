// src/server.ts
import app from './app.js';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Get port from environment or use default
const PORT = process.env.PORT || 3000;
// Create HTTP server from the Express app
const server = app.listen(PORT, () => {
    console.log(`🚀 FormFillerJS server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API documentation: http://localhost:${PORT}/api/pdf/templates (if configured)`);
    console.log('Press Ctrl+C to stop the server');
});
// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed successfully');
        process.exit(0);
    });
});
// Keep the event loop active
process.stdin.resume();
// Export the server for testing purposes
export default server;
//# sourceMappingURL=server.js.map