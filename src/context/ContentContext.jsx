import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import API from "../utils/api";
import { defaultContent } from "../data/defaultContent";
import {
  getSiteContent,
  updateSectionContent,
  uploadContentMedia,
} from "../services/contentService";

const ContentContext = createContext({
  content: defaultContent,
  loading: false,
  error: null,
  refreshContent: () => {},
  updateSection: () => Promise.resolve(),
  uploadMedia: () => Promise.resolve(""),
  resolveMediaUrl: (url) => url,
});

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const deepMerge = (target, source) => {
  // If source is explicitly provided (even if empty), use it
  if (source === null || source === undefined) {
    return target;
  }
  
  // Arrays: always prefer source if it exists
  if (Array.isArray(source)) {
    return source;
  }
  
  // Objects: deep merge
  if (isObject(target) && isObject(source)) {
    const result = { ...target };
    Object.keys(source).forEach((key) => {
      result[key] = deepMerge(target[key], source[key]);
    });
    return result;
  }
  
  // Primitives: always prefer source
  return source;
};


const cloneDefaults = () => JSON.parse(JSON.stringify(defaultContent));

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(cloneDefaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assetBaseUrl = useMemo(() => {
    const apiBase = API.defaults?.baseURL || window.location.origin;
    const trimmed = apiBase.replace(/\/+$/, "");
    if (trimmed.endsWith("/api")) {
      return trimmed.slice(0, -4);
    }
    return trimmed;
  }, []);

  const mergeContent = useCallback((incoming) => {
    if (!incoming || typeof incoming !== "object") return;
    setContent((prev) => {
      // Create a fresh copy prioritizing incoming data
      const merged = { ...prev };
      Object.keys(incoming).forEach((key) => {
        // Completely replace the section with incoming data
        merged[key] = incoming[key];
      });
      return merged;
    });
  }, []);
  

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSiteContent();
      mergeContent(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load site content:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [mergeContent]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const resolveMediaUrl = useCallback(
    (url) => {
      if (!url) return "";
      if (typeof url !== "string") return url;
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
      }
      if (url.startsWith("/uploads/") || url.startsWith("/images/")) {
        const normalized = url.startsWith("/") ? url : `/${url}`;
        return `${assetBaseUrl}${normalized}`;
      }
      if (url.startsWith("/")) {
        return url;
      }
      return `${assetBaseUrl}/${url}`;
    },
    [assetBaseUrl]
  );

  const updateSection = useCallback(
    async (sectionKey, payload) => {
      if (!sectionKey) throw new Error("Section key is required");
      await updateSectionContent(sectionKey, payload);
      
      // ✅ Refresh content from database after save
      await fetchContent();
      
      toast.success("Content updated successfully");
    },
    [fetchContent]
  );
  

  const uploadMedia = useCallback(async (file) => {
    const result = await uploadContentMedia(file);
    if (result?.path) {
      toast.success("Media uploaded");
      return result.path;
    }
    throw new Error("Media upload failed");
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refreshContent: fetchContent,
        updateSection,
        uploadMedia,
        resolveMediaUrl,
        setLocalContent: mergeContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);

