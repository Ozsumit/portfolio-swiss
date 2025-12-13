import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import {
  Upload,
  Loader2,
  Check,
  X,
  Trash2,
  Edit2,
  Grid3X3,
  LogOut,
  Plus,
  Save,
  User,
  Lock,
  Key,
  Briefcase,
  Image as ImageIcon,
  LayoutTemplate,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "../types";

// --- Types ---
type ImageItem = { id: number; title: string; url: string; created_at: string };
type ToastType = { id: string; message: string; type: "success" | "error" };

// --- Main Entry ---
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("admin_session");
    if (session === "authenticated") setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated)
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;

  return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />;
}

// --- 1. Login Screen (Polished) ---
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [formData, setFormData] = useState({ user: "", pass: "", key: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      const envUser = import.meta.env.VITE_ADMIN_USER;
      const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
      const envKey = import.meta.env.VITE_ADMIN_KEY;

      if (
        formData.user === envUser &&
        formData.pass === envPass &&
        formData.key === envKey
      ) {
        sessionStorage.setItem("admin_session", "authenticated");
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        setTimeout(() => setError(false), 2000);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FF3B30] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1C1B1F] border border-white/10 w-full max-w-md rounded-[2rem] p-8 md:p-12 shadow-2xl relative z-10"
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-[#FF3B30] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-900/20">
            <LayoutTemplate className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            ADMIN CONSOLE
          </h1>
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-2">
            Secure Gateway
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <LoginInput
            icon={<User size={18} />}
            placeholder="USERNAME"
            type="text"
            value={formData.user}
            onChange={(v) => setFormData({ ...formData, user: v })}
          />
          <LoginInput
            icon={<Lock size={18} />}
            placeholder="PASSWORD"
            type="password"
            value={formData.pass}
            onChange={(v) => setFormData({ ...formData, pass: v })}
          />
          <LoginInput
            icon={<Key size={18} />}
            placeholder="SECURITY KEY"
            type="password"
            value={formData.key}
            onChange={(v) => setFormData({ ...formData, key: v })}
          />

          <div className="h-6 flex items-center justify-center">
            {error && (
              <span className="text-[#FF3B30] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={12} /> Invalid Credentials
              </span>
            )}
          </div>

          <button
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#FF3B30] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2 uppercase tracking-widest text-sm shadow-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Enter Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

const LoginInput = ({ icon, placeholder, type, value, onChange }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF3B30] transition-colors">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#2A2A2A] text-white border-none py-4 pl-12 pr-6 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#FF3B30] outline-none placeholder:text-gray-600 transition-all"
    />
  </div>
);

// --- 2. Dashboard Layout (With Toasts & Stats) ---
function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"projects" | "gallery">(
    "projects"
  );
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [stats, setStats] = useState({ projects: 0, images: 0 });

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000
    );
  };

  return (
    <main className="min-h-screen pt-20 bg-[#F8F7F5] text-[#1C1B1F] font-sans selection:bg-[#FF3B30] selection:text-white">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#F8F7F5]/80 backdrop-blur-xl border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-10 h-10 bg-[#1C1B1F] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Grid3X3 size={20} />
            </div>
            <div className="flex-1 md:flex-none">
              <h2 className="font-bold text-lg leading-none tracking-tight">
                DASHBOARD
              </h2>
              <div className="flex gap-3 text-[10px] font-mono uppercase text-gray-400 mt-1">
                <span>Proj: {stats.projects}</span>
                <span className="text-gray-300">|</span>
                <span>Img: {stats.images}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm w-full md:w-auto">
            {["projects", "gallery"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-[#FF3B30] text-white shadow-md"
                    : "text-gray-400 hover:text-[#1C1B1F] hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={onLogout}
            className="hidden md:flex p-3 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-[#FF3B30]"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "projects" ? (
              <ProjectsManager
                addToast={addToast}
                updateStats={(n) => setStats((s) => ({ ...s, projects: n }))}
              />
            ) : (
              <GalleryManager
                addToast={addToast}
                updateStats={(n) => setStats((s) => ({ ...s, images: n }))}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------
// 3. PROJECTS MANAGER
// ----------------------------------------------------------------------
function ProjectsManager({
  addToast,
  updateStats,
}: {
  addToast: (m: string, t: any) => void;
  updateStats: (n: number) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    const list = (data as Project[]) || [];
    setProjects(list);
    updateStats(list.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <motion.div
              layoutId={`proj-${p.id}`}
              key={p.id}
              onClick={() => setEditingProject(p)}
              className="group relative cursor-pointer bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#FF3B30]/20"
            >
              <div className="aspect-[16/10] w-full rounded-[1.5rem] overflow-hidden bg-gray-100 mb-4 relative">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                  <Edit2 size={14} className="text-[#FF3B30]" />
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF3B30] block mb-1">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-xl leading-tight text-[#1C1B1F]">
                      {p.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-gray-300 group-hover:text-[#1C1B1F] transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-400 font-mono mt-2">
                  {p.year} — {p.client}
                </p>
              </div>
            </motion.div>
          ))}
          {/* Add New Card (Inline option) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setIsCreateOpen(true)}
            className="min-h-[300px] flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#FF3B30] hover:text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center">
              <Plus size={32} />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest">
              Add New Case
            </span>
          </motion.button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {(isCreateOpen || editingProject) && (
          <ProjectFormModal
            project={editingProject}
            onClose={() => {
              setIsCreateOpen(false);
              setEditingProject(null);
            }}
            onRefresh={fetchProjects}
            addToast={addToast}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- 4. Project Form Modal (Enhanced) ---
function ProjectFormModal({
  project,
  onClose,
  onRefresh,
  addToast,
}: {
  project: Project | null;
  onClose: () => void;
  onRefresh: () => void;
  addToast: any;
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // State
  const [formData, setFormData] = useState({
    title: project?.title || "",
    client: project?.client || "",
    year: project?.year || new Date().getFullYear().toString(),
    role: project?.role || "",
    category: project?.category || "",
    description: project?.description || "",
    challenge: project?.challenge || "",
    solution: project?.solution || "",
    link: project?.link || "",
  });

  // Tags Logic
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const handleTagKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) setTags([...tags, val]);
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  // Image Logic
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(project?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setImageFile(e.dataTransfer.files[0]);
      setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = project?.image;

      if (imageFile) {
        const parts = imageFile.name.split(".");
        const ext = parts.pop();
        const fileName = `${Date.now()}-${parts
          .join("")
          .replace(/[^a-z0-9]/gi, "")}.${ext}`;
        const { error } = await supabase.storage
          .from("portfolio")
          .upload(fileName, imageFile);
        if (error) throw error;
        const { data } = supabase.storage
          .from("portfolio")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...formData, tags, image: imageUrl };

      if (project?.id)
        await supabase.from("projects").update(payload).eq("id", project.id);
      else await supabase.from("projects").insert([payload]);

      addToast(
        project
          ? "Project updated successfully"
          : "Project created successfully",
        "success"
      );
      onRefresh();
      onClose();
    } catch (e) {
      console.error(e);
      addToast("Error saving project", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await supabase.from("projects").delete().eq("id", project!.id);
    addToast("Project deleted", "success");
    onRefresh();
    onClose();
  };

  if (showConfirmDelete) {
    return (
      <ConfirmModal
        title="Delete Project?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        loading={loading}
      />
    );
  }

  return (
    <ModalLayout
      title={project ? "EDIT PROJECT" : "NEW PROJECT"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Drag & Drop Image Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative group w-full aspect-[21/9] bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all cursor-pointer flex flex-col items-center justify-center"
        >
          {preview ? (
            <>
              <img
                src={preview}
                className="w-full h-full object-cover opacity-100 group-hover:opacity-40 transition-opacity"
                alt="Preview"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-xs uppercase shadow-sm">
                  Change Image
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-6 text-gray-400 group-hover:text-[#FF3B30] transition-colors">
              <ImageIcon className="mx-auto mb-3" size={32} />
              <span className="text-xs font-bold uppercase tracking-widest block">
                Drag & Drop Image
              </span>
              <span className="text-[10px] opacity-60">or click to browse</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(v) => setFormData({ ...formData, title: v })}
            required
            autoFocus
          />
          <Input
            label="Client"
            value={formData.client}
            onChange={(v) => setFormData({ ...formData, client: v })}
          />
          <Input
            label="Role"
            value={formData.role}
            onChange={(v) => setFormData({ ...formData, role: v })}
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(v) => setFormData({ ...formData, category: v })}
          />
          <Input
            label="Year"
            value={formData.year}
            onChange={(v) => setFormData({ ...formData, year: v })}
          />
          <Input
            label="Live Link"
            value={formData.link}
            onChange={(v) => setFormData({ ...formData, link: v })}
          />
        </div>

        {/* Smart Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 ml-1">
            Tags (Type & Enter)
          </label>
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-transparent focus-within:border-[#FF3B30] focus-within:bg-white transition-all">
            {tags.map((t) => (
              <span
                key={t}
                onClick={() => removeTag(t)}
                className="bg-[#1C1B1F] text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-[#FF3B30] transition-colors flex items-center gap-1"
              >
                {t} <X size={10} />
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder={tags.length === 0 ? "Next.js, Design..." : ""}
              className="bg-transparent outline-none text-sm font-medium flex-1 min-w-[100px]"
            />
          </div>
        </div>

        <TextArea
          label="Short Description"
          value={formData.description}
          onChange={(v) => setFormData({ ...formData, description: v })}
          rows={3}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea
            label="The Challenge"
            value={formData.challenge}
            onChange={(v) => setFormData({ ...formData, challenge: v })}
            rows={4}
          />
          <TextArea
            label="The Solution"
            value={formData.solution}
            onChange={(v) => setFormData({ ...formData, solution: v })}
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-100">
          {project && (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="px-6 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1C1B1F] text-white py-4 rounded-xl font-bold hover:bg-[#FF3B30] transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} />{" "}
                {project ? "SAVE CHANGES" : "PUBLISH PROJECT"}
              </>
            )}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}

// ----------------------------------------------------------------------
// 5. GALLERY MANAGER & UTILS
// ----------------------------------------------------------------------
function GalleryManager({
  addToast,
  updateStats,
}: {
  addToast: any;
  updateStats: any;
}) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ImageItem | null>(null);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("images")
      .select("*")
      .order("created_at", { ascending: false });
    const list = data || [];
    setImages(list);
    updateStats(list.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <>
      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <motion.div
              layoutId={`card-${img.id}`}
              key={img.id}
              onClick={() => setEditingItem(img)}
              whileHover={{ y: -4 }}
              className="group relative cursor-pointer bg-white p-2 rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="aspect-square rounded-[1.2rem] overflow-hidden bg-gray-100 mb-3 relative">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <Edit2 size={12} />
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-bold text-sm truncate">{img.title}</h3>
              </div>
            </motion.div>
          ))}
          <motion.button
            onClick={() => setIsUploadOpen(true)}
            className="aspect-square rounded-[1.5rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF3B30] hover:text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all gap-2"
          >
            <Plus size={24} />{" "}
            <span className="text-xs font-bold uppercase">Upload</span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {isUploadOpen && (
          <UploadModal
            onClose={() => setIsUploadOpen(false)}
            onRefresh={fetchImages}
            addToast={addToast}
          />
        )}
        {editingItem && (
          <EditModal
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onRefresh={fetchImages}
            addToast={addToast}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- Upload Modal ---
function UploadModal({
  onClose,
  onRefresh,
  addToast,
}: {
  onClose: () => void;
  onRefresh: () => void;
  addToast: any;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setStatus("uploading");
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const parts = file.name.split(".");
      const ext = parts.pop();
      const fileName = `${Date.now()}-${parts
        .join("")
        .replace(/[^a-z0-9]/gi, "")}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("portfolio")
        .upload(fileName, file);
      if (upErr) throw upErr;
      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(fileName);
      const { error: dbErr } = await supabase
        .from("images")
        .insert([{ title, url: publicUrl }]);
      if (dbErr) throw dbErr;

      addToast("Image uploaded", "success");
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 500);
    } catch (err) {
      addToast("Upload failed", "error");
      setStatus("idle");
    }
  };

  return (
    <ModalLayout title="NEW ENTRY" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative group w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#FF3B30] hover:bg-[#FF3B30]/5 transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-gray-400">
              <Upload className="mx-auto mb-2" />
              <span className="text-xs font-bold uppercase">
                Click to Select
              </span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            required
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        <Input
          label="Title"
          placeholder="Image Title..."
          name="title"
          required
        />
        <button
          disabled={status === "uploading"}
          className="w-full bg-[#1C1B1F] text-white py-4 rounded-xl font-bold hover:bg-[#FF3B30] transition-colors flex justify-center items-center gap-2"
        >
          {status === "uploading" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "UPLOAD ASSET"
          )}
        </button>
      </form>
    </ModalLayout>
  );
}

// --- Edit Modal ---
function EditModal({
  item,
  onClose,
  onRefresh,
  addToast,
}: {
  item: ImageItem;
  onClose: () => void;
  onRefresh: () => void;
  addToast: any;
}) {
  const [title, setTitle] = useState(item.title);
  const [loading, setLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await supabase.from("images").update({ title }).eq("id", item.id);
    addToast("Updated successfully", "success");
    setLoading(false);
    onRefresh();
    onClose();
  };

  const handleDelete = async () => {
    setLoading(true);
    const fileName = item.url.split("/").pop();
    if (fileName) await supabase.storage.from("portfolio").remove([fileName]);
    await supabase.from("images").delete().eq("id", item.id);
    addToast("Image deleted", "success");
    onRefresh();
    onClose();
  };

  if (confirmDel)
    return (
      <ConfirmModal
        title="Delete Image?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(false)}
        loading={loading}
      />
    );

  return (
    <ModalLayout title="MODIFY ASSET" onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <Input label="Title" value={title} onChange={setTitle} />
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setConfirmDel(true)}
            className="flex-1 bg-red-50 text-red-500 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors flex justify-center gap-2"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-[2] bg-[#1C1B1F] text-white py-4 rounded-xl font-bold hover:bg-[#FF3B30] transition-colors flex justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> SAVE
              </>
            )}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}

// --- Shared Components ---
const Input = ({
  label,
  value,
  onChange,
  required,
  placeholder,
  name,
  autoFocus,
}: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-gray-400 ml-1">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      required={required}
      autoFocus={autoFocus}
      placeholder={placeholder}
      className="w-full bg-gray-50 p-3 rounded-xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF3B30] transition-all"
    />
  </div>
);
const TextArea = ({ label, value, onChange, rows }: any) => (
  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-gray-400 ml-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-gray-50 p-3 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF3B30] transition-all"
    />
  </div>
);

function ModalLayout({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1C1B1F]/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl"
      >
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <span className="font-black tracking-tight text-xl text-[#1C1B1F]">
            {title}
          </span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-[#FF3B30] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, loading }: any) {
  return (
    <ModalLayout title={title} onClose={onCancel}>
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-red-50 text-[#FF3B30] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <p className="text-gray-500 mb-8 font-medium">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-4 bg-[#FF3B30] text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "CONFIRM DELETE"}
          </button>
        </div>
      </div>
    </ModalLayout>
  );
}

function ToastContainer({ toasts }: { toasts: ToastType[] }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl font-bold text-sm ${
              t.type === "success"
                ? "bg-[#1C1B1F] text-white"
                : "bg-[#FF3B30] text-white"
            }`}
          >
            {t.type === "success" ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <AlertCircle size={16} />
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="aspect-[4/3] bg-gray-200 rounded-[2rem] animate-pulse"
        />
      ))}
    </div>
  );
}
