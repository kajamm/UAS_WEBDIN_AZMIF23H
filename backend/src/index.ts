import 'dotenv/config';
import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📌 Environment: ${env.NODE_ENV}`);
  console.log(`📅 ${new Date().toLocaleString('id-ID')}\n`);
});
