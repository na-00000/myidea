/**
 * [내 생각 말하기] - 중학교 3학년 지체장애(뇌성마비) 학생을 위한 일일 의사표현 및 단어 학습 웹앱
 *
 * 핵심 기능:
 * 1. 초대형 하단 터치 타겟 & 오터치 방지 시각적 쿨다운 게이지(기본 2.5초, 1~5초 조절)
 * 2. 1회 즉시 선택 모드 vs 2번 터치(미리듣기 후 확인) 모드 지원
 * 3. Web Speech API 한국어 TTS(속도 0.85 기본) 즉각 피드백 및 4단계 어절별 순차 하이라이트 발표
 * 4. 4단계 고정 일일 루틴 ([도입] 주제 선택 -> [1단계] 기분·생각 -> [2단계] 원하는 것 -> [3단계] 단어 조립 & 슬라이딩 쓰기 -> [4단계] 발표하기)
 * 5. 특수학교 및 일상생활 10선 기본 데이터셋 내장 + localStorage 실시간 편집/추가 지원
 */

const STORAGE_KEYS = {
  TOPICS: "my_thought_voice_topics_v1",
  SETTINGS: "my_thought_voice_settings_v1"
};

/**
 * 특수학교 및 일상생활 10선 기본 주제 데이터셋 (모두 2~5글자 이내 어휘)
 */
const DEFAULT_TOPICS = [
  {
    id: "lunch",
    title: "급식 시간",
    particle: "은",
    icon: "🍱",
    accent: "amber",
    step1Prompt: "급식 시간이 어때요?",
    step1FixedChoices: [
      { word: "좋아요", icon: "😊", accent: "emerald" },
      { word: "싫어요", icon: "🙅", accent: "rose" },
      { word: "재밌어요", icon: "😄", accent: "sky" },
      { word: "힘들어요", icon: "💦", accent: "amber" }
    ],
    step1TopicChoices: [
      { word: "좋아요", icon: "😊", accent: "emerald" },
      { word: "싫어요", icon: "🙅", accent: "rose" },
      { word: "맛있어요", icon: "😋", accent: "amber" },
      { word: "배불러요", icon: "🫃", accent: "sky" }
    ],
    step2Prompt: "급식 시간에 어떻게 할까요?",
    step2Suffix: "원해요",
    step2Choices: [
      { word: "고기반찬", icon: "🍖", accent: "amber", fullLine: "나는 고기반찬 먹을래요." },
      { word: "조금만요", icon: "🤏", accent: "sky", fullLine: "나는 조금만 먹을래요." },
      { word: "더 주세요", icon: "🥣", accent: "emerald", fullLine: "나는 더 주세요." },
      { word: "안 먹어요", icon: "✋", accent: "rose", fullLine: "나는 안 먹어요." }
    ]
  },
  {
    id: "breaktime",
    title: "쉬는 시간",
    particle: "은",
    icon: "🎧",
    accent: "sky",
    step1Prompt: "쉬는 시간이 어때요?",
    step1TopicChoices: [
      { word: "좋아요", icon: "😊", accent: "emerald" },
      { word: "피곤해요", icon: "🥱", accent: "amber" },
      { word: "심심해요", icon: "😐", accent: "indigo" },
      { word: "신나요", icon: "🎵", accent: "sky" }
    ],
    step2Prompt: "쉬는 시간에 무엇을 할까요?",
    step2Suffix: "할래요",
    step2Choices: [
      { word: "태블릿", icon: "📱", accent: "sky", fullLine: "나는 태블릿 할래요." },
      { word: "음악 듣기", icon: "🎧", accent: "indigo", fullLine: "나는 음악 듣기 할래요." },
      { word: "화장실", icon: "🚻", accent: "amber", fullLine: "나는 화장실 갈래요." },
      { word: "물 마시기", icon: "💧", accent: "emerald", fullLine: "나는 물 마시기 할래요." }
    ]
  },
  {
    id: "condition",
    title: "몸 컨디션",
    particle: "은",
    icon: "💪",
    accent: "emerald",
    step1Prompt: "오늘 아침 몸은 어때요?",
    step1TopicChoices: [
      { word: "괜찮아요", icon: "👌", accent: "emerald" },
      { word: "피곤해요", icon: "😴", accent: "amber" },
      { word: "아파요", icon: "🩹", accent: "rose" },
      { word: "불편해요", icon: "😣", accent: "indigo" }
    ],
    step2Prompt: "선생님께 무엇을 말할까요?",
    step2Suffix: "원해요",
    step2Choices: [
      { word: "자세 변경", icon: "🪑", accent: "sky", fullLine: "나는 자세 변경 원해요." },
      { word: "쉬고 싶어요", icon: "🛋️", accent: "emerald", fullLine: "나는 쉬고 싶어요." },
      { word: "기다려요", icon: "⏳", accent: "amber", fullLine: "나는 천천히 기다려요." },
      { word: "도와주세요", icon: "🤝", accent: "rose", fullLine: "나는 도와주세요." }
    ]
  },
  {
    id: "moving",
    title: "교실 이동",
    particle: "은",
    icon: "🧑‍🦽",
    accent: "indigo",
    step1Prompt: "교실 이동이 어때요?",
    step1TopicChoices: [
      { word: "가고 싶어요", icon: "🚀", accent: "emerald" },
      { word: "가기 싫어요", icon: "🛑", accent: "rose" },
      { word: "추워요", icon: "🥶", accent: "sky" },
      { word: "더워요", icon: "🥵", accent: "amber" }
    ],
    step2Prompt: "어떻게 이동할까요?",
    step2Suffix: "할래요",
    step2Choices: [
      { word: "천천히요", icon: "🐢", accent: "emerald", fullLine: "나는 천천히 갈래요." },
      { word: "휠체어", icon: "🧑‍🦽", accent: "sky", fullLine: "나는 휠체어 탈래요." },
      { word: "교실이요", icon: "🏫", accent: "amber", fullLine: "나는 교실에 있을래요." },
      { word: "같이 가요", icon: "👫", accent: "indigo", fullLine: "나는 같이 가요." }
    ]
  },
  {
    id: "helper",
    title: "선생님 요청",
    particle: "은",
    icon: "🙋",
    accent: "violet",
    step1Prompt: "지금 어떤 상황인가요?",
    step1TopicChoices: [
      { word: "도움 필요", icon: "🆘", accent: "rose" },
      { word: "혼자 할래요", icon: "💪", accent: "emerald" },
      { word: "잠깐만요", icon: "✋", accent: "amber" },
      { word: "고마워요", icon: "💛", accent: "sky" }
    ],
    step2Prompt: "어떻게 도와줄까요?",
    step2Suffix: "원해요",
    step2Choices: [
      { word: "기다려요", icon: "⏱️", accent: "amber", fullLine: "나는 조금만 기다려요." },
      { word: "손 잡아줘요", icon: "🤝", accent: "sky", fullLine: "나는 손 잡아줘요." },
      { word: "닦아주세요", icon: "🧻", accent: "emerald", fullLine: "나는 닦아주세요." },
      { word: "다시 할래요", icon: "🔄", accent: "indigo", fullLine: "나는 다시 할래요." }
    ]
  },
  {
    id: "korean_class",
    title: "국어 수업",
    particle: "은",
    icon: "📖",
    accent: "sky",
    step1Prompt: "국어 수업이 어때요?",
    step1TopicChoices: [
      { word: "재밌어요", icon: "😄", accent: "emerald" },
      { word: "어려워요", icon: "🤔", accent: "amber" },
      { word: "쉬워요", icon: "✨", accent: "sky" },
      { word: "힘들어요", icon: "💦", accent: "rose" }
    ],
    step2Prompt: "수업에서 무엇을 할까요?",
    step2Suffix: "할래요",
    step2Choices: [
      { word: "글자 쓰기", icon: "✍️", accent: "sky", fullLine: "나는 글자 쓰기 할래요." },
      { word: "단어 터치", icon: "👆", accent: "emerald", fullLine: "나는 단어 터치 할래요." },
      { word: "더 할래요", icon: "➕", accent: "indigo", fullLine: "나는 공부 더 할래요." },
      { word: "쉬었다 해요", icon: "☕", accent: "amber", fullLine: "나는 쉬었다 해요." }
    ]
  },
  {
    id: "club_play",
    title: "놀이 시간",
    particle: "은",
    icon: "🎮",
    accent: "emerald",
    step1Prompt: "동아리·놀이 시간이 어때요?",
    step1TopicChoices: [
      { word: "신나요", icon: "🎉", accent: "emerald" },
      { word: "하고 싶어요", icon: "🙌", accent: "sky" },
      { word: "구경할래요", icon: "👀", accent: "amber" },
      { word: "재밌어요", icon: "😆", accent: "indigo" }
    ],
    step2Prompt: "게임할 때 무슨 말을 할까요?",
    step2Suffix: "말해요",
    step2Choices: [
      { word: "내 차례요", icon: "☝️", accent: "sky", fullLine: "지금은 내 차례요." },
      { word: "한 번 더", icon: "🔁", accent: "emerald", fullLine: "나는 한 번 더 할래요." },
      { word: "같이 해요", icon: "🤜", accent: "amber", fullLine: "우리 같이 해요." },
      { word: "이겼어요", icon: "🏆", accent: "indigo", fullLine: "신나게 이겼어요." }
    ]
  },
  {
    id: "after_school",
    title: "집에 가면",
    particle: "은",
    icon: "🏠",
    accent: "amber",
    step1Prompt: "하교 후 집에서 기분이 어때요?",
    step1TopicChoices: [
      { word: "편안해요", icon: "😌", accent: "emerald" },
      { word: "배고파요", icon: "🥨", accent: "amber" },
      { word: "졸려요", icon: "😪", accent: "indigo" },
      { word: "심심해요", icon: "🛋️", accent: "sky" }
    ],
    step2Prompt: "집에서 무엇을 할까요?",
    step2Suffix: "할래요",
    step2Choices: [
      { word: "유튜브", icon: "▶️", accent: "rose", fullLine: "나는 유튜브 볼래요." },
      { word: "간식 먹기", icon: "🍪", accent: "amber", fullLine: "나는 간식 먹기 할래요." },
      { word: "일찍 자기", icon: "🛌", accent: "indigo", fullLine: "나는 일찍 자기 할래요." },
      { word: "티비 보기", icon: "📺", accent: "sky", fullLine: "나는 티비 보기 할래요." }
    ]
  },
  {
    id: "weather_clothes",
    title: "오늘 날씨",
    particle: "는",
    icon: "🌤️",
    accent: "sky",
    step1Prompt: "오늘 날씨가 어때요?",
    step1TopicChoices: [
      { word: "맑아요", icon: "☀️", accent: "amber" },
      { word: "비 와요", icon: "☔", accent: "sky" },
      { word: "추워요", icon: "🥶", accent: "indigo" },
      { word: "더워요", icon: "🥵", accent: "rose" }
    ],
    step2Prompt: "날씨에 맞춰 어떻게 할까요?",
    step2Suffix: "할래요",
    step2Choices: [
      { word: "겉옷 입기", icon: "🧥", accent: "amber", fullLine: "나는 겉옷 입기 할래요." },
      { word: "겉옷 벗기", icon: "👕", accent: "sky", fullLine: "나는 겉옷 벗기 할래요." },
      { word: "창문 닫기", icon: "🪟", accent: "indigo", fullLine: "나는 창문 닫기 할래요." },
      { word: "교실 있기", icon: "🏫", accent: "emerald", fullLine: "나는 교실 있기 할래요." }
    ]
  },
  {
    id: "friends_talk",
    title: "친구 대화",
    particle: "는",
    icon: "👋",
    accent: "rose",
    step1Prompt: "친구를 만나면 기분이 어때요?",
    step1TopicChoices: [
      { word: "반가워요", icon: "🙌", accent: "emerald" },
      { word: "좋아요", icon: "😊", accent: "sky" },
      { word: "부끄러워요", icon: "😳", accent: "amber" },
      { word: "화났어요", icon: "😠", accent: "rose" }
    ],
    step2Prompt: "친구에게 무슨 말을 할까요?",
    step2Suffix: "말해요",
    step2Choices: [
      { word: "안녕", icon: "👋", accent: "sky", fullLine: "친구야 안녕." },
      { word: "같이 놀자", icon: "🎲", accent: "emerald", fullLine: "우리 같이 놀자." },
      { word: "미안해", icon: "🙏", accent: "amber", fullLine: "친구야 미안해." },
      { word: "고마워", icon: "💝", accent: "rose", fullLine: "친구야 고마워." }
    ]
  }
];

/**
 *1단계 고정 4개 선택지 (`좋아요` / `싫어요` / `재밌어요` / `힘들어요`)
 * 교사가 기본 4개 고정 기분 단어 또는 주제별 특화 기분 단어를 전환할 수 있게 지원
 */
const FIXED_MOOD_CHOICES = [
  { word: "좋아요", icon: "😊", accent: "emerald" },
  { word: "싫어요", icon: "🙅", accent: "rose" },
  { word: "재밌어요", icon: "😄", accent: "sky" },
  { word: "힘들어요", icon: "💦", accent: "amber" }
];

const DEFAULT_SETTINGS = {
  cooldownSeconds: 2.5,
  touchMode: "single", // "single" (1회 즉시) | "double" (2번 터치 미리듣기 후 확인)
  ttsRate: 0.9, // 목소리 갈라짐(타임스트레칭 아티팩트) 방지를 위한 자연스러운 속도 기본값
  preferredVoiceURI: "", // 교사가 지정한 한국어 음성 URI (비어 있으면 최고 음질 자동 선택)
  theme: "dark", // "dark" | "pastel"
  step1UseTopicWords: true, // true: 10대 주제별 맞춤 1단계 어휘(좋아요/싫어요 포함), false: 4개 고정(좋아요/싫어요/재밌어요/힘들어요)
  introPairIds: ["lunch", "breaktime"]
};

// 앱 상태 관리
const state = {
  topics: [],
  settings: { ...DEFAULT_SETTINGS },
  currentStep: 0, // 0: 도입, 1: 1단계, 2: 2단계, 3: 3단계, 4: 4단계
  selectedTopicId: "lunch",
  selectedMood: null, // { word, icon, accent }
  selectedDesire: null, // { word, icon, accent, fullLine }
  armedPreviewKey: null, // 2번 터치 모드에서 1차 터치된 카드 식별자
  writingTargetSource: "desire", // "mood" (1단계 단어) | "desire" (2단계 단어)
  writingMode: "block", // "block" (모드 A: 자음·모음 글자판 조립) | "canvas" (모드 B: 손가락 따라 쓰기)
  assembledChars: [], // 모드 A에서 조립 완료된 음절 배열
  currentJamoSteps: [], // 현재 음절에서 입력된 자모 단계 배열
  syllableDecompositions: [], // 목표 단어의 음절별 자모 분해 정보
  isCooldownActive: false,
  cooldownTimerId: null,
  cooldownIntervalId: null,
  editingTopicId: "lunch",
  speakingHighlightTimers: []
};

/* ==========================================================================
   초기화 및 로컬 스토리지 로드/저장
   ========================================================================== */
function loadFromStorage() {
  try {
    const savedTopics = localStorage.getItem(STORAGE_KEYS.TOPICS);
    if (savedTopics) {
      const parsed = JSON.parse(savedTopics);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        state.topics = parsed;
      } else {
        state.topics = structuredClone(DEFAULT_TOPICS);
      }
    } else {
      state.topics = structuredClone(DEFAULT_TOPICS);
    }

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
    } else {
      state.settings = { ...DEFAULT_SETTINGS };
    }
  } catch (e) {
    console.warn("스토리지 로드 실패, 기본값을 사용합니다.", e);
    state.topics = structuredClone(DEFAULT_TOPICS);
    state.settings = { ...DEFAULT_SETTINGS };
  }

  // 매번 접속할 때마다 도입 화면의 오늘의 주제 2개가 랜덤으로 뜨도록 설정
  randomizeIntroTopics();
  applyTheme(state.settings.theme);
}

/**
 * 전체 주제 목록 중에서 서로 다른 2개의 주제를 무작위로 뽑아 도입 화면에 배치합니다.
 */
function randomizeIntroTopics() {
  if (!Array.isArray(state.topics) || state.topics.length < 2) return;
  const indices = state.topics.map((_, idx) => idx);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const firstTopic = state.topics[indices[0]];
  const secondTopic = state.topics[indices[1]];
  state.settings.introPairIds = [firstTopic.id, secondTopic.id];
  state.selectedTopicId = firstTopic.id;
  state.editingTopicId = firstTopic.id;
}

function saveTopicsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(state.topics));
  } catch (e) {
    console.error("주제 저장 오류:", e);
  }
}

function saveSettingsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  } catch (e) {
    console.error("설정 저장 오류:", e);
  }
}

function getTopicById(id) {
  return state.topics.find((t) => t.id === id) || state.topics[0];
}

function getCurrentTopic() {
  return getTopicById(state.selectedTopicId);
}

/* ==========================================================================
   한국어 조사(은/는, 을/를) 자동 판별 유틸리티
   ========================================================================== */
function hasFinalConsonant(word) {
  if (!word || typeof word !== "string") return false;
  const trimmed = word.trim();
  const lastChar = trimmed.charCodeAt(trimmed.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;
  return (lastChar - 0xac00) % 28 !== 0;
}

function getTopicParticle(word) {
  return hasFinalConsonant(word) ? "은" : "는";
}

/* ==========================================================================
   Web Speech API 한국어 고음질 TTS 엔진 (목소리 깨짐 방지 & 자연스러운 한국어 억양 최적화)
   ========================================================================== */
let currentSpeechTimeoutId = null;

/**
 * 기기에 설치된 음성 목록 중 한국어(ko-KR) 음성을 찾아 음질 순위별로 정렬해 반환합니다.
 * (Google 한국의, Microsoft SunHi/InJoon Online Natural, Samsung 고음질 음성 등을 최우선 선택)
 */
function getRankedKoreanVoices() {
  if (!("speechSynthesis" in window)) return [];
  const allVoices = window.speechSynthesis.getVoices() || [];
  const koVoices = allVoices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith("ko") || v.name.includes("한국") || v.name.toLowerCase().includes("korean"))
  );

  const scoreVoice = (v) => {
    let score = 0;
    const name = (v.name || "").toLowerCase();
    const uri = (v.voiceURI || "").toLowerCase();
    // 1순위: 신경망(Natural / Neural / Online) 고음질 음성
    if (name.includes("natural") || name.includes("neural") || name.includes("online")) score += 50;
    // 2순위: Google 한국어 음성 및 Microsoft SunHi/InJoon, Apple Yuna, Samsung 음성
    if (name.includes("google") || uri.includes("google")) score += 40;
    if (name.includes("sunhi") || name.includes("injoon") || name.includes("yuna")) score += 35;
    if (name.includes("samsung") || uri.includes("samsung") || uri.includes("smt")) score += 25;
    // 네트워크 고음질 모델보다 저음질 경량 로컬 폴백이 먼저 잡히는 현상 방지
    if (!name.includes("compact") && !name.includes("espeak")) score += 10;
    if (v.default) score += 5;
    return score;
  };

  return koVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

function getBestKoreanVoice() {
  const koVoices = getRankedKoreanVoices();
  if (koVoices.length === 0) return null;

  if (state.settings.preferredVoiceURI) {
    const matched = koVoices.find((v) => v.voiceURI === state.settings.preferredVoiceURI);
    if (matched) return matched;
  }
  return koVoices[0];
}

/**
 * 한국어 TTS 발음이 뭉개지거나 기계음처럼 끊기는 현상을 막기 위해
 * 기호/구두점을 자연스러운 호흡 휴지(쉼표 등)로 정제합니다.
 */
