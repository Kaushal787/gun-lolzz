export type StoredObject = { storageKey: string; publicUrl: string; thumbUrl?: string };
export interface StorageService {
  putObject(params: { key: string; data: Buffer; contentType: string }): Promise<StoredObject>;
  deleteObject(params: { key: string }): Promise<void>;
}

export function getStorage(): StorageService {
  const driver = process.env.STORAGE_DRIVER || "local";
  if (driver === "local") return require("./local").localStorageService;
  throw new Error(`Unsupported storage driver: ${driver}`);
}

