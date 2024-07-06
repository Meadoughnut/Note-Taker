const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use the API routes for /api paths
app.use('/api', apiRoutes);

// Use HTML routes
app.use('/', htmlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
