import fs from "node:fs/promises";
import path from "node:path";
import { StorageService, StoredObject } from "./index";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
async function ensureDir() { await fs.mkdir(UPLOAD_DIR, { recursive: true }); }

async function putObject({ key, data, contentType }: { key: string; data: Buffer; contentType: string }): Promise<StoredObject> {
  await ensureDir();
  const filePath = path.join(UPLOAD_DIR, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, data);
  const publicUrl = `/uploads/${key}`.replace(/\\/g, "/");
  return { storageKey: key, publicUrl };
}

async function deleteObject({ key }: { key: string }) {
  const filePath = path.join(UPLOAD_DIR, key);
  try { await fs.unlink(filePath); } catch {}
}

export const localStorageService: StorageService = { putObject, deleteObject };

