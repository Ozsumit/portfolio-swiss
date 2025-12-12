import { GalleryItem, ChatMessage, Project } from "../types";
import { PROJECTS as INITIAL_PROJECTS } from "../data";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// --- ENVIRONMENT SAFEGUARDS ---
const getEnv = (key: string, defaultValue: string = ""): string => {
  try {
    // @ts-ignore
    if (typeof process !== "undefined" && process.env) {
      // @ts-ignore
      return process.env[key] || defaultValue;
    }
  } catch (e) {
    // Ignore
  }
  return defaultValue;
};

// --- BACKBLAZE B2 (S3 COMPATIBLE) CONFIG ---
// NOTE: In a production frontend environment, exposing these keys in the bundle is a security risk.
// Ensure this application is protected or that these keys have restricted permissions (e.g., limited to this bucket).
const BUCKET_NAME = getEnv("B2_BUCKET_NAME");
const REGION = getEnv("B2_REGION", "us-east-005");
const ENDPOINT = getEnv("B2_ENDPOINT", `https://s3.${REGION}.backblazeb2.com`);

const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: getEnv("B2_ACCESS_KEY_ID"),
    secretAccessKey: getEnv("B2_SECRET_ACCESS_KEY"),
  },
});

const KEYS = {
  GALLERY_META: "data/gallery_metadata.json",
  MESSAGES: "data/messages_inbox.json",
  PROJECTS: "data/projects_data.json",
  AUTH_SESSION: "swiss_portfolio_auth", // LocalStorage key
};

// --- CREDENTIALS (ADMIN) ---
const ADMIN_USER = getEnv("ADMIN_USER", "admin");
const ADMIN_PASS = getEnv("ADMIN_PASSWORD", "password");
const ADMIN_SECRET = getEnv("ADMIN_SECRET", "swiss123");

// --- HELPER: READ/WRITE JSON TO B2 ---

const getJSON = async <T>(key: string): Promise<T | null> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const response = await s3Client.send(command);
    if (!response.Body) return null;

    const str = await response.Body.transformToString();
    return JSON.parse(str);
  } catch (error: any) {
    if (error.name === "NoSuchKey") return null;
    console.error(`Error fetching ${key} from B2:`, error);
    return null;
  }
};

const saveJSON = async (key: string, data: any): Promise<void> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    });
    await s3Client.send(command);
  } catch (error) {
    console.error(`Error saving ${key} to B2:`, error);
    throw error;
  }
};

export const storageService = {
  // --- AUTHENTICATION ---
  // Uses LocalStorage for session persistence to avoid unnecessary B2 calls
  login: async (user: string, pass: string, code: string): Promise<boolean> => {
    if (user === "comsic" && pass === "comsic123" && code === "200621") {
      const session = { token: "valid_session", timestamp: Date.now() };
      localStorage.setItem(KEYS.AUTH_SESSION, JSON.stringify(session));
      return true;
    }
    return false;
  },

  isAuthenticated: async (): Promise<boolean> => {
    const sessionStr = localStorage.getItem(KEYS.AUTH_SESSION);
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
    localStorage.removeItem(KEYS.AUTH_SESSION);
  },

  // --- GALLERY (B2 Private Bucket) ---

  getGallery: async (): Promise<GalleryItem[]> => {
    // 1. Fetch Metadata JSON
    const meta = await getJSON<GalleryItem[]>(KEYS.GALLERY_META);
    if (!meta) return [];

    // 2. Generate Signed URLs for each item
    // Since the bucket is private, we cannot just use the public URL.
    const itemsWithUrls = await Promise.all(
      meta.map(async (item) => {
        try {
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `images/${item.id}`,
          });
          // Generate a URL valid for 1 hour
          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          return { ...item, url: signedUrl };
        } catch (e) {
          console.error(`Failed to sign URL for image ${item.id}`, e);
          return item;
        }
      })
    );

    return itemsWithUrls;
  },

  uploadImage: async (file: File, caption: string): Promise<GalleryItem> => {
    const id = Math.random().toString(36).substring(7);
    const key = `images/${id}`;

    // 1. Upload Binary to B2
    try {
      const uploadCmd = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: file.type,
      });
      await s3Client.send(uploadCmd);
    } catch (e) {
      console.error("Upload failed", e);
      throw new Error("Failed to upload image to B2");
    }

    // 2. Update Metadata JSON
    const currentMeta = (await getJSON<GalleryItem[]>(KEYS.GALLERY_META)) || [];
    const newItem: GalleryItem = {
      id,
      url: "", // URL is dynamic (signed)
      caption,
      date: new Date().toISOString(),
    };

    const updatedMeta = [newItem, ...currentMeta];
    await saveJSON(KEYS.GALLERY_META, updatedMeta);

    // Return item with a temporary object URL for immediate display
    // (saves a roundtrip to generate signed URL)
    return { ...newItem, url: URL.createObjectURL(file) };
  },

  deleteImage: async (id: string) => {
    // 1. Delete Binary
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `images/${id}`,
        })
      );
    } catch (e) {
      console.error("Delete object failed", e);
    }

    // 2. Update Metadata
    const currentMeta = (await getJSON<GalleryItem[]>(KEYS.GALLERY_META)) || [];
    const updatedMeta = currentMeta.filter(
      (item: GalleryItem) => item.id !== id
    );
    await saveJSON(KEYS.GALLERY_META, updatedMeta);
  },

  // --- PROJECTS ---
  getProjects: async (): Promise<Project[]> => {
    const data = await getJSON<Project[]>(KEYS.PROJECTS);
    return data || INITIAL_PROJECTS;
  },

  addProject: async (project: Project) => {
    const current = await storageService.getProjects();
    const updated = [...current, project];
    await saveJSON(KEYS.PROJECTS, updated);
  },

  // --- MESSAGES ---
  saveMessage: async (msg: ChatMessage) => {
    const current = (await getJSON<ChatMessage[]>(KEYS.MESSAGES)) || [];
    const newMsg = {
      ...msg,
      id: Math.random().toString(36).substring(7),
      read: false,
    };
    const updated = [newMsg, ...current];
    await saveJSON(KEYS.MESSAGES, updated);
  },

  getMessages: async (): Promise<ChatMessage[]> => {
    const data = await getJSON<ChatMessage[]>(KEYS.MESSAGES);
    return data || [];
  },

  deleteMessage: async (id: string) => {
    const current = await storageService.getMessages();
    const updated = current.filter((m) => m.id !== id);
    await saveJSON(KEYS.MESSAGES, updated);
  },
};
