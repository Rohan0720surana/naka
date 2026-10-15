"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { pick, translate, type TKey, type TVars } from "@/lib/i18n";
import { STORAGE_KEY, useDemo } from "@/lib/store";
import type { L10n, Lang } from "@/lib/types";

/**
 * Pins a subtree to one language (the employer side is English, and the
 * posting preview shows any language) regardless of the worker's choice.
 */
export const LangContext = createContext<Lang | null>(null);

/** Translator bound to the worker's chosen language. */
export function useT() {
  const storeLang = useDemo((s) => s.lang);
  const override = useContext(LangContext);
  const lang = override ?? storeLang;
  const t = useCallback((key: TKey, vars?: TVars) => translate(lang, key, vars), [lang]);
  const p = useCallback((text: L10n | undefined) => pick(text, lang), [lang]);
  return { t, p, lang };
}

/**
 * Rehydrates the demo store from localStorage once, and keeps every open
 * frame (worker phone, employer browser, demo page) in sync through
 * `storage` events.
 */
export function useStoreSync() {
  useEffect(() => {
    if (!useDemo.persist.hasHydrated()) void useDemo.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) void useDemo.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}

export function useHydrated() {
  return useSyncExternalStore(
    (onChange) => useDemo.persist.onFinishHydration(onChange),
    () => useDemo.persist.hasHydrated(),
    () => false,
  );
}

function subscribeOnline(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export function useOnline() {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
}

const noSubscribe = () => () => {};

/** The site's origin on the client (empty while rendering on the server). */
export function useOrigin() {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
}

function readInFrame() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/** True inside the /demo page's device frames, where "go to the main site" links are hidden. */
export function useInFrame() {
  return useSyncExternalStore(noSubscribe, readInFrame, () => false);
}