function normalizeKoreanTextForTTS(rawText) {
  if (!rawText) return "";
  let text = String(rawText)
    // 이모지 및 특수 장식 기호 제거 (TTS가 기호 이름을 읽거나 버퍼가 깨지는 현상 방지)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, " ")
    .replace(/[·•/]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  // 문장 끝 마침표 뒤에 짧은 여백을 두어 어미가 잘리지 않게 처리
  return text;
}

/**
 * 자연스럽고 목소리가 깨지지 않는 한국어 TTS 출력 함수
 * - cancel() 직후 55ms 오디오 버퍼 안정화 지연을 두어 안드로이드/크롬에서 첫 음절이 찢어지는 현상을 방지합니다.
 * - 과도한 저속 재생 시 발생하는 기계음 왜곡(Time-stretching artifact)을 막기 위해 최적 피치와 속도로 보정합니다.
 */
function speakKorean(text, onEndCallback = null) {
  if (!("speechSynthesis" in window)) {
    if (onEndCallback) setTimeout(onEndCallback, 600);
    return;
  }

  const cleanText = normalizeKoreanTextForTTS(text);
  if (!cleanText) {
    if (onEndCallback) onEndCallback();
    return;
  }

  try {
    if (currentSpeechTimeoutId) {
      clearTimeout(currentSpeechTimeoutId);
      currentSpeechTimeoutId = null;
    }

    // 이전 발화가 진행 중이면 정리한 뒤 오디오 버퍼가 닫힐 시간을 확보(55ms)
    const wasSpeaking = window.speechSynthesis.speaking || window.speechSynthesis.pending;
    if (wasSpeaking) {
      window.speechSynthesis.cancel();
    }

    const startDelay = wasSpeaking ? 55 : 15;
    currentSpeechTimeoutId = setTimeout(() => {
      try {
        const utter = new SpeechSynthesisUtterance(cleanText);
        utter.lang = "ko-KR";

        // 0.85 이하에서 일부 모바일 TTS 엔진이 보코더 떨림을 일으키므로 안전 범위로 매핑
        const rawRate = Number(state.settings.ttsRate) || 0.9;
        utter.rate = Math.max(0.75, Math.min(1.15, rawRate));
        utter.pitch = 1.02; // 또렷하고 따뜻한 톤 유지
        utter.volume = 1.0;

        const bestVoice = getBestKoreanVoice();
        if (bestVoice) {
          utter.voice = bestVoice;
          utter.lang = bestVoice.lang || "ko-KR";
        }

        if (onEndCallback) {
          let called = false;
          const safeCallback = () => {
            if (!called) {
              called = true;
              onEndCallback();
            }
          };
          utter.onend = safeCallback;
          utter.onerror = safeCallback;
        }

        window.speechSynthesis.speak(utter);
      } catch (innerErr) {
        console.warn("TTS 발화 오류:", innerErr);
        if (onEndCallback) setTimeout(onEndCallback, 500);
      }
    }, startDelay);
  } catch (e) {
    console.warn("TTS 실행 오류:", e);
    if (onEndCallback) setTimeout(onEndCallback, 600);
  }
}

/* ==========================================================================
   오터치 방지(Debounce / Cooldown) 시각적 프로그레스 바 (기본 2.5초)
   ========================================================================== */
function triggerCooldown(afterCooldownCallback = null) {
  const durationSec = Number(state.settings.cooldownSeconds) || 2.5;
  const durationMs = durationSec * 1000;

  state.isCooldownActive = true;
  const overlay = document.getElementById("cooldown-overlay");
  const timerText = document.getElementById("cooldown-timer-text");
  const barFill = document.getElementById("cooldown-bar-fill");

  overlay.classList.remove("hidden");
  barFill.style.width = "100%";
  timerText.textContent = `${durationSec.toFixed(1)}초`;

  const startTime = performance.now();

  if (state.cooldownIntervalId) clearInterval(state.cooldownIntervalId);
  if (state.cooldownTimerId) clearTimeout(state.cooldownTimerId);

  state.cooldownIntervalId = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, durationMs - elapsed);
    const ratio = (remaining / durationMs) * 100;
    barFill.style.width = `${ratio}%`;
    timerText.textContent = `${(remaining / 1000).toFixed(1)}초`;
  }, 50);

  state.cooldownTimerId = setTimeout(() => {
    clearInterval(state.cooldownIntervalId);
    state.isCooldownActive = false;
    overlay.classList.add("hidden");
    if (afterCooldownCallback) {
      afterCooldownCallback();
    }
  }, durationMs);
}

/* ==========================================================================
   테마 및 상단 내비게이션 업데이트
   ========================================================================== */
function applyTheme(theme) {
  state.settings.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const iconEl = document.getElementById("theme-icon");
  const labelEl = document.getElementById("theme-label");
  if (iconEl && labelEl) {
    if (theme === "dark") {
      iconEl.textContent = "🌙";
      labelEl.textContent = "다크 대비";
    } else {
      iconEl.textContent = "☀️";
      labelEl.textContent = "파스텔";
    }
  }
}

function updateTopBarUI() {
  const topic = getCurrentTopic();
  const badge = document.getElementById("current-topic-badge");
  if (badge) {
    badge.textContent = state.currentStep === 0 ? "오늘의 주제 고르기" : `${topic.icon} ${topic.title}`;
  }

  document.querySelectorAll(".step-tab").forEach((btn) => {
    const step = Number(btn.getAttribute("data-step"));
    btn.classList.toggle("active", step === state.currentStep);
  });
}

function goToStep(stepIndex, speakIntro = true) {
  clearSpeakingTimers();
  state.currentStep = stepIndex;
  state.armedPreviewKey = null;

  if (stepIndex === 0) {
    // 도입(처음)으로 돌아올 때 선택 상태 초기화
    state.selectedMood = null;
    state.selectedDesire = null;
  }

  if (stepIndex === 3) {
    // 3단계 진입 시 2단계에서 직접 고른 핵심 단어를 기본 연습 단어로 설정
    state.writingTargetSource = state.selectedDesire ? "desire" : "mood";
    prepareWritingWord();
  }

  updateTopBarUI();
  renderMainStage();

  if (speakIntro) {
    announceStepGuide(stepIndex);
  }
}

function announceStepGuide(stepIndex) {
  const topic = getCurrentTopic();
  if (stepIndex === 0) {
    speakKorean("오늘 이야기할 주제를 골라 보세요.");
  } else if (stepIndex === 1) {
    speakKorean(`${topic.title}. 나의 기분과 생각을 골라 보세요.`);
  } else if (stepIndex === 2) {
    speakKorean("내가 원하는 것을 골라 보세요.");
  } else if (stepIndex === 3) {
    const targetWord = getActiveWritingWord();
    speakKorean(`오늘 고른 단어, ${targetWord}. 똑같이 따라 써 볼까요?`);
  } else if (stepIndex === 4) {
    speakKorean("내 생각이 완성되었어요. 아래 버튼을 눌러 발표해 보세요.");
  }
}

function getStep1Choices(topic) {
  if (state.settings.step1UseTopicWords && Array.isArray(topic.step1TopicChoices) && topic.step1TopicChoices.length > 0) {
    return topic.step1TopicChoices;
  }
  return FIXED_MOOD_CHOICES;
}

/* ==========================================================================
   단계별 메인 화면 렌더링
   ========================================================================== */
function renderMainStage() {
  const container = document.getElementById("main-stage");
  if (!container) return;

  if (state.currentStep === 0) {
    renderStep0Intro(container);
  } else if (state.currentStep === 1) {
    renderStep1Mood(container);
  } else if (state.currentStep === 2) {
    renderStep2Desire(container);
  } else if (state.currentStep === 3) {
    renderStep3Writing(container);
  } else if (state.currentStep === 4) {
    renderStep4Presentation(container);
  }
}

/**
 * [도입] 오늘의 주제 고르기 (화면 좌우에 주제 카드 2개 제시)
 */
function renderStep0Intro(container) {
  const [leftId, rightId] = state.settings.introPairIds;
  const leftTopic = getTopicById(leftId) || state.topics[0];
  const rightTopic = getTopicById(rightId) || state.topics[1] || state.topics[0];
  const pair = [leftTopic, rightTopic];

  container.innerHTML = `
    <section class="stage-top-panel">
      <div class="step-badge-row">
        <span class="step-indicator-pill">[도입] 오늘의 주제 고르기</span>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="tts-replay-btn" id="btn-shuffle-topics" title="다른 주제 랜덤 뽑기">
            <span>🎲 다른 주제 뽑기</span>
          </button>
          <button type="button" class="tts-replay-btn" id="btn-step-tts">
            <span>🔊 질문 듣기</span>
          </button>
        </div>
      </div>
      <h2 class="prompt-question">오늘 무엇을 이야기할까요?</h2>
      <div class="sentence-frame">
        <span class="sentence-word">오늘의 주제:</span>
        <span class="sentence-blank" id="intro-blank-box">&nbsp;</span>
      </div>
    </section>

    <section class="stage-bottom-choices" aria-label="오늘의 주제 선택">
      <div class="topic-choice-grid">
        ${pair
          .map((t, idx) => {
            const key = `intro_${t.id}_${idx}`;
            const isArmed = state.armedPreviewKey === key;
            const illustHtml = renderHighResIllustration({
              key: t.id,
              word: t.title,
              icon: t.icon,
              accent: t.accent || "sky"
            });
            return `
              <button type="button"
                class="choice-card ${isArmed ? "preview-armed" : ""}"
                data-accent="${t.accent || "sky"}"
                data-topic-id="${t.id}"
                data-preview-key="${key}">
                ${isArmed ? `<span class="preview-confirm-pill">한 번 더 터치하면 선택!</span>` : ""}
                ${illustHtml}
                <div class="card-text-wrap">
                  <span class="card-word-label">${t.title}</span>
                  <span class="card-sub-hint">터치하여 시작하기</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  document.getElementById("btn-shuffle-topics")?.addEventListener("click", () => {
    randomizeIntroTopics();
    renderMainStage();
    speakKorean("새로운 주제를 뽑았어요.");
  });

  document.getElementById("btn-step-tts")?.addEventListener("click", () => {
    speakKorean("오늘 무엇을 이야기할까요? 두 가지 주제 중 하나를 터치해 보세요.");
  });

  container.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (state.isCooldownActive) return;
      const topicId = card.getAttribute("data-topic-id");
      const previewKey = card.getAttribute("data-preview-key");
      const chosenTopic = getTopicById(topicId);

      handleChoiceTouch({
        previewKey,
        wordToSpeak: chosenTopic.title,
        sentenceToSpeak: `${chosenTopic.title} 주제를 골랐어요.`,
        onPreviewUI: () => {
          const blank = document.getElementById("intro-blank-box");
          if (blank) {
            blank.textContent = `${chosenTopic.icon} ${chosenTopic.title}`;
            blank.classList.add("filled");
          }
        },
        onConfirm: () => {
          state.selectedTopicId = chosenTopic.id;
          // 주제 선택 시 1, 2단계 선택값은 아직 선택하지 않은 상태(null)로 비워 둠
          state.selectedMood = null;
          state.selectedDesire = null;
          const blank = document.getElementById("intro-blank-box");
          if (blank) {
            blank.textContent = `${chosenTopic.icon} ${chosenTopic.title}`;
            blank.classList.add("filled");
          }
          card.classList.add("selected-final");
          triggerCooldown(() => {
            goToStep(1, true);
          });
        }
      });
    });
  });
}

/**
 * [1단계] 나의 기분·생각 고르기 (2~4글자 단어)
 * 상단 문장 틀: `[주제 단어]은/는 [ 빈칸 ]`
 */
function renderStep1Mood(container) {
  const topic = getCurrentTopic();
  const particle = topic.particle || getTopicParticle(topic.title);
  const choices = getStep1Choices(topic);
  const currentMoodWord = state.selectedMood ? `${state.selectedMood.icon} ${state.selectedMood.word}` : "&nbsp;";

  container.innerHTML = `
    <section class="stage-top-panel">
      <div class="step-badge-row">
        <span class="step-indicator-pill">[1단계] 나의 기분·생각 고르기</span>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="tts-replay-btn" id="btn-toggle-mood-set" title="고정 4단어 / 주제별 기분 단어 전환">
            <span>🔄 ${state.settings.step1UseTopicWords ? "주제별 기분 어휘" : "기본 4개 고정 어휘"}</span>
          </button>
          <button type="button" class="tts-replay-btn" id="btn-step-tts">
            <span>🔊 문장 듣기</span>
          </button>
        </div>
      </div>
      <h2 class="prompt-question">${topic.step1Prompt || `${topic.title}${particle} 어때요?`}</h2>
      <div class="sentence-frame" id="step1-sentence-frame">
        <span class="sentence-word">${topic.icon} ${topic.title}${particle}</span>
        <span class="sentence-blank ${state.selectedMood ? "filled" : ""}" id="step1-blank">${currentMoodWord}</span>
      </div>
    </section>

    <section class="stage-bottom-choices" aria-label="기분과 생각 단어 4개 선택">
      <div class="word-choice-grid">
        ${choices
          .slice(0, 4)
          .map((item, idx) => {
            const key = `step1_${idx}_${item.word}`;
            const isArmed = state.armedPreviewKey === key;
            const illustHtml = renderHighResIllustration({
              word: item.word,
              icon: item.icon,
              accent: item.accent || "sky"
            });
            return `
              <button type="button"
                class="choice-card ${isArmed ? "preview-armed" : ""}"
                data-accent="${item.accent || "sky"}"
                data-index="${idx}"
                data-preview-key="${key}">
                ${isArmed ? `<span class="preview-confirm-pill">한 번 더 터치!</span>` : ""}
                ${illustHtml}
                <div class="card-text-wrap">
                  <span class="card-word-label">${item.word}</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  document.getElementById("btn-toggle-mood-set")?.addEventListener("click", () => {
    state.settings.step1UseTopicWords = !state.settings.step1UseTopicWords;
    saveSettingsToStorage();
    renderMainStage();
  });

  document.getElementById("btn-step-tts")?.addEventListener("click", () => {
    const moodText = state.selectedMood ? state.selectedMood.word : "어때요";
    speakKorean(`${topic.title}${particle} ${moodText}`);
  });

  container.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (state.isCooldownActive) return;
      const idx = Number(card.getAttribute("data-index"));
      const previewKey = card.getAttribute("data-preview-key");
      const chosen = choices[idx];
      const fullSentence = `${topic.title}${particle} ${chosen.word}.`;

      handleChoiceTouch({
        previewKey,
        wordToSpeak: chosen.word,
        sentenceToSpeak: `${chosen.word}. ${fullSentence}`,
        onPreviewUI: () => {
          const blank = document.getElementById("step1-blank");
          if (blank) {
            blank.textContent = `${chosen.icon} ${chosen.word}`;
            blank.classList.add("filled");
          }
        },
        onConfirm: () => {
          state.selectedMood = chosen;
          const blank = document.getElementById("step1-blank");
          if (blank) {
            blank.textContent = `${chosen.icon} ${chosen.word}`;
            blank.classList.add("filled");
          }
          card.classList.add("selected-final");
          triggerCooldown(() => {
            goToStep(2, true);
          });
        }
      });
    });
  });
}

/**
 * [2단계] 내가 원하는 것 고르기 (2~5글자 핵심 어휘)
 * 상단 문장 틀: `나는 [ 빈칸 ] 할래요`
 */
function renderStep2Desire(container) {
  const topic = getCurrentTopic();
  const choices = topic.step2Choices || [];
  const suffix = topic.step2Suffix || "할래요";
  const currentDesireWord = state.selectedDesire ? `${state.selectedDesire.icon} ${state.selectedDesire.word}` : "&nbsp;";

  container.innerHTML = `
    <section class="stage-top-panel">
      <div class="step-badge-row">
        <span class="step-indicator-pill">[2단계] 내가 원하는 것 고르기</span>
        <button type="button" class="tts-replay-btn" id="btn-step-tts">
          <span>🔊 문장 듣기</span>
        </button>
      </div>
      <h2 class="prompt-question">${topic.step2Prompt || "내가 원하는 것을 골라 보세요"}</h2>
      <div class="sentence-frame">
        <span class="sentence-word">나는</span>
        <span class="sentence-blank ${state.selectedDesire ? "filled" : ""}" id="step2-blank">${currentDesireWord}</span>
        <span class="sentence-word">${suffix}</span>
      </div>
    </section>

    <section class="stage-bottom-choices" aria-label="내가 원하는 것 단어 4개 선택">
      <div class="word-choice-grid">
        ${choices
          .slice(0, 4)
          .map((item, idx) => {
            const key = `step2_${idx}_${item.word}`;
            const isArmed = state.armedPreviewKey === key;
            const illustHtml = renderHighResIllustration({
              word: item.word,
              icon: item.icon,
              accent: item.accent || "emerald"
            });
            return `
              <button type="button"
                class="choice-card ${isArmed ? "preview-armed" : ""}"
                data-accent="${item.accent || "emerald"}"
                data-index="${idx}"
                data-preview-key="${key}">
                ${isArmed ? `<span class="preview-confirm-pill">한 번 더 터치!</span>` : ""}
                ${illustHtml}
                <div class="card-text-wrap">
                  <span class="card-word-label">${item.word}</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;

  document.getElementById("btn-step-tts")?.addEventListener("click", () => {
    const desireSentence = buildStep2Sentence(topic, state.selectedDesire);
    speakKorean(desireSentence);
  });

  container.querySelectorAll(".choice-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (state.isCooldownActive) return;
      const idx = Number(card.getAttribute("data-index"));
      const previewKey = card.getAttribute("data-preview-key");
      const chosen = choices[idx];
      const fullSentence = buildStep2Sentence(topic, chosen);

      handleChoiceTouch({
        previewKey,
        wordToSpeak: chosen.word,
        sentenceToSpeak: `${chosen.word}. ${fullSentence}`,
        onPreviewUI: () => {
          const blank = document.getElementById("step2-blank");
          if (blank) {
            blank.textContent = `${chosen.icon} ${chosen.word}`;
            blank.classList.add("filled");
          }
        },
        onConfirm: () => {
          state.selectedDesire = chosen;
          const blank = document.getElementById("step2-blank");
          if (blank) {
            blank.textContent = `${chosen.icon} ${chosen.word}`;
            blank.classList.add("filled");
          }
          card.classList.add("selected-final");
          triggerCooldown(() => {
            goToStep(3, true);
          });
        }
      });
    });
  });
}

function buildStep2Sentence(topic, desireObj) {
  if (!desireObj) return `나는 무엇을 ${topic.step2Suffix || "할래요"}`;
  if (desireObj.fullLine) return desireObj.fullLine;
  return `나는 ${desireObj.word} ${topic.step2Suffix || "할래요"}.`;
}

/**
 * 1회 터치 즉시 선택 vs 2번 터치(미리듣기 후 확인) 공통 처리기
 */
function handleChoiceTouch({ previewKey, wordToSpeak, sentenceToSpeak, onPreviewUI, onConfirm }) {
  if (state.settings.touchMode === "double") {
    if (state.armedPreviewKey !== previewKey) {
      state.armedPreviewKey = previewKey;
      renderMainStage();
      if (onPreviewUI) onPreviewUI();
      speakKorean(`${wordToSpeak}. 선택하려면 한 번 더 눌러 주세요.`);
      return;
    }
  }

  state.armedPreviewKey = null;
  speakKorean(sentenceToSpeak);
  onConfirm();
}

/* ==========================================================================
   [3단계] 오늘 고른 핵심 단어 보고 따라 쓰기 (모드 A: 자음·모음 글자판 조립 / 모드 B: 손가락 캔버스)
   ========================================================================== */
const HANGUL_CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const HANGUL_JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const HANGUL_JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

// 한글 자음·모음(겹받침 포함) 발음 안내 사전
const JAMO_PRONOUNCE = {
  "ㄱ": "기역", "ㄲ": "쌍기역", "ㄴ": "니은", "ㄷ": "디귿", "ㄸ": "쌍디귿",
  "ㄹ": "리을", "ㅁ": "미음", "ㅂ": "비읍", "ㅃ": "쌍비읍", "ㅅ": "시옷",
  "ㅆ": "쌍시옷", "ㅇ": "이응", "ㅈ": "지읒", "ㅉ": "쌍지읒", "ㅊ": "치읓",
  "ㅋ": "키읔", "ㅌ": "티읕", "ㅍ": "피읖", "ㅎ": "히읗",
  "ㄳ": "기역시옷", "ㄵ": "니은지읒", "ㄶ": "니은히읗", "ㄺ": "리을기역",
  "ㄻ": "리을미음", "ㄼ": "리을비읍", "ㄽ": "리을시옷", "ㄾ": "리을티읕",
  "ㄿ": "리을피읖", "ㅀ": "리을히읗", "ㅄ": "비읍시옷",
  "ㅏ": "아", "ㅐ": "애", "ㅑ": "야", "ㅒ": "얘", "ㅓ": "어", "ㅔ": "에",
  "ㅕ": "여", "ㅖ": "예", "ㅗ": "오", "ㅘ": "와", "ㅙ": "왜", "ㅚ": "외",
  "ㅛ": "요", "ㅜ": "우", "ㅝ": "워", "ㅞ": "웨", "ㅟ": "위", "ㅠ": "유",
  "ㅡ": "으", "ㅢ": "의", "ㅣ": "이"
};

/**
 * 한글 한 음절(예: '좋', '태', '블')을 초성·중성·종성 자모 배열로 분해합니다.
 */
function decomposeHangulSyllable(ch) {
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) {
    return { cho: ch, jung: "", jong: "", steps: [{ type: "cho", label: "글자", jamo: ch }] };
  }
  const offset = code - 0xac00;
  const choIdx = Math.floor(offset / 588);
  const jungIdx = Math.floor((offset % 588) / 28);
  const jongIdx = offset % 28;

  const cho = HANGUL_CHO[choIdx];
  const jung = HANGUL_JUNG[jungIdx];
  const jong = HANGUL_JONG[jongIdx];

  const steps = [
    { type: "cho", label: "자음(초성)", jamo: cho },
    { type: "jung", label: "모음(중성)", jamo: jung }
  ];
  if (jong) {
    steps.push({ type: "jong", label: "받침(종성)", jamo: jong });
  }
  return { cho, jung, jong, steps };
}

/**
 * 현재까지 선택된 자음·모음 단계(enteredSteps)를 조합하여 화면에 실시간 표시할 글자를 반환합니다.
 */
function composePartialHangul(enteredSteps) {
  if (!enteredSteps || enteredSteps.length === 0) return "";
  if (enteredSteps.length === 1) {
    return enteredSteps[0];
  }
  const choIdx = HANGUL_CHO.indexOf(enteredSteps[0]);
  const jungIdx = HANGUL_JUNG.indexOf(enteredSteps[1]);
  if (choIdx < 0 || jungIdx < 0) return enteredSteps.join("");

  let jongIdx = 0;
  if (enteredSteps.length >= 3 && enteredSteps[2]) {
    const foundJong = HANGUL_JONG.indexOf(enteredSteps[2]);
    if (foundJong > 0) jongIdx = foundJong;
  }
  return String.fromCharCode(0xac00 + choIdx * 588 + jungIdx * 28 + jongIdx);
}

/**
 * 뇌성마비 학생이 쉽게 터치할 수 있도록 현재 입력할 자모(정답 1개)와
 * 시각적으로 변별하기 좋은 오답 자모 5개를 합쳐 총 6개(3x2 초대형 버튼)의 글자판 배열을 생성합니다.
 */
function buildAccessibleJamoPad(targetJamo, stepType, seedKey) {
  const isVowel = stepType === "jung";
  const pool = isVowel
    ? ["ㅏ", "ㅐ", "ㅑ", "ㅓ", "ㅔ", "ㅕ", "ㅗ", "ㅘ", "ㅛ", "ㅜ", "ㅝ", "ㅠ", "ㅡ", "ㅣ"]
    : ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㄲ", "ㄸ", "ㅃ", "ㅆ", "ㅉ"];

  const distractors = pool.filter((item) => item !== targetJamo);

  // 시드 기반 결정론적 섞기 (리렌더링 시에도 글자판 위치가 흔들리지 않도록 고정)
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash * 31 + seedKey.charCodeAt(i)) % 1000003;
  }
  const picked = [];
  let cursor = hash;
  while (picked.length < 5 && distractors.length > 0) {
    const idx = cursor % distractors.length;
    picked.push(distractors.splice(idx, 1)[0]);
    cursor = (cursor * 17 + 13) % 1000003;
  }

  const sixKeys = [targetJamo, ...picked];
  // 가나다/모음 순서로 정렬하여 학생이 글자판에서 위치를 예측하고 찾기 쉽게 배치
  sixKeys.sort((a, b) => a.localeCompare(b, "ko"));
  return sixKeys;
}

function getActiveWritingWord() {
  const topic = getCurrentTopic();
  if (state.writingTargetSource === "mood") {
    if (state.selectedMood) return state.selectedMood.word;
    const step1List = getStep1Choices(topic);
    return step1List[0] ? step1List[0].word : "좋아요";
  }
  if (state.selectedDesire) {
    return state.selectedDesire.word;
  }
  if (state.selectedMood) {
    return state.selectedMood.word;
  }
  return topic.step2Choices && topic.step2Choices[0] ? topic.step2Choices[0].word : "좋아요";
}

function getActiveWritingChars() {
  // 공백을 제외한 순수 음절 배열 (2~5글자)
  const raw = getActiveWritingWord().replace(/\s+/g, "");
  return Array.from(raw);
}

function prepareWritingWord() {
  const chars = getActiveWritingChars();
  state.assembledChars = [];
  state.currentJamoSteps = []; // 현재 조립 중인 음절에 입력된 자음/모음 목록
  state.syllableDecompositions = chars.map((ch) => decomposeHangulSyllable(ch));
  state.lastPreparedWord = getActiveWritingWord();
}

function prepareWritingWordIfNeeded(targetWord, chars) {
  if (
    state.lastPreparedWord !== targetWord ||
    !Array.isArray(state.syllableDecompositions) ||
    state.syllableDecompositions.length !== chars.length
  ) {
    prepareWritingWord();
  }
}

