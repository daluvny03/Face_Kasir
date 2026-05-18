import app from './app.js';
import pool from './config/db.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });