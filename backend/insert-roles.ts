import { execute } from './src/config/db';

async function insertRoles() {
  try {
    const hash = '$2b$10$cvTRS500MH3wwF.VsUjWj.6.4LYMnVJMy462nMC7didCymchGnwpy';
    await execute("INSERT IGNORE INTO users (nama, email, password, role) VALUES ('Operator', 'operator@webdin.com', ?, 'operator')", [hash]);
    await execute("INSERT IGNORE INTO users (nama, email, password, role) VALUES ('Tamu Viewer', 'viewer@webdin.com', ?, 'viewer')", [hash]);
    console.log('Inserted Operator and Viewer');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

insertRoles();
