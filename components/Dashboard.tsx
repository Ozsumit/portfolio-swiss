import React, { useState, useEffect } from "react";
import { storageService } from "../services/storageService";
import { ChatMessage, GalleryItem, Project } from "../types";

const Dashboard: React.FC = () => {
  const [auth, setAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "upload" | "projects" | "inbox" | "settings"
  >("upload");

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  // Settings State
  const [blobToken, setBlobToken] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  // Content State
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [projects, setProjects] = useState<Project[]>([]);

  // Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (auth) {
      loadSettings();
      if (storageService.isConfigured()) {
        refreshData();
        setIsConfigured(true);
      } else {
        setActiveTab("settings");
        setIsConfigured(false);
      }
    }
  }, [auth]);

  const checkAuth = async () => {
    const isAuthenticated = await storageService.isAuthenticated();
    setAuth(isAuthenticated);
    setLoadingAuth(false);
  };

  const loadSettings = () => {
    const config = storageService.getConfig();
    setBlobToken(config.token);
  };

  const refreshData = async () => {
    try {
      setGalleryImages(await storageService.getGallery());
      setMessages(await storageService.getMessages());
      setProjects(await storageService.getProjects());
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await storageService.login(username, password, secret)) {
      setAuth(true);
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    await storageService.logout();
    setAuth(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateConfig(blobToken);
    setIsConfigured(true);
    refreshData();
    alert("Settings saved. Connecting to Vercel Blob...");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    try {
      await storageService.uploadImage(uploadFile, uploadCaption);
      setIsUploading(false);
      setUploadFile(null);
      setUploadCaption("");
      refreshData();
    } catch (e: any) {
      alert(e.message || "Upload failed. Check console and settings.");
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await storageService.deleteImage(id);
      refreshData();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (id) {
      await storageService.deleteMessage(id);
      refreshData();
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-m3-surface flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-swiss-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-m3-surface animate-[fadeIn_0.5s_ease-out]">
        <div className="w-full max-w-md p-8 bg-m3-surface-variant/20 rounded-[2rem] border border-m3-on-surface/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-tight mb-2">
              SYSTEM ACCESS
            </h2>
            <p className="text-xs font-mono text-m3-secondary">
              SWISS SECURE PROTOCOL
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-xl bg-m3-surface border-none focus:ring-2 focus:ring-swiss-red outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-m3-surface border-none focus:ring-2 focus:ring-swiss-red outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                Secret Code
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full p-4 rounded-xl bg-m3-surface border-none focus:ring-2 focus:ring-swiss-red outline-none transition-shadow"
              />
            </div>
            {error && (
              <p className="text-swiss-red text-sm font-bold text-center bg-red-50 py-2 rounded-lg">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-m3-on-surface text-m3-surface font-bold rounded-xl uppercase tracking-widest hover:bg-swiss-red transition-colors duration-300 mt-4"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-m3-surface pt-32 pb-20 px-4 md:px-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-m3-on-surface tracking-tighter">
              DASHBOARD
            </h1>
            <p className="text-m3-secondary font-mono text-sm mt-2 flex items-center gap-2">
              STORAGE: VERCEL BLOB
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-m3-on-surface/20 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-swiss-red hover:text-white hover:border-swiss-red transition-all"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {(["upload", "projects", "inbox", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-m3-on-surface text-m3-surface shadow-lg"
                  : "bg-m3-surface-variant/30 text-m3-on-surface-variant hover:bg-m3-surface-variant hover:text-m3-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-m3-surface-variant/10 rounded-[2.5rem] p-6 md:p-12 border border-m3-on-surface/5 min-h-[500px]">
          {/* UPLOAD TAB */}
          {activeTab === "upload" &&
            (isConfigured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-swiss-red"></span>
                    Upload to Gallery
                  </h3>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="border-2 border-dashed border-m3-on-surface/20 rounded-2xl p-8 text-center hover:border-swiss-red hover:bg-m3-surface-variant/10 transition-colors cursor-pointer relative group h-64 flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setUploadFile(e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="text-4xl mb-4 text-m3-secondary group-hover:scale-110 transition-transform">
                        {uploadFile ? "🖼️" : "☁️"}
                      </div>
                      <p className="text-m3-secondary font-mono text-sm max-w-xs break-words">
                        {uploadFile
                          ? uploadFile.name
                          : "Drag & Drop or Click to Select Image"}
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Image Caption"
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      className="w-full p-4 rounded-xl bg-m3-surface border-none focus:ring-2 focus:ring-swiss-red outline-none shadow-sm"
                    />
                    <button
                      disabled={isUploading || !uploadFile}
                      type="submit"
                      className="w-full py-4 bg-swiss-red text-white rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                    >
                      {isUploading ? "Uploading..." : "Upload Asset"}
                    </button>
                  </form>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-6">Recent Uploads</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {galleryImages.slice(0, 4).map((img) => (
                      <div
                        key={img.id}
                        className="relative group rounded-xl overflow-hidden aspect-square bg-m3-surface-variant/20"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-2 right-2 bg-red-600/90 text-white w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {galleryImages.length === 0 && (
                      <div className="col-span-2 text-center py-12 text-m3-secondary font-mono text-xs">
                        No images in storage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-swiss-red font-bold text-lg mb-4">
                  Storage Not Configured
                </p>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="underline"
                >
                  Go to Settings
                </button>
              </div>
            ))}

          {/* INBOX TAB */}
          {activeTab === "inbox" && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Incoming Messages
              </h3>
              {messages.length === 0 && (
                <div className="text-center py-12 border border-dashed border-m3-on-surface/10 rounded-xl">
                  <p className="text-m3-secondary">Inbox is empty.</p>
                </div>
              )}
              {messages
                .filter((m) => m.role === "user")
                .map((msg) => (
                  <div
                    key={msg.id}
                    className="flex justify-between items-start bg-m3-surface p-6 rounded-2xl border border-m3-on-surface/5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <p className="text-lg font-medium text-m3-on-surface mb-2">
                        "{msg.text}"
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-xs font-mono text-m3-secondary">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                          New
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(msg.id!)}
                      className="text-xs font-bold text-red-500 uppercase hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* PROJECTS TAB (Placeholder) */}
          {activeTab === "projects" && (
            <div className="text-center py-20">
              <div className="max-w-xl mx-auto bg-m3-surface p-6 rounded-2xl opacity-50 select-none border border-m3-on-surface/5">
                <div className="h-4 bg-m3-secondary-container rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-m3-secondary-container rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-m3-secondary-container rounded w-full"></div>
              </div>
              <div className="mt-8">
                <p className="text-m3-secondary font-mono mb-2">
                  Projects Module
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-swiss-red">
                  Under Construction
                </p>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-m3-secondary"></span>
                  Vercel Blob Credentials
                </h3>
                <div className="bg-m3-surface p-8 rounded-2xl border border-m3-on-surface/5">
                  <p className="text-sm text-m3-secondary mb-6 leading-relaxed">
                    Please enter your Vercel Blob Read/Write Token. You can find
                    this in your Vercel Dashboard under Storage.
                  </p>
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                        Blob Read/Write Token
                      </label>
                      <input
                        required
                        type="password"
                        value={blobToken}
                        onChange={(e) => setBlobToken(e.target.value)}
                        className="w-full p-4 rounded-xl bg-m3-surface-variant/30 border-none focus:ring-2 focus:ring-swiss-red outline-none"
                        placeholder="vercel_blob_rw_..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-m3-on-surface text-m3-surface font-bold rounded-xl uppercase tracking-widest hover:bg-swiss-red transition-all"
                    >
                      Save Configuration
                    </button>
                  </form>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-swiss-red"></span>
                  Note
                </h3>
                <div className="bg-m3-surface p-8 rounded-2xl border border-m3-on-surface/5 text-sm text-m3-on-surface-variant leading-relaxed">
                  <p className="mb-4">
                    This application uses a <strong>Client-Side Upload</strong>{" "}
                    pattern suitable for portfolios.
                  </p>
                  <p>
                    Ensure your token has <code>public</code> access scope if
                    you want images to be viewable by everyone.
                  </p>
                  <p className="mt-4 text-xs font-mono text-m3-secondary">
                    The token is stored locally in your browser and is not sent
                    to any third-party server besides Vercel.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