function renderStep3Writing(container) {
  const topic = getCurrentTopic();
  const fallbackMoodWord = getStep1Choices(topic)[0] ? getStep1Choices(topic)[0].word : "좋아요";
  const fallbackDesireWord = topic.step2Choices && topic.step2Choices[0] ? topic.step2Choices[0].word : "더 할래요";
  const moodWord = state.selectedMood ? state.selectedMood.word : fallbackMoodWord;
  const desireWord = state.selectedDesire ? state.selectedDesire.word : fallbackDesireWord;
  const targetWord = getActiveWritingWord();
  const chars = getActiveWritingChars();

  prepareWritingWordIfNeeded(targetWord, chars);

  const currentSylIdx = state.assembledChars.length;
  const isAllCompleted = currentSylIdx >= chars.length;
  const currentDecomp = !isAllCompleted ? state.syllableDecompositions[currentSylIdx] : null;
  const currentJamoStepIdx = state.currentJamoSteps ? state.currentJamoSteps.length : 0;
  const activeStepInfo = currentDecomp ? currentDecomp.steps[currentJamoStepIdx] : null;

  // 현재 단계의 6키 대형 자음/모음 글자판 생성
  const jamoPadKeys = activeStepInfo
    ? buildAccessibleJamoPad(
        activeStepInfo.jamo,
        activeStepInfo.type,
        `${targetWord}_${currentSylIdx}_${currentJamoStepIdx}`
      )
    : [];

  container.innerHTML = `
    <section class="stage-top-panel">
      <div class="writing-header-controls">
        <!-- 연습할 단어 전환 (1단계 단어 vs 2단계 단어) -->
        <div class="word-switch-tabs" role="group" aria-label="연습할 단어 선택">
          <button type="button" class="switch-pill-btn ${state.writingTargetSource === "mood" ? "active" : ""}" id="btn-write-mood">
            1단계 단어: <strong>${moodWord}</strong>
          </button>
          <button type="button" class="switch-pill-btn ${state.writingTargetSource === "desire" ? "active" : ""}" id="btn-write-desire">
            2단계 단어: <strong>${desireWord}</strong>
          </button>
        </div>

        <!-- 교사/학생 모드 전환 탭 (모드 A vs 모드 B) -->
        <div class="mode-switch-tabs" role="group" aria-label="쓰기 연습 모드 전환">
          <button type="button" class="switch-pill-btn ${state.writingMode === "block" ? "active" : ""}" id="btn-mode-block">
            ⌨️ 모드 A: 자음·모음 글자판
          </button>
          <button type="button" class="switch-pill-btn ${state.writingMode === "canvas" ? "active" : ""}" id="btn-mode-canvas">
            ✍️ 모드 B: 손가락 따라 쓰기
          </button>
        </div>
      </div>

      ${
        state.writingMode === "block"
          ? `
        <div class="model-word-showcase">
          <div class="syllable-target-row">
            ${chars
              .map((ch, idx) => {
                const isFilled = idx < state.assembledChars.length;
                const isCurrent = idx === state.assembledChars.length;
                let slotText = "&nbsp;";
                if (isFilled) {
                  slotText = state.assembledChars[idx];
                } else if (isCurrent && state.currentJamoSteps.length > 0) {
                  slotText = composePartialHangul(state.currentJamoSteps);
                }

                // 현재 조립 중인 글자의 자모 분해 배지 표시 (예: ㅌ + ㅐ)
                const decomp = state.syllableDecompositions[idx];
                const jamoFormulaHtml = decomp.steps
                  .map((st, sIdx) => {
                    let pillState = "";
                    if (isFilled || (isCurrent && sIdx < currentJamoStepIdx)) {
                      pillState = "done";
                    } else if (isCurrent && sIdx === currentJamoStepIdx) {
                      pillState = "active-step";
                    }
                    return `<span class="jamo-step-chip ${pillState}">${st.jamo}</span>`;
                  })
                  .join(`<span class="jamo-plus">+</span>`);

                return `
                  <div class="syllable-slot-group ${isCurrent ? "focus-group" : ""}">
                    <div class="syllable-model-card" aria-label="보고 쓸 글자 ${ch}">${ch}</div>
                    <div class="jamo-formula-bar" aria-label="자음 모음 구성">${jamoFormulaHtml}</div>
                    <div class="syllable-drop-slot ${isFilled ? "filled" : ""} ${isCurrent ? "current-target" : ""}" data-slot-index="${idx}">
                      ${slotText}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `
          : `
        <div class="model-word-showcase">
          <p class="prompt-question">회색 글자를 따라 손가락으로 천천히 그어 보세요: <strong style="color:var(--accent-sky)">${targetWord}</strong></p>
        </div>
      `
      }
    </section>

    <section class="stage-bottom-choices" aria-label="단어 쓰기 활동 영역">
      ${
        state.writingMode === "block"
          ? `
        <div class="jamo-keyboard-container">
          ${
            !isAllCompleted && activeStepInfo
              ? `
            <div class="jamo-Board-header">
              <span class="jamo-board-type-pill ${activeStepInfo.type === "jung" ? "vowel" : "consonant"}">
                ${activeStepInfo.type === "cho" ? "1. 첫소리 자음 고르기" : activeStepInfo.type === "jung" ? "2. 모음 고르기" : "3. 받침 자음 고르기"}
              </span>
              <span class="jamo-board-guide">
                <strong>'${chars[currentSylIdx]}'</strong> 글자의 <strong class="highlight-target-jamo">[ ${activeStepInfo.jamo} ]</strong> 버튼을 터치해 보세요
              </span>
            </div>

            <div class="jamo-pad-grid" role="group" aria-label="${activeStepInfo.label} 글자판">
              ${jamoPadKeys
                .map((keyChar) => {
                  const isTarget = keyChar === activeStepInfo.jamo;
                  const keyTypeClass = activeStepInfo.type === "jung" ? "vowel-key" : "consonant-key";
                  return `
                    <button type="button"
                      class="jamo-key-btn ${keyTypeClass} ${isTarget ? "target-hint-key" : ""}"
                      data-jamo="${keyChar}">
                      <span class="jamo-key-char">${keyChar}</span>
                      <span class="jamo-key-sub">${JAMO_PRONOUNCE[keyChar] || ""}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          `
              : `
            <div class="jamo-complete-banner">
              <span class="complete-Main-text">🎉 <strong>'${targetWord}'</strong> 모든 자음과 모음을 완성했어요!</span>
            </div>
          `
          }

          <div class="writing-bottom-actions">
            <button type="button" class="big-stage-btn amber" id="btn-block-backspace">
              <span>⬅️ 한 칸 지우기 / 처음부터</span>
            </button>
            <button type="button" class="big-stage-btn sky" id="btn-block-speak">
              <span>🔊 단어 듣기</span>
            </button>
            <button type="button" class="big-stage-btn emerald" id="btn-go-step4">
              <span>✓ 완성! 발표하러 가기 ➡️</span>
            </button>
          </div>
        </div>
      `
          : `
        <div class="canvas-board-wrapper">
          <div class="canvas-frame" id="canvas-frame">
            <canvas id="tracing-canvas" class="tracing-canvas"></canvas>
          </div>
          <div class="writing-bottom-actions">
            <button type="button" class="big-stage-btn amber" id="btn-canvas-clear">
              <span>🧹 지우고 다시 쓰기</span>
            </button>
            <button type="button" class="big-stage-btn sky" id="btn-canvas-speak">
              <span>🔊 단어 듣기</span>
            </button>
            <button type="button" class="big-stage-btn emerald" id="btn-go-step4">
              <span>✓ 완성! 발표하러 가기 ➡️</span>
            </button>
          </div>
        </div>
      `
      }
    </section>
  `;

  // 상단 탭 이벤트 바인딩
  document.getElementById("btn-write-mood")?.addEventListener("click", () => {
    state.writingTargetSource = "mood";
    prepareWritingWord();
    renderMainStage();
    speakKorean(getActiveWritingWord());
  });

  document.getElementById("btn-write-desire")?.addEventListener("click", () => {
    state.writingTargetSource = "desire";
    prepareWritingWord();
    renderMainStage();
    speakKorean(getActiveWritingWord());
  });

  document.getElementById("btn-mode-block")?.addEventListener("click", () => {
    state.writingMode = "block";
    prepareWritingWord();
    renderMainStage();
    speakKorean("자음과 모음을 하나씩 골라 글자를 만드는 모드예요.");
  });

  document.getElementById("btn-mode-canvas")?.addEventListener("click", () => {
    state.writingMode = "canvas";
    renderMainStage();
    speakKorean("손가락으로 따라 쓰기 모드예요.");
  });

  document.getElementById("btn-go-step4")?.addEventListener("click", () => {
    if (state.isCooldownActive) return;
    speakKorean(`${targetWord} 쓰기 완성! 이제 내 생각을 발표해 볼까요?`);
    triggerCooldown(() => {
      goToStep(4, true);
    });
  });

  if (state.writingMode === "block") {
    bindModeAJamoPadEvents(chars, targetWord);
  } else {
    initModeBCanvas(targetWord);
  }
}

/**
 * 모드 A: 자음·모음 글자판에서 하나씩 선택하여 음절 및 단어 완성
 */
function bindModeAJamoPadEvents(chars, targetWord) {
  document.getElementById("btn-block-backspace")?.addEventListener("click", () => {
    if (state.isCooldownActive) return;
    if (state.currentJamoSteps && state.currentJamoSteps.length > 0) {
      state.currentJamoSteps.pop();
      renderMainStage();
      speakKorean("방금 고른 글자를 지웠어요.");
    } else if (state.assembledChars.length > 0) {
      state.assembledChars.pop();
      state.currentJamoSteps = [];
      renderMainStage();
      speakKorean("이전 글자로 돌아왔어요.");
    } else {
      prepareWritingWord();
      renderMainStage();
      speakKorean("처음부터 다시 조립해 볼까요?");
    }
  });

  document.getElementById("btn-block-speak")?.addEventListener("click", () => {
    speakKorean(targetWord);
  });

  document.querySelectorAll(".jamo-key-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.isCooldownActive) return;
      const currentSylIdx = state.assembledChars.length;
      if (currentSylIdx >= chars.length) return;

      const decomp = state.syllableDecompositions[currentSylIdx];
      const stepIdx = state.currentJamoSteps.length;
      const expectedStep = decomp.steps[stepIdx];
      if (!expectedStep) return;

      const clickedJamo = btn.getAttribute("data-jamo");
      const jamoSpeak = JAMO_PRONOUNCE[clickedJamo] || clickedJamo;

      if (clickedJamo === expectedStep.jamo) {
        state.currentJamoSteps.push(clickedJamo);

        // 현재 음절의 모든 자모(초성+중성+(종성))가 모두 채워졌는지 확인
        if (state.currentJamoSteps.length === decomp.steps.length) {
          const completedSyllable = chars[currentSylIdx];
          state.assembledChars.push(completedSyllable);
          state.currentJamoSteps = [];
          renderMainStage();

          if (state.assembledChars.length === chars.length) {
            speakKorean(`${jamoSpeak}! ${completedSyllable}! ${targetWord} 완성! 참 잘했어요!`);
            launchConfetti(2200);
            triggerCooldown();
          } else {
            speakKorean(`${jamoSpeak}! ${completedSyllable} 완성!`);
            triggerCooldown();
          }
        } else {
          // 아직 음절 조립 중 (예: 초성 선택 완료 -> 이제 모음 선택 단계로 전환)
          renderMainStage();
          const nextStep = decomp.steps[state.currentJamoSteps.length];
          const nextStepSpeak = JAMO_PRONOUNCE[nextStep.jamo] || nextStep.jamo;
          speakKorean(`${jamoSpeak}. 이제 ${nextStepSpeak} 글자를 눌러 보세요.`);
          triggerCooldown();
        }
      } else {
        // 다른 자음/모음을 눌렀을 때 친절하게 안내하고 버튼 흔들림 피드백
        btn.classList.add("wrong-shake");
        setTimeout(() => btn.classList.remove("wrong-shake"), 500);
        const targetSpeak = JAMO_PRONOUNCE[expectedStep.jamo] || expectedStep.jamo;
        speakKorean(`${jamoSpeak} 말고, 반짝이는 ${targetSpeak} 버튼을 눌러 보세요.`);
      }
    });
  });
}

/**
 * 모드 B: 회색 가이드라인 글자 위에 손가락으로 그으면 굵고 반짝이는 선으로 써지는 캔버스
 */
function initModeBCanvas(targetWord) {
  const canvas = document.getElementById("tracing-canvas");
  const frame = document.getElementById("canvas-frame");
  if (!canvas || !frame) return;

  const ctx = canvas.getContext("2d");
  const rect = frame.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;

  const drawGuideWord = () => {
    ctx.clearRect(0, 0, width, height);

    // 점선 십자 가이드 보조선
    ctx.save();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(24, height / 2);
    ctx.lineTo(width - 24, height / 2);
    ctx.stroke();
    ctx.restore();

    // 큼직한 회색 글자 가이드라인 (획 겹침 깨짐 없이 선명한 700 굵기 사용)
    ctx.save();
    const fontSize = Math.min(165, Math.floor((width * 0.8) / Math.max(2, targetWord.length)));
    ctx.font = `700 ${fontSize}px "Pretendard Variable", "Pretendard", "Noto Sans KR", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = state.settings.theme === "dark" ? "rgba(203, 213, 225, 0.28)" : "rgba(51, 65, 85, 0.24)";
    ctx.fillText(targetWord, width / 2, height / 2 + 6);
    ctx.restore();
  };

  drawGuideWord();

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let hue = 195;

  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
    };
  };

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;

    // 터치 시작점에도 굵은 반짝이 점 찍기
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = `hsl(${hue}, 95%, 65%)`;
    ctx.shadowColor = `hsl(${hue}, 95%, 60%)`;
    ctx.shadowBlur = 18;
    ctx.arc(lastX, lastY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = `hsl(${hue}, 95%, 65%)`;
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = `hsl(${hue}, 95%, 60%)`;
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    hue = (hue + 2) % 360;
    lastX = pos.x;
    lastY = pos.y;
  });

  const endDrawing = () => {
    isDrawing = false;
  };

  canvas.addEventListener("pointerup", endDrawing);
  canvas.addEventListener("pointercancel", endDrawing);
  canvas.addEventListener("pointerleave", endDrawing);

  document.getElementById("btn-canvas-clear")?.addEventListener("click", () => {
    drawGuideWord();
    speakKorean("깨끗하게 지웠어요. 다시 따라 써 보세요.");
  });

  document.getElementById("btn-canvas-speak")?.addEventListener("click", () => {
    speakKorean(targetWord);
  });
}

/* ==========================================================================
   [4단계] 완성된 내 생각 발표하기 (최종 2줄 카드 + 어절 하이라이트 + 폭죽 효과)
   ========================================================================== */
function clearSpeakingTimers() {
  state.speakingHighlightTimers.forEach((id) => clearTimeout(id));
  state.speakingHighlightTimers = [];
}

function renderStep4Presentation(container) {
  const topic = getCurrentTopic();
  const particle = topic.particle || getTopicParticle(topic.title);
  const moodObj = state.selectedMood || getStep1Choices(topic)[0];
  const desireObj = state.selectedDesire || topic.step2Choices[0];

  // 1번째 줄 어절 구성: 예) ["급식 시간은", "좋아요."]
  const line1Tokens = [
    { text: `${topic.title}${particle}`, isKey: false },
    { text: `${moodObj.word}.`, isKey: true }
  ];

  // 2번째 줄 어절 구성: 예) ["나는", "고기반찬", "먹을래요."]
  const suffix = topic.step2Suffix || "할래요";
  const line2Tokens = [
    { text: "나는", isKey: false },
    { text: desireObj.word, isKey: true },
    { text: `${suffix}.`, isKey: false }
  ];

  const allTokens = [...line1Tokens, ...line2Tokens];

  const topicSvg = resolveIllustrationSvg(topic.id, topic.title, topic.icon);
  const moodSvg = resolveIllustrationSvg("", moodObj.word, moodObj.icon);
  const desireSvg = resolveIllustrationSvg("", desireObj.word, desireObj.icon);

  const topicChipHtml = `<span class="final-illust-chip">${topicSvg}</span>`;
  // 주제 일러스트와 기분 일러스트가 동일할 경우(예: 오늘 날씨 + 맑아요) 중복 표시하지 않고 깔끔하게 하나로 표시
  const moodChipHtml = moodSvg !== topicSvg ? `<span class="final-illust-chip">${moodSvg}</span>` : "";
  const desireChipHtml = `<span class="final-illust-chip">${desireSvg}</span>`;

  container.innerHTML = `
    <section class="stage-top-panel">
      <div class="step-badge-row">
        <span class="step-indicator-pill">[4단계] 완성된 내 생각 발표하기</span>
        <span style="font-size:24px; color:var(--accent-emerald);">🎉 오늘 나의 생각을 멋지게 완성했어요!</span>
      </div>

      <div class="final-presentation-card" aria-live="polite">
        <div class="final-line">
          ${topicChipHtml} ${moodChipHtml}
          ${line1Tokens
            .map(
              (tok, idx) =>
                `<span class="speech-token ${tok.isKey ? "key-word" : ""}" data-token-idx="${idx}">${tok.text}</span>`
            )
            .join("")}
        </div>
        <div class="final-line">
          ${desireChipHtml}
          ${line2Tokens
            .map(
              (tok, idx) =>
                `<span class="speech-token ${tok.isKey ? "key-word" : ""}" data-token-idx="${line1Tokens.length + idx}">${tok.text}</span>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <section class="stage-bottom-choices" aria-label="내 생각 발표하기 버튼">
      <div class="final-bottom-grid">
        <button type="button" class="megaphone-btn" id="btn-announce-aloud">
          <span>소리 내어 발표하기 🔊</span>
        </button>
        <button type="button" class="big-stage-btn amber" id="btn-restart-routine">
          <span>🔄 처음부터 또 하기</span>
        </button>
      </div>
    </section>
  `;

  document.getElementById("btn-announce-aloud")?.addEventListener("click", () => {
    if (state.isCooldownActive) return;
    playHighlightedPresentation(allTokens);
    launchConfetti(3600);
    triggerCooldown();
  });

  document.getElementById("btn-restart-routine")?.addEventListener("click", () => {
    if (state.isCooldownActive) return;
    triggerCooldown(() => {
      goToStep(0, true);
    });
  });
}

function playHighlightedPresentation(tokens) {
  clearSpeakingTimers();
  const tokenEls = document.querySelectorAll(".speech-token");
  tokenEls.forEach((el) => el.classList.remove("speaking-now"));

  // 첫 번째 문장과 두 번째 문장 사이에 자연스러운 쉼표 호흡을 넣어 억양과 끊어읽기를 정교화
  const line1Text = `${tokens[0]?.text || ""} ${tokens[1]?.text || ""}`.trim();
  const line2Text = tokens
    .slice(2)
    .map((t) => t.text)
    .join(" ")
    .trim();
  const naturalFullText = `${line1Text}.. ${line2Text}`;
  speakKorean(naturalFullText);

  const stepInterval = Math.round(660 / (Number(state.settings.ttsRate) || 0.9));
  tokens.forEach((_, idx) => {
    // 2번째 줄 시작 시 문장 간 호흡(약 220ms)을 반영해 하이라이트 싱크를 맞춤
    const extraPause = idx >= 2 ? 220 : 0;
    const timerId = setTimeout(() => {
      tokenEls.forEach((el) => el.classList.remove("speaking-now"));
      const currentEl = document.querySelector(`.speech-token[data-token-idx="${idx}"]`);
      if (currentEl) currentEl.classList.add("speaking-now");
    }, idx * stepInterval + extraPause);
    state.speakingHighlightTimers.push(timerId);
  });

  const endTimerId = setTimeout(() => {
    tokenEls.forEach((el) => el.classList.remove("speaking-now"));
  }, tokens.length * stepInterval + 850);
  state.speakingHighlightTimers.push(endTimerId);
}

/* ==========================================================================
   축하 폭죽 애니메이션 (Confetti Canvas)
   ========================================================================== */
function launchConfetti(durationMs = 3000) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#818cf8", "#c084fc"];
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 180,
    size: 10 + Math.random() * 12,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedX: (Math.random() - 0.5) * 6,
    speedY: 3 + Math.random() * 5,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10
  }));

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

/* ==========================================================================
   상시 의사표현 바 (Quick AAC Bar) 즉시 음성 출력 모달
   ========================================================================== */
function initQuickAacBar() {
  const modal = document.getElementById("aac-modal");
  const iconEl = document.getElementById("aac-modal-icon");
  const wordEl = document.getElementById("aac-modal-word");
  const descEl = document.getElementById("aac-modal-desc");
  const repeatBtn = document.getElementById("btn-aac-repeat");
  const closeBtn = document.getElementById("btn-aac-close");

  let activeSentence = "";

  document.querySelectorAll(".quick-aac-btn").forEach((btn) => {
    const aacWord = btn.getAttribute("data-aac");
    const aacIcon = btn.getAttribute("data-icon");
    const emojiSpan = btn.querySelector(".aac-emoji");
    if (emojiSpan) {
      emojiSpan.outerHTML = `<span class="aac-illust-frame" aria-hidden="true">${resolveIllustrationSvg("", aacWord, aacIcon)}</span>`;
    }

    btn.addEventListener("click", () => {
      const word = btn.getAttribute("data-aac");
      const sentence = btn.getAttribute("data-sentence");
      const icon = btn.getAttribute("data-icon");
      const color = btn.getAttribute("data-color") || "amber";

      activeSentence = `${word}. ${sentence}`;
      iconEl.innerHTML = renderHighResIllustration({
        word,
        icon,
        accent: color
      });
      wordEl.textContent = word;
      descEl.textContent = `"${sentence}"`;

      modal.classList.remove("hidden");
      speakKorean(activeSentence);
    });
  });

  repeatBtn?.addEventListener("click", () => {
    if (activeSentence) speakKorean(activeSentence);
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

/* ==========================================================================
   교사용 간편 편집 및 설정 모달 (쿨다운 조절, 1회/2회 터치 전환, 주제/어휘 수정 및 추가)
   ========================================================================== */
function initTeacherModal() {
  const modal = document.getElementById("teacher-modal");
  const openBtn = document.getElementById("btn-teacher-modal");
  const closeBtn = document.getElementById("btn-teacher-close");
  const applyBtn = document.getElementById("btn-apply-and-close");

  const cooldownRange = document.getElementById("input-cooldown");
  const cooldownLabel = document.getElementById("label-cooldown-val");
  const ttsRange = document.getElementById("input-tts-rate");
  const ttsLabel = document.getElementById("label-tts-rate");
  const touchModeGroup = document.getElementById("touch-mode-group");

  const selectLeft = document.getElementById("select-topic-left");
  const selectRight = document.getElementById("select-topic-right");
  const selectVoice = document.getElementById("select-tts-voice");
  const testVoiceBtn = document.getElementById("btn-test-voice");

  const addTopicBtn = document.getElementById("btn-add-topic");
  const resetDefaultsBtn = document.getElementById("btn-reset-defaults");

  const populateVoiceSelect = () => {
    if (!selectVoice) return;
    const koVoices = getRankedKoreanVoices();
    if (koVoices.length === 0) {
      selectVoice.innerHTML = `<option value="">기기 기본 한국어 음성</option>`;
      return;
    }
    selectVoice.innerHTML = [
      `<option value="">✨ 최고 음질 자동 선택 (${koVoices[0].name})</option>`,
      ...koVoices.map((v) => `<option value="${v.voiceURI}">${v.name} (${v.lang})</option>`)
    ].join("");
    selectVoice.value = state.settings.preferredVoiceURI || "";
  };

  const syncModalControls = () => {
    cooldownRange.value = state.settings.cooldownSeconds;
    cooldownLabel.textContent = `${Number(state.settings.cooldownSeconds).toFixed(1)}초`;

    ttsRange.value = state.settings.ttsRate;
    ttsLabel.textContent = `${Number(state.settings.ttsRate).toFixed(2)}배속`;

    touchModeGroup.querySelectorAll(".toggle-opt").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-mode") === state.settings.touchMode);
    });

    populateVoiceSelect();
    populatePairSelects();
    renderTeacherTopicEditor();
  };

  const populatePairSelects = () => {
    const optionsHtml = state.topics
      .map((t) => `<option value="${t.id}">${t.icon} ${t.title}</option>`)
      .join("");
    selectLeft.innerHTML = optionsHtml;
    selectRight.innerHTML = optionsHtml;

    selectLeft.value = state.settings.introPairIds[0] || state.topics[0].id;
    selectRight.value = state.settings.introPairIds[1] || (state.topics[1] ? state.topics[1].id : state.topics[0].id);
  };

  openBtn?.addEventListener("click", () => {
    syncModalControls();
    modal.classList.remove("hidden");
  });

  const closeAndRefresh = () => {
    saveSettingsToStorage();
    saveTopicsToStorage();
    modal.classList.add("hidden");
    updateTopBarUI();
    renderMainStage();
  };

  closeBtn?.addEventListener("click", closeAndRefresh);
  applyBtn?.addEventListener("click", closeAndRefresh);

  cooldownRange?.addEventListener("input", () => {
    state.settings.cooldownSeconds = Number(cooldownRange.value);
    cooldownLabel.textContent = `${state.settings.cooldownSeconds.toFixed(1)}초`;
    saveSettingsToStorage();
  });

  ttsRange?.addEventListener("input", () => {
    state.settings.ttsRate = Number(ttsRange.value);
    ttsLabel.textContent = `${state.settings.ttsRate.toFixed(2)}배속`;
    saveSettingsToStorage();
  });

  touchModeGroup?.querySelectorAll(".toggle-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.settings.touchMode = btn.getAttribute("data-mode");
      touchModeGroup.querySelectorAll(".toggle-opt").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      saveSettingsToStorage();
    });
  });

  selectLeft?.addEventListener("change", () => {
    state.settings.introPairIds[0] = selectLeft.value;
    saveSettingsToStorage();
  });

  selectRight?.addEventListener("change", () => {
    state.settings.introPairIds[1] = selectRight.value;
    saveSettingsToStorage();
  });

  selectVoice?.addEventListener("change", () => {
    state.settings.preferredVoiceURI = selectVoice.value;
    saveSettingsToStorage();
  });

  testVoiceBtn?.addEventListener("click", () => {
    speakKorean("안녕하세요. 오늘 나의 기분과 생각을 이야기해 볼까요?");
  });

  addTopicBtn?.addEventListener("click", () => {
    const newId = `custom_${Date.now()}`;
    const newTopic = {
      id: newId,
      title: "새 주제",
      particle: "는",
      icon: "⭐",
      accent: "sky",
      step1Prompt: "기분이 어때요?",
      step1TopicChoices: [
        { word: "좋아요", icon: "😊", accent: "emerald" },
        { word: "싫어요", icon: "🙅", accent: "rose" },
        { word: "재밌어요", icon: "😄", accent: "sky" },
        { word: "힘들어요", icon: "💦", accent: "amber" }
      ],
      step2Prompt: "무엇을 할까요?",
      step2Suffix: "할래요",
      step2Choices: [
        { word: "더 할래요", icon: "➕", accent: "emerald" },
        { word: "그만할래요", icon: "✋", accent: "rose" },
        { word: "도와주세요", icon: "🤝", accent: "sky" },
        { word: "기다려요", icon: "⏳", accent: "amber" }
      ]
    };
    state.topics.push(newTopic);
    state.editingTopicId = newId;
    saveTopicsToStorage();
    populatePairSelects();
    renderTeacherTopicEditor();
  });

  resetDefaultsBtn?.addEventListener("click", () => {
    state.topics = structuredClone(DEFAULT_TOPICS);
    state.settings = { ...DEFAULT_SETTINGS };
    state.selectedTopicId = state.topics[0].id;
    state.editingTopicId = state.topics[0].id;
    saveTopicsToStorage();
    saveSettingsToStorage();
    syncModalControls();
  });
}

