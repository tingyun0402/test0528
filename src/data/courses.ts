export type Course = {
  id: string;
  name: string;
  professor: string;
  department: string;
  credits: number;
  time: string;
  seatsLeft: number;
  fatigueIndex: "輕鬆" | "適中" | "重度";
  tags: string[];
  needsGroup: boolean;
  hasReport: boolean;
  needsExtraFee: boolean;
  passRate: number;
  failRate: number;
  reviews: { author: string; text: string; rating: number }[];
};

export const COURSES: Course[] = [
  {
    id: "c1", name: "網站規劃與設計", professor: "李明哲", department: "資傳系",
    credits: 3, time: "週二 3-4 節", seatsLeft: 4, fatigueIndex: "適中",
    tags: ["實作課", "作品集加分"], needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 92, failRate: 3,
    reviews: [
      { author: "資傳大三", text: "老師很 nice，作業多但學得到東西。", rating: 5 },
      { author: "匿名", text: "需要組員配合，分組是命運。", rating: 4 },
    ],
  },
  {
    id: "c2", name: "採訪寫作", professor: "陳雅琳", department: "新聞系",
    credits: 3, time: "週三 5-6 節", seatsLeft: 2, fatigueIndex: "重度",
    tags: ["實戰", "外出採訪"], needsGroup: false, hasReport: true, needsExtraFee: false,
    passRate: 85, failRate: 5,
    reviews: [{ author: "新聞大二", text: "很操但收穫滿滿。", rating: 5 }],
  },
  {
    id: "c3", name: "傳播理論", professor: "王怡文", department: "傳管系",
    credits: 2, time: "週一 2 節", seatsLeft: 8, fatigueIndex: "輕鬆",
    tags: ["甜課", "好過"], needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 98, failRate: 0,
    reviews: [{ author: "外系生", text: "通識首選，輕鬆過。", rating: 5 }],
  },
  {
    id: "c4", name: "數位攝影", professor: "張志成", department: "圖文傳播暨數位出版",
    credits: 3, time: "週四 6-7 節", seatsLeft: 1, fatigueIndex: "適中",
    tags: ["需自備相機"], needsGroup: false, hasReport: true, needsExtraFee: true,
    passRate: 90, failRate: 4,
    reviews: [{ author: "圖傳大三", text: "需要花錢沖洗照片。", rating: 4 }],
  },
  {
    id: "c5", name: "微電影製作", professor: "林俊宏", department: "廣電系",
    credits: 3, time: "週五 7-8-9 節", seatsLeft: 3, fatigueIndex: "重度",
    tags: ["分組地獄", "成果發表"], needsGroup: true, hasReport: true, needsExtraFee: true,
    passRate: 80, failRate: 8,
    reviews: [{ author: "廣電大二", text: "拍片要熬夜，但很有成就感。", rating: 4 }],
  },
  {
    id: "c6", name: "公共關係概論", professor: "黃佳音", department: "公廣系",
    credits: 2, time: "週三 3 節", seatsLeft: 12, fatigueIndex: "輕鬆",
    tags: ["甜課", "點名少"], needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 96, failRate: 1,
    reviews: [{ author: "匿名", text: "輕鬆愉快，老師很幽默。", rating: 5 }],
  },
  {
    id: "c7", name: "廣告創意策略", professor: "吳承翰", department: "公廣系",
    credits: 3, time: "週二 6-7 節", seatsLeft: 5, fatigueIndex: "適中",
    tags: ["腦力激盪", "提案"], needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 88, failRate: 4,
    reviews: [{ author: "公廣大三", text: "提案壓力大但很有趣。", rating: 4 }],
  },
  {
    id: "c8", name: "社群媒體經營", professor: "謝宛庭", department: "傳管系",
    credits: 2, time: "週四 3-4 節", seatsLeft: 6, fatigueIndex: "輕鬆",
    tags: ["實用", "IG 案例"], needsGroup: false, hasReport: true, needsExtraFee: false,
    passRate: 94, failRate: 2,
    reviews: [{ author: "傳管大二", text: "貼近生活，作業好寫。", rating: 5 }],
  },
  {
    id: "c9", name: "影視美學賞析", professor: "趙家瑜", department: "通識中心",
    credits: 2, time: "週一 6-7 節", seatsLeft: 0, fatigueIndex: "輕鬆",
    tags: ["看電影", "通識"], needsGroup: false, hasReport: false, needsExtraFee: false,
    passRate: 99, failRate: 0,
    reviews: [{ author: "外系生", text: "看片寫心得，超甜。", rating: 5 }],
  },
  {
    id: "c10", name: "資料新聞學", professor: "周品妤", department: "新聞系",
    credits: 3, time: "週五 3-4 節", seatsLeft: 2, fatigueIndex: "重度",
    tags: ["寫程式", "資料分析"], needsGroup: true, hasReport: true, needsExtraFee: false,
    passRate: 78, failRate: 10,
    reviews: [{ author: "新聞大三", text: "需要學 Python，但很潮。", rating: 4 }],
  },
];
