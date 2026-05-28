export type Holder = { nickname: string; dept: string };

export type CourseKind = "必修" | "選修" | "通識";

export type Course = {
  id: string;
  name: string;
  professor: string;
  department: string;
  credits: number;
  time: string;
  kind: CourseKind;       // 必修 / 選修 / 通識（只有通識可被換）
  fatigueIndex: "輕鬆" | "適中" | "重度";
  fatigueScore: number; // 1-10
  tags: string[];        // 學生定義 #甜課 #不點名 ...
  needsGroup: boolean;
  hasReport: boolean;
  needsExtraFee: boolean;
  passRate: number;
  failRate: number;
  // 社群動態
  wantToDrop: number;    // 目前有 N 人想丟出
  queueing: number;      // N 位學長姐正在排隊換進
  holders: Holder[];     // 持有這門課的同學
  reviews: { author: string; text: string; rating: number }[];
};

export const COURSES: Course[] = [
  {
    id: "c1", name: "網站規劃與設計", professor: "李明哲", department: "資傳系",
    credits: 3, time: "週二 3-4 節", kind: \"通識\", fatigueIndex: "適中", fatigueScore: 6,
    tags: ["#實作課", "#作品集加分", "#會被罵但學得多"],
    needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 92, failRate: 3,
    wantToDrop: 8, queueing: 12,
    holders: [{ nickname: "資傳二甲小明", dept: "資傳系" }, { nickname: "資傳三乙阿威", dept: "資傳系" }],
    reviews: [
      { author: "資傳大三", text: "老師很 nice，作業多但學得到東西。", rating: 5 },
      { author: "匿名", text: "需要組員配合，分組是命運。", rating: 4 },
    ],
  },
  {
    id: "c2", name: "採訪寫作", professor: "陳雅琳", department: "新聞系",
    credits: 3, time: "週三 5-6 節", kind: \"通識\", fatigueIndex: "重度", fatigueScore: 9,
    tags: ["#實戰", "#外出採訪", "#不點名但作業海"],
    needsGroup: false, hasReport: true, needsExtraFee: false,
    passRate: 85, failRate: 5,
    wantToDrop: 14, queueing: 6,
    holders: [{ nickname: "新聞一乙小華", dept: "新聞系" }, { nickname: "新聞二甲怡君", dept: "新聞系" }],
    reviews: [{ author: "新聞大二", text: "很操但收穫滿滿。", rating: 5 }],
  },
  {
    id: "c3", name: "口語傳播", professor: "游梓翔", department: "口傳系",
    credits: 2, time: "週一 2 節", kind: \"通識\", fatigueIndex: "輕鬆", fatigueScore: 3,
    tags: ["#甜課", "#好過", "#會練口才"],
    needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 98, failRate: 0,
    wantToDrop: 3, queueing: 22,
    holders: [{ nickname: "口傳一甲品妍", dept: "口傳系" }],
    reviews: [{ author: "外系生", text: "通識首選，輕鬆過。", rating: 5 }],
  },
  {
    id: "c4", name: "數位攝影", professor: "張志成", department: "圖傳系",
    credits: 3, time: "週四 6-7 節", kind: \"通識\", fatigueIndex: "適中", fatigueScore: 6,
    tags: ["#需自備相機", "#拍照打卡"],
    needsGroup: false, hasReport: true, needsExtraFee: true,
    passRate: 90, failRate: 4,
    wantToDrop: 5, queueing: 9,
    holders: [{ nickname: "圖傳三甲阿傑", dept: "圖傳系" }],
    reviews: [{ author: "圖傳大三", text: "需要花錢沖洗照片。", rating: 4 }],
  },
  {
    id: "c5", name: "微電影製作", professor: "林俊宏", department: "廣電系",
    credits: 3, time: "週五 7-8-9 節", kind: \"通識\", fatigueIndex: "重度", fatigueScore: 10,
    tags: ["#分組地獄", "#成果發表", "#拍片熬夜"],
    needsGroup: true, hasReport: true, needsExtraFee: true,
    passRate: 80, failRate: 8,
    wantToDrop: 18, queueing: 4,
    holders: [{ nickname: "廣電二乙小新", dept: "廣電系" }],
    reviews: [{ author: "廣電大二", text: "拍片要熬夜，但很有成就感。", rating: 4 }],
  },
  {
    id: "c6", name: "公共關係概論", professor: "黃佳音", department: "公廣系",
    credits: 2, time: "週三 3 節", kind: \"通識\", fatigueIndex: "輕鬆", fatigueScore: 2,
    tags: ["#甜課", "#不點名", "#老師超幽默"],
    needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 96, failRate: 1,
    wantToDrop: 2, queueing: 31,
    holders: [{ nickname: "公廣一甲 Mia", dept: "公廣系" }],
    reviews: [{ author: "匿名", text: "輕鬆愉快，老師很幽默。", rating: 5 }],
  },
  {
    id: "c7", name: "廣告創意策略", professor: "吳承翰", department: "公廣系",
    credits: 3, time: "週二 6-7 節", kind: \"通識\", fatigueIndex: "適中", fatigueScore: 7,
    tags: ["#腦力激盪", "#提案", "#分組重"],
    needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 88, failRate: 4,
    wantToDrop: 6, queueing: 11,
    holders: [{ nickname: "公廣三乙昱辰", dept: "公廣系" }],
    reviews: [{ author: "公廣大三", text: "提案壓力大但很有趣。", rating: 4 }],
  },
  {
    id: "c8", name: "社群媒體經營", professor: "謝宛庭", department: "傳管系",
    credits: 2, time: "週四 3-4 節", kind: \"通識\", fatigueIndex: "輕鬆", fatigueScore: 3,
    tags: ["#實用", "#IG案例", "#不用考試"],
    needsGroup: false, hasReport: true, needsExtraFee: false,
    passRate: 94, failRate: 2,
    wantToDrop: 4, queueing: 19,
    holders: [{ nickname: "傳管二甲庭瑄", dept: "傳管系" }],
    reviews: [{ author: "傳管大二", text: "貼近生活，作業好寫。", rating: 5 }],
  },
  {
    id: "c9", name: "影視美學賞析", professor: "趙家瑜", department: "通識中心",
    credits: 2, time: "週一 6-7 節", kind: \"通識\", fatigueIndex: "輕鬆", fatigueScore: 1,
    tags: ["#看電影", "#通識神課", "#寫心得"],
    needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 99, failRate: 0,
    wantToDrop: 1, queueing: 47,
    holders: [{ nickname: "外系生 Ray", dept: "資管系" }],
    reviews: [{ author: "外系生", text: "看片寫心得，超甜。", rating: 5 }],
  },
  {
    id: "c10", name: "資料新聞學", professor: "周品妤", department: "新聞系",
    credits: 3, time: "週五 3-4 節", kind: \"通識\", fatigueIndex: "重度", fatigueScore: 8,
    tags: ["#寫程式", "#資料分析", "#文組崩潰"],
    needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 78, failRate: 10,
    wantToDrop: 9, queueing: 5,
    holders: [{ nickname: "新聞三甲思妤", dept: "新聞系" }],
    reviews: [{ author: "新聞大三", text: "需要學 Python，但很潮。", rating: 4 }],
  },
  // 我手上的必修課（系上規定，不可換）
  {
    id: "m1", name: "傳播理論", professor: "胡光夏", department: "資傳系",
    credits: 3, time: "週一 3-4 節", kind: "必修", fatigueIndex: "適中", fatigueScore: 6,
    tags: ["#必修", "#要讀原文"],
    needsGroup: false, hasReport: true, needsExtraFee: false,
    passRate: 90, failRate: 4, wantToDrop: 0, queueing: 0,
    holders: [{ nickname: "資傳二甲小明", dept: "資傳系" }], reviews: [],
  },
  {
    id: "m2", name: "計算機概論", professor: "王國川", department: "資傳系",
    credits: 3, time: "週二 7-8 節", kind: "必修", fatigueIndex: "適中", fatigueScore: 5,
    tags: ["#必修", "#寫程式"],
    needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 88, failRate: 5, wantToDrop: 0, queueing: 0,
    holders: [{ nickname: "資傳二甲小明", dept: "資傳系" }], reviews: [],
  },
  {
    id: "m3", name: "大一英文", professor: "Sarah Wu", department: "通識中心",
    credits: 2, time: "週四 1-2 節", kind: "必修", fatigueIndex: "輕鬆", fatigueScore: 4,
    tags: ["#必修", "#分組報告"],
    needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 95, failRate: 1, wantToDrop: 0, queueing: 0,
    holders: [{ nickname: "資傳二甲小明", dept: "資傳系" }], reviews: [],
  },
  // 我手上的選修課（系內選修）
  {
    id: "e1", name: "互動媒體設計", professor: "陳柏全", department: "資傳系",
    credits: 3, time: "週三 7-8 節", kind: "選修", fatigueIndex: "適中", fatigueScore: 6,
    tags: ["#選修", "#實作"],
    needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 92, failRate: 2, wantToDrop: 0, queueing: 0,
    holders: [{ nickname: "資傳二甲小明", dept: "資傳系" }], reviews: [],
  },
];

