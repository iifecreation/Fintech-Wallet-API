import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT;

console.log("hello");


(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
