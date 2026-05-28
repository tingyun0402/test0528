import { useSyncExternalStore } from "react";
import { COURSES, OWNED_COURSE_IDS, type Course } from "@/data/courses";

type State = {
  authed: boolean;
  wantIn: string[];        // course ids 我想換進
  wantOut: string[];       // course ids 我想換出
  passed: string[];        // 已略過
  schedule: string[];      // 已加入課表（包含必修/選修/通識）
};

const initial: State = {
  authed: false,
  wantIn: [],
  wantOut: [],
  passed: [],
  // 預設手上有必修+選修+一堂通識
  schedule: [...OWNED_COURSE_IDS],
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
