import { GalleryItem, ChatMessage, Project } from "../types";
import { PROJECTS as INITIAL_PROJECTS } from "../data";
import { put, list, del } from "@vercel/blob";

// --- ENVIRONMENT SAFEGUARDS ---
const getEnv = (key: string): string | null => {
  try {
    // @ts-ignore
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      // @ts-ignore
      return process.env[key];
    }
  } catch (e) {
    // Ignore
  }
  return null;
};

// --- CONFIGURATION KEYS ---
const LS_KEYS = {
  VERCEL_BLOB_TOKEN: "swiss_vercel_blob_token",
  AUTH_SESSION: "swiss_portfolio_auth",
};

const DATA_KEYS = {
  GALLERY_META: "data/gallery_metadata.json",
  MESSAGES: "data/messages_inbox.json",
  PROJECTS: "data/projects_data.json",
};

// --- STATE ---
let blobToken: string | null = null;

// --- INITIALIZATION ---
const initClient = () => {
  blobToken =
    getEnv("BLOB_READ_WRITE_TOKEN") ||
    localStorage.getItem(LS_KEYS.VERCEL_BLOB_TOKEN);
  if (blobToken) {
    console.log("Storage Service: Vercel Blob Token Initialized");
  }
};

// Initialize on load
initClient();

// --- CREDENTIALS (ADMIN) ---
const ADMIN_USER = getEnv("ADMIN_USER") || "admin";
const ADMIN_PASS = getEnv("ADMIN_PASSWORD") || "password";
const ADMIN_SECRET = getEnv("ADMIN_SECRET") || "swiss123";

// --- HELPER: READ/WRITE JSON TO BLOB ---

/**
 * Gets a JSON file from Vercel Blob.
 * Since Blob URLs are immutable, we look up the file by path suffix or store the URL.
 * However, Vercel Blob's `put` with `addRandomSuffix: false` allows us to maintain a consistent URL
 * if the filename is unique to the store.
 * Actually, `list` is safer to find the blob object.
 */
const getJSON = async <T>(key: string): Promise<T | null> => {
  if (!blobToken) return null;

  try {
    // 1. List blobs to find the file
    // Note: Vercel Blob list is eventually consistent, but usually fast enough.
    const { blobs } = await list({
      token: blobToken,
      limit: 1000,
      prefix: key,
    });

    // Find exact match
    const file = blobs.find((b) => b.pathname === key);

    if (!file) return null;

    // 2. Fetch content
    // We add a timestamp query to bypass browser caching of the JSON file
    const response = await fetch(`${file.url}?t=${Date.now()}`);
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${key} from Blob:`, error);
    return null;
  }
};

const saveJSON = async (key: string, data: any): Promise<void> => {
  if (!blobToken) throw new Error("Storage not configured");

  try {
    // Overwrite the file at the specific path
    await put(key, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false, // CRITICAL: This allows us to treat it like a database file at a fixed path
      token: blobToken,
      contentType: "application/json",
    });
  } catch (error) {
    console.error(`Error saving ${key} to Blob:`, error);
    throw error;
  }
};

export const storageService = {
  // --- CONFIGURATION ---
  isConfigured: (): boolean => {
    return blobToken !== null && blobToken.length > 0;
  },

  updateConfig: (token: string) => {
    localStorage.setItem(LS_KEYS.VERCEL_BLOB_TOKEN, token);
    initClient();
  },

  getConfig: () => {
    return {
      token: localStorage.getItem(LS_KEYS.VERCEL_BLOB_TOKEN) || "",
    };
  },

  // --- AUTHENTICATION ---
  login: async (user: string, pass: string, code: string): Promise<boolean> => {
    if (user === ADMIN_USER && pass === ADMIN_PASS && code === ADMIN_SECRET) {
      const session = { token: "valid_session", timestamp: Date.now() };
      localStorage.setItem(LS_KEYS.AUTH_SESSION, JSON.stringify(session));
      return true;
    }
    return false;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const sessionStr = localStorage.getItem(LS_KEYS.AUTH_SESSION);
    if (!sessionStr) return false;

    try {
      const session = JSON.parse(sessionStr);
      // Valid for 24 hours
      if (Date.now() - session.timestamp < 86400000) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  },

  logout: async () => {
    localStorage.removeItem(LS_KEYS.AUTH_SESSION);
  },

  // --- GALLERY ---

  getGallery: async (): Promise<GalleryItem[]> => {
    if (!blobToken) return [];
    const meta = await getJSON<GalleryItem[]>(DATA_KEYS.GALLERY_META);
    return meta || [];
  },

  uploadImage: async (file: File, caption: string): Promise<GalleryItem> => {
    if (!blobToken) throw new Error("Storage not configured");

    const id = Math.random().toString(36).substring(7);
    const filename = `images/${id}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    // 1. Upload Binary to Blob
    let blobUrl = "";
    try {
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false, // Keep clean filenames
        token: blobToken,
      });
      blobUrl = blob.url;
    } catch (e) {
      console.error("Upload failed", e);
      throw new Error("Failed to upload image to Vercel Blob");
    }

    // 2. Update Metadata JSON
    const currentMeta =
      (await getJSON<GalleryItem[]>(DATA_KEYS.GALLERY_META)) || [];
    const newItem: GalleryItem = {
      id,
      url: blobUrl,
      caption,
      date: new Date().toISOString(),
    };

    const updatedMeta = [newItem, ...currentMeta];
    await saveJSON(DATA_KEYS.GALLERY_META, updatedMeta);

    return newItem;
  },

  deleteImage: async (id: string) => {
    if (!blobToken) return;

    // 1. Need to find the blob URL to delete it, or delete by URL if we had it.
    // Since we store metadata, we should look it up there first.
    const currentMeta =
      (await getJSON<GalleryItem[]>(DATA_KEYS.GALLERY_META)) || [];
    const itemToDelete = currentMeta.find((item) => item.id === id);

    if (itemToDelete) {
      try {
        // Vercel Blob `del` accepts the URL
        await del(itemToDelete.url, { token: blobToken });
      } catch (e) {
        console.error("Delete blob failed", e);
      }
    }

    // 2. Update Metadata
    const updatedMeta = currentMeta.filter(
      (item: GalleryItem) => item.id !== id
    );
    await saveJSON(DATA_KEYS.GALLERY_META, updatedMeta);
  },

  // --- PROJECTS ---
  getProjects: async (): Promise<Project[]> => {
    const data = await getJSON<Project[]>(DATA_KEYS.PROJECTS);
    return data || INITIAL_PROJECTS;
  },

  addProject: async (project: Project) => {
    const current = await storageService.getProjects();
    const updated = [...current, project];
    await saveJSON(DATA_KEYS.PROJECTS, updated);
  },

  // --- MESSAGES ---
  saveMessage: async (msg: ChatMessage) => {
    if (!blobToken) return;
    const current = (await getJSON<ChatMessage[]>(DATA_KEYS.MESSAGES)) || [];
    const newMsg = {
      ...msg,
      id: Math.random().toString(36).substring(7),
      read: false,
    };
    const updated = [newMsg, ...current];
    await saveJSON(DATA_KEYS.MESSAGES, updated);
  },

  getMessages: async (): Promise<ChatMessage[]> => {
    const data = await getJSON<ChatMessage[]>(DATA_KEYS.MESSAGES);
    return data || [];
  },

  deleteMessage: async (id: string) => {
    const current = await storageService.getMessages();
    const updated = current.filter((m) => m.id !== id);
    await saveJSON(DATA_KEYS.MESSAGES, updated);
  },
};
