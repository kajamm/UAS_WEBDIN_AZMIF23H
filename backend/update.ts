import { execute } from './src/config/db';

async function updatePassword() {
  try {
    const hash = '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy';
    await execute('UPDATE users SET password = ?', [hash]);
    console.log('Database updated successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updatePassword();