function renderTeacherTopicEditor() {
  const listEl = document.getElementById("teacher-topic-list");
  const formEl = document.getElementById("teacher-topic-form");
  if (!listEl || !formEl) return;

  listEl.innerHTML = state.topics
    .map(
      (t) => `
      <button type="button" class="topic-list-item ${t.id === state.editingTopicId ? "active" : ""}" data-edit-id="${t.id}">
        <span>${t.icon} ${t.title}</span>
        <span style="font-size:13px; color:var(--text-muted);">편집</span>
      </button>
    `
    )
    .join("");

  listEl.querySelectorAll(".topic-list-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.editingTopicId = btn.getAttribute("data-edit-id");
      renderTeacherTopicEditor();
    });
  });

  const topic = getTopicById(state.editingTopicId);
  if (!topic) return;

  formEl.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <strong style="font-size:20px;">${topic.icon} [${topic.title}] 어휘 편집 (2~5글자 권장)</strong>
      <button type="button" class="small-btn accent-btn" id="btn-start-this-topic">이 주제로 바로 수업 시작 ▶️</button>
    </div>

    <div class="form-row-grid">
      <div>
        <label style="font-size:14px; color:var(--text-secondary);">아이콘(이모지)</label>
        <input type="text" class="teacher-input" id="edit-topic-icon" value="${topic.icon}" maxlength="4">
      </div>
      <div>
        <label style="font-size:14px; color:var(--text-secondary);">주제 이름 (2~5글자)</label>
        <input type="text" class="teacher-input" id="edit-topic-title" value="${topic.title}" maxlength="8">
      </div>
      <div>
        <label style="font-size:14px; color:var(--text-secondary);">2단계 서술어 꼬리말</label>
        <input type="text" class="teacher-input" id="edit-topic-suffix" value="${topic.step2Suffix || "할래요"}" maxlength="6">
      </div>
    </div>

    <div>
      <label style="font-size:15px; color:var(--accent-sky); display:block; margin-bottom:8px;">
        1단계 기분·생각 단어 4개 (2~5글자)
      </label>
      <div class="word-edit-grid">
        ${topic.step1TopicChoices
          .slice(0, 4)
          .map(
            (c, i) => `
          <div class="word-input-pair">
            <input type="text" class="teacher-input step1-icon-in" data-idx="${i}" value="${c.icon}" maxlength="4" title="아이콘">
            <input type="text" class="teacher-input step1-word-in" data-idx="${i}" value="${c.word}" maxlength="6" placeholder="2~5글자 단어">
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div>
      <label style="font-size:15px; color:var(--accent-emerald); display:block; margin-bottom:8px;">
        2단계 내가 원하는 것 단어 4개 (2~5글자)
      </label>
      <div class="word-edit-grid">
        ${topic.step2Choices
          .slice(0, 4)
          .map(
            (c, i) => `
          <div class="word-input-pair">
            <input type="text" class="teacher-input step2-icon-in" data-idx="${i}" value="${c.icon}" maxlength="4" title="아이콘">
            <input type="text" class="teacher-input step2-word-in" data-idx="${i}" value="${c.word}" maxlength="6" placeholder="2~5글자 단어">
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  document.getElementById("btn-start-this-topic")?.addEventListener("click", () => {
    state.selectedTopicId = topic.id;
    state.selectedMood = null;
    state.selectedDesire = null;
    document.getElementById("teacher-modal")?.classList.add("hidden");
    goToStep(1, true);
  });

  document.getElementById("edit-topic-icon")?.addEventListener("input", (e) => {
    topic.icon = e.target.value.trim() || "💬";
    saveTopicsToStorage();
  });

  document.getElementById("edit-topic-title")?.addEventListener("input", (e) => {
    topic.title = e.target.value.trim() || "주제";
    topic.particle = getTopicParticle(topic.title);
    saveTopicsToStorage();
  });

  document.getElementById("edit-topic-suffix")?.addEventListener("input", (e) => {
    topic.step2Suffix = e.target.value.trim() || "할래요";
    saveTopicsToStorage();
  });

  formEl.querySelectorAll(".step1-icon-in").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.getAttribute("data-idx"));
      topic.step1TopicChoices[idx].icon = input.value.trim() || "😊";
      saveTopicsToStorage();
    });
  });

  formEl.querySelectorAll(".step1-word-in").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.getAttribute("data-idx"));
      topic.step1TopicChoices[idx].word = input.value.trim() || "좋아요";
      saveTopicsToStorage();
    });
  });

  formEl.querySelectorAll(".step2-icon-in").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.getAttribute("data-idx"));
      topic.step2Choices[idx].icon = input.value.trim() || "✨";
      saveTopicsToStorage();
    });
  });

  formEl.querySelectorAll(".step2-word-in").forEach((input) => {
    input.addEventListener("input", () => {
      const idx = Number(input.getAttribute("data-idx"));
      const val = input.value.trim() || "할래요";
      topic.step2Choices[idx].word = val;
      topic.step2Choices[idx].fullLine = `나는 ${val} ${topic.step2Suffix || "할래요"}.`;
      saveTopicsToStorage();
    });
  });
}

