import { useSyncExternalStore } from "react";
import { COURSES, OWNED_COURSE_IDS, type Course } from "@/data/courses";

export type ChatMsg = { from: "me" | "peer"; text: string; warn?: boolean; ts: number };

type State = {
  authed: boolean;
  wantIn: string[];
  wantOut: string[];
  favorites: string[];
  passed: string[];
  schedule: string[];
  matchedSeen: string[];
  chats: Record<string, ChatMsg[]>; // peerName -> messages
};

const STORAGE_KEY = "aizhenke-state-v1";

const initial: State = {
  authed: false,
  wantIn: ["c1"],
  wantOut: ["c3"],
  favorites: [],
  passed: [],
  schedule: [...OWNED_COURSE_IDS],
  matchedSeen: [],
  chats: {},
};

function load(): State {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    // authed 不從 localStorage 還原，每次進站都需登入
    const { authed: _ignored, ...rest } = JSON.parse(raw);
    return { ...initial, ...rest, authed: false };
  } catch {
    return initial;
  }
}

let state: State = load();
const listeners = new Set<() => void>();
const persist = () => {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
};
const emit = () => { persist(); listeners.forEach((l) => l()); };

export const appStore = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
  setAuthed: (v: boolean) => { state = { ...state, authed: v }; emit(); },
  likeCourse: (id: string) => {
    if (!state.wantIn.includes(id)) state.wantIn = [...state.wantIn, id];
    emit();
  },
  passCourse: (id: string) => {
    if (!state.passed.includes(id)) state.passed = [...state.passed, id];
    emit();
  },
  toggleWantOut: (id: string) => {
    state.wantOut = state.wantOut.includes(id)
      ? state.wantOut.filter((x) => x !== id)
      : [...state.wantOut, id];
    emit();
  },
  toggleWantIn: (id: string) => {
    state.wantIn = state.wantIn.includes(id)
      ? state.wantIn.filter((x) => x !== id)
      : [...state.wantIn, id];
    emit();
  },
  toggleFavorite: (id: string) => {
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((x) => x !== id)
      : [...state.favorites, id];
    emit();
  },
  addToSchedule: (id: string) => {
    if (!state.schedule.includes(id)) state.schedule = [...state.schedule, id];
    emit();
  },
  removeFromSchedule: (id: string) => {
    state.schedule = state.schedule.filter((x) => x !== id);
    emit();
  },
  markMatchedSeen: (name: string) => {
    if (!state.matchedSeen.includes(name)) state.matchedSeen = [...state.matchedSeen, name];
    emit();
  },
  appendChat: (peer: string, msg: ChatMsg) => {
    const prev = state.chats[peer] ?? [];
    state.chats = { ...state.chats, [peer]: [...prev, msg] };
    emit();
  },
  setChat: (peer: string, msgs: ChatMsg[]) => {
    state.chats = { ...state.chats, [peer]: msgs };
    emit();
  },
  resetSwipes: () => { state.passed = []; state.wantIn = []; emit(); },
};

export const useAppStore = () =>
  useSyncExternalStore(appStore.subscribe, appStore.get, () => initial);

export const getCourse = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);
