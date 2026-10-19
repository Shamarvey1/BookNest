import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getAllProgress,
  deleteProgress as apiDeleteProgress,
  upsertProgress as apiUpsertProgress,
} from "../services/progressService";

const ProgressContext = createContext();

const CACHE_KEY = "booknest_progress_cache";

export function ProgressProvider({ children }) {
  const [progressList, setProgressList] = useState(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    const handleTokenChange = (e) => {
      setToken(e.detail?.token || localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenChanged", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleTokenChange);
    };
  }, []);

  const loadProgress = useCallback(async () => {
    if (!token) {
      setProgressList([]);
      sessionStorage.removeItem(CACHE_KEY);
      return;
    }

    try {
      const data = await getAllProgress();
      if (Array.isArray(data)) {
        setProgressList(data);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.error("Failed to load progress in background:", err);
    }
  }, [token]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const updateProgress = async (bookId, percent, position) => {
    setProgressList((prev) => {
      const index = prev.findIndex((p) => p.bookId === bookId || p.book?.id === bookId);
      let updated;
      if (index >= 0) {
        updated = [...prev];
        updated[index] = {
          ...updated[index],
          percent,
          position,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updated = [
          {
            bookId,
            percent,
            position,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      }
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await apiUpsertProgress(bookId, percent, position);
    } catch (err) {
      console.error("Background progress save failed:", err);
    }
  };

  const removeProgress = async (bookId) => {
    try {
      await apiDeleteProgress(bookId);
      setProgressList((prev) => {
        const filtered = prev.filter(
          (p) => p.bookId !== bookId && p.book?.id !== bookId
        );
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
        } catch {}
        return filtered;
      });
    } catch (err) {
      console.error("Failed to delete progress:", err);
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        progressList,
        loadProgress,
        updateProgress,
        removeProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
