// Simple file-backed database for the MVP.
// For production, swap this out for MongoDB (models/*.js are already
// shaped like Mongoose schemas so the migration is mostly a find/replace).
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import fs from "fs";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localFile = path.join(__dirname, "db.json");

let file = localFile;
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpFile = path.join(os.tmpdir(), "db.json");
  if (!fs.existsSync(tmpFile) && fs.existsSync(localFile)) {
    try {
      fs.copyFileSync(localFile, tmpFile);
    } catch (e) {
      console.warn("Could not copy initial db.json to /tmp:", e);
    }
  }
  file = tmpFile;
}

const defaultData = { users: [], letters: [] };
const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDB() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
}
