// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import pdfRoutes from './routes/pdfRoutes.js';
const app = express();
// Middleware
app.use(bodyParser.json());
// Routes
app.use('/api/pdf', pdfRoutes);
// Basic route
app.get('/', (_req, res) => {
    res.send('PDF Filler API is running');
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});
export default app;
//# sourceMappingURL=app.js.map