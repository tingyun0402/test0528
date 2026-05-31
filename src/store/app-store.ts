import { useSyncExternalStore } from "react";
import { COURSES, OWNED_COURSE_IDS, type Course } from "@/data/courses";

type State = {
  authed: boolean;
  wantIn: string[];        // course ids 我想換進
  wantOut: string[];       // course ids 我想換出
  favorites: string[];     // 收藏/考慮
  passed: string[];        // 已略過
  schedule: string[];      // 已加入課表（包含必修/選修/通識）
  matchedSeen: string[];   // 已看過配對成功彈窗的同學名稱
};

const initial: State = {
  authed: false,
  wantIn: ["c1"],
  wantOut: ["c3"],
  favorites: [],
  passed: [],
  schedule: [...OWNED_COURSE_IDS],
  matchedSeen: [],
};

let state: State = { ...initial };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

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
  resetSwipes: () => { state.passed = []; state.wantIn = []; emit(); },
};

export const useAppStore = () =>
  useSyncExternalStore(appStore.subscribe, appStore.get, appStore.get);

export const getCourse = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);
