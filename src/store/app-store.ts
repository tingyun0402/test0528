import { useSyncExternalStore } from "react";
import { COURSES, type Course } from "@/data/courses";

type State = {
  wantIn: string[];        // course ids 我想換進
  wantOut: string[];       // course ids 我想換出
  passed: string[];        // 已略過
  schedule: string[];      // 已加入課表
};

const initial: State = {
  wantIn: [],
  wantOut: ["c3"], // demo: user currently has 傳播理論 想換出
  passed: [],
  schedule: ["c3"],
};

let state: State = { ...initial };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const appStore = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
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
  addToSchedule: (id: string) => {
    if (!state.schedule.includes(id)) state.schedule = [...state.schedule, id];
    emit();
  },
  removeFromSchedule: (id: string) => {
    state.schedule = state.schedule.filter((x) => x !== id);
    emit();
  },
  resetSwipes: () => { state.passed = []; state.wantIn = []; emit(); },
};

export const useAppStore = () =>
  useSyncExternalStore(appStore.subscribe, appStore.get, appStore.get);

export const getCourse = (id: string): Course | undefined =>
  COURSES.find((c) => c.id === id);