// 我目前手上的課（必修 + 選修 + 一堂通識）
export const OWNED_COURSE_IDS = ["m1", "m2", "m3", "e1", "c3"];



// 解析「週X N-N 節」為 { day: 0-4, periods: number[] }
const DAYS = ["一", "二", "三", "四", "五"];
export function parseSlot(time: string): { day: number; periods: number[] } | null {
  const m = time.match(/週(.)\s*([\d\-]+)\s*節/);
  if (!m) return null;
  const day = DAYS.indexOf(m[1]);
  if (day < 0) return null;
  const parts = m[2].split("-").map((s) => parseInt(s));
  let ps: number[] = [];
  if (parts.length === 1) ps = [parts[0]];
  else if (parts.length === 2) for (let i = parts[0]; i <= parts[1]; i++) ps.push(i);
  else ps = parts;
  return { day, periods: ps };
}

// 偵測一組課程內所有衝堂配對
export function detectConflicts(courses: Course[]): { a: Course; b: Course; day: number; periods: number[] }[] {
  const conflicts: { a: Course; b: Course; day: number; periods: number[] }[] = [];
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const sa = parseSlot(courses[i].time);
      const sb = parseSlot(courses[j].time);
      if (!sa || !sb || sa.day !== sb.day) continue;
      const overlap = sa.periods.filter((p) => sb.periods.includes(p));
      if (overlap.length > 0) {
        conflicts.push({ a: courses[i], b: courses[j], day: sa.day, periods: overlap });
      }
    }
  }
  return conflicts;
}

export const DAY_NAMES = DAYS;