/* ==========================================================================
   앱 시작 및 이벤트 바인딩
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();

  // 상단 홈 로고 클릭 시 도입 단계로 이동
  document.getElementById("btn-home-reset")?.addEventListener("click", () => {
    if (state.isCooldownActive) return;
    goToStep(0, true);
  });

  // 상단 4단계 탭 직접 이동
  document.querySelectorAll(".step-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.isCooldownActive) return;
      const targetStep = Number(btn.getAttribute("data-step"));
      goToStep(targetStep, true);
    });
  });

  // 테마 토글 버튼 (모던 다크 대비 <-> 모던 파스텔)
  document.getElementById("btn-theme-toggle")?.addEventListener("click", () => {
    const nextTheme = state.settings.theme === "dark" ? "pastel" : "dark";
    applyTheme(nextTheme);
    saveSettingsToStorage();
    if (state.currentStep === 3 && state.writingMode === "canvas") {
      renderMainStage();
    }
  });

  // 안드로이드 태블릿 전체화면(Fullscreen) 전환 & 화면 꺼짐 방지(WakeLock) & 우클릭/길게누르기 메뉴 차단
  initAndroidTabletOptimizations();

  initQuickAacBar();
  initTeacherModal();

  // 최초 진입: [도입] 오늘의 주제 고르기 화면 렌더링
  goToStep(0, false);
});

/**
 * 안드로이드 태블릿 PC 최적화:
 * 1. 전체화면(Fullscreen) 원터치 토글 (브라우저 주소창 제거)
 * 2. 구축으로 인해 손가락이 화면에 길게 머물 때 뜨는 안드로이드 컨텍스트 메뉴(길게 누르기 팝업) 원천 차단
 * 3. 40분 수업 중 태블릿 화면 자동 꺼짐 방지 (Screen Wake Lock API)
 * 4. 안드로이드 Chrome 한국어 TTS 음성 엔진 사전 로드(Warm-up)
 */
function initAndroidTabletOptimizations() {
  // 길게 누르기(롱프레스) 시 컨텍스트 메뉴 차단 (교사 입력창 제외)
  window.addEventListener(
    "contextmenu",
    (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "SELECT")) return;
      e.preventDefault();
    },
    { passive: false }
  );

  // 안드로이드 TTS 음성 목록 사전 로드
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // 전체화면 버튼 바인딩
  const fsBtn = document.getElementById("btn-fullscreen-toggle");
  const fsLabel = document.getElementById("fullscreen-label");
  const updateFsUI = () => {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    if (fsLabel) {
      fsLabel.textContent = isFs ? "화면 축소" : "전체화면";
    }
    if (state.currentStep === 3 && state.writingMode === "canvas") {
      renderMainStage();
    }
  };

  fsBtn?.addEventListener("click", async () => {
    try {
      const docEl = document.documentElement;
      const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
        // 가로 모드 고정 시도 (지원 브라우저 한정)
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock("landscape").catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    } catch (e) {
      console.warn("전체화면 전환 지원 안됨:", e);
    }
  });

  document.addEventListener("fullscreenchange", updateFsUI);
  document.addEventListener("webkitfullscreenchange", updateFsUI);

  // 태블릿 화면 회전이나 크기 변경 시 3단계 캔버스 비율 자동 재계산
  window.addEventListener("resize", () => {
    if (state.currentStep === 3 && state.writingMode === "canvas") {
      renderMainStage();
    }
  });

  // 40분 수업 동안 태블릿 화면이 꺼지지 않도록 Wake Lock 요청
  const requestWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        await navigator.wakeLock.request("screen");
      } catch (_) {
        // 배터리 절약 모드 등에서는 무시
      }
    }
  };
  requestWakeLock();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      requestWakeLock();
    }
  });
}
