/**
 * [내 생각 말하기] - 자체 제작 고해상도 벡터 일러스트 & CSS 그래픽 아트 라이브러리
 * - 단순 이모지 대신 중학교 3학년 연령에 어울리는 선명하고 직관적인 고해상도 커스텀 SVG/CSS 일러스트를 렌더링합니다.
 * - 교사가 새 단어를 추가하거나 수정해도 단어 의미/아이콘 키를 자동 분석하여 고해상도 일러스트를 매칭합니다.
 */

const HD_SVG_DEFS = `
  <defs>
    <linearGradient id="grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6ee7b7" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fda4af" />
      <stop offset="100%" stop-color="#e11d48" />
    </linearGradient>
    <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5b4fc" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <linearGradient id="grad-violet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8b4fe" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
    <linearGradient id="grad-slate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
  </defs>
`;

function wrapSvg(innerContent) {
  return `<svg class="hd-illust-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${HD_SVG_DEFS}${innerContent}</svg>`;
}

/**
 * 주제 및 2~5글자 핵심 어휘별 고해상도 자체 제작 벡터 그래픽 사전
 */
const ILLUSTRATION_CATALOG = {
  // ======================== 10대 주제 대표 일러스트 ========================
  lunch: wrapSvg(`
    <!-- 식판 베이스 -->
    <rect x="14" y="24" width="92" height="74" rx="16" fill="url(#grad-slate)" stroke="#ffffff" stroke-width="4"/>
    <!-- 밥 그릇 칸 -->
    <rect x="22" y="54" width="38" height="36" rx="10" fill="#1e293b"/>
    <path d="M27 74 C27 60, 55 60, 55 74 Z" fill="#ffffff"/>
    <!-- 국 그릇 칸 -->
    <rect x="64" y="54" width="34" height="36" rx="10" fill="#1e293b"/>
    <circle cx="81" cy="72" r="13" fill="url(#grad-amber)"/>
    <circle cx="77" cy="69" r="3" fill="#10b981"/>
    <circle cx="85" cy="74" r="3" fill="#ef4444"/>
    <!-- 반찬 3칸 -->
    <rect x="22" y="32" width="22" height="16" rx="5" fill="url(#grad-rose)"/>
    <rect x="49" y="32" width="22" height="16" rx="5" fill="url(#grad-emerald)"/>
    <rect x="76" y="32" width="22" height="16" rx="5" fill="url(#grad-amber)"/>
  `),

  breaktime: wrapSvg(`
    <!-- 헤드폰 밴드 -->
    <path d="M26 66 V54 C26 33, 94 33, 94 54 V66" stroke="url(#grad-sky)" stroke-width="10" stroke-linecap="round"/>
    <!-- 이어컵 좌우 -->
    <rect x="16" y="56" width="20" height="36" rx="10" fill="url(#grad-indigo)" stroke="#ffffff" stroke-width="3"/>
    <rect x="84" y="56" width="20" height="36" rx="10" fill="url(#grad-indigo)" stroke="#ffffff" stroke-width="3"/>
    <!-- 중앙 음표 -->
    <path d="M54 74 V44 L74 38 V68" stroke="url(#grad-amber)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="49" cy="75" r="7" fill="url(#grad-amber)"/>
    <circle cx="69" cy="69" r="7" fill="url(#grad-amber)"/>
  `),

  condition: wrapSvg(`
    <!-- 하트 건강 배지 -->
    <path d="M60 96 C60 96, 18 70, 18 42 C18 27, 32 18, 45 24 C53 27, 57 34, 60 39 C63 34, 67 27, 75 24 C88 18, 102 27, 102 42 C102 70, 60 96, 60 96 Z" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="4"/>
    <!-- 심박 라인 -->
    <path d="M30 56 H46 L53 40 L63 72 L71 50 L77 56 H90" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  moving: wrapSvg(`
    <!-- 스마트 휠체어 & 이동 아이콘 -->
    <circle cx="64" cy="24" r="11" fill="url(#grad-amber)"/>
    <path d="M56 40 H74 L78 64 H94" stroke="url(#grad-sky)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="52" cy="76" r="24" fill="#1e293b" stroke="url(#grad-indigo)" stroke-width="8"/>
    <circle cx="52" cy="76" r="8" fill="url(#grad-sky)"/>
    <circle cx="90" cy="88" r="11" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="3"/>
  `),

  helper: wrapSvg(`
    <!-- 도움/소통 두 손과 하트 -->
    <circle cx="60" cy="34" r="16" fill="url(#grad-amber)"/>
    <path d="M53 34 L58 39 L68 29" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 74 C28 58, 46 58, 56 70 L60 75 L64 70 C74 58, 92 58, 100 74 L88 94 H32 L20 74 Z" fill="url(#grad-violet)" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
  `),

  korean_class: wrapSvg(`
    <!-- 펼쳐진 책과 연필 -->
    <path d="M18 32 C34 26, 50 28, 60 36 C70 28, 86 26, 102 32 V88 C86 82, 70 84, 60 92 C50 84, 34 82, 18 88 V32 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <line x1="60" y1="36" x2="60" y2="92" stroke="#ffffff" stroke-width="4"/>
    <!-- ㄱ ㄴ 글자 심볼 -->
    <path d="M30 48 H46 V64" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M74 48 V64 H90" stroke="#fde68a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  club_play: wrapSvg(`
    <!-- 게임 패드 -->
    <path d="M24 44 H96 C106 44, 110 66, 102 84 C96 96, 84 94, 76 80 H44 C36 94, 24 96, 18 84 C10 66, 14 44, 24 44 Z" fill="url(#grad-indigo)" stroke="#ffffff" stroke-width="4"/>
    <!-- 십자키 -->
    <path d="M38 56 V72 M30 64 H46" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <!-- 액션 버튼 -->
    <circle cx="84" cy="58" r="5" fill="#fbbf24"/>
    <circle cx="74" cy="68" r="5" fill="#34d399"/>
    <circle cx="90" cy="70" r="5" fill="#fb7185"/>
  `),

  after_school: wrapSvg(`
    <!-- 따뜻한 집 -->
    <path d="M16 58 L60 20 L104 58" stroke="url(#grad-rose)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="28" y="54" width="64" height="46" rx="8" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <rect x="50" y="70" width="20" height="30" rx="4" fill="#1e293b"/>
    <rect x="36" y="62" width="12" height="12" rx="3" fill="#fef3c7"/>
    <rect x="72" y="62" width="12" height="12" rx="3" fill="#fef3c7"/>
  `),

  weather_clothes: wrapSvg(`
    <!-- 해와 구름 -->
    <circle cx="44" cy="44" r="18" fill="url(#grad-amber)"/>
    <path d="M44 16 V22 M44 66 V72 M16 44 H22 M66 44 H72 M24 24 L29 29 M59 59 L64 64" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <path d="M46 86 H90 C99 86, 104 78, 102 70 C100 62, 92 58, 86 60 C82 48, 66 46, 58 56 C48 56, 38 64, 38 74 C38 81, 41 86, 46 86 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
  `),

  friends_talk: wrapSvg(`
    <!-- 두 개의 대화 말풍선 -->
    <path d="M18 36 C18 24, 30 18, 52 18 C74 18, 84 24, 84 38 C84 50, 74 58, 54 58 L34 68 L36 56 C24 54, 18 46, 18 36 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <path d="M46 70 C46 58, 58 52, 76 52 C94 52, 104 58, 104 70 C104 80, 96 86, 86 88 L90 100 L72 90 C54 90, 46 82, 46 70 Z" fill="url(#grad-rose)" stroke="#ffffff" stroke-width="4"/>
    <circle cx="42" cy="38" r="4" fill="#ffffff"/>
    <circle cx="54" cy="38" r="4" fill="#ffffff"/>
    <circle cx="66" cy="38" r="4" fill="#ffffff"/>
  `),

  // ======================== 상시 의사표현 바 (Quick AAC) ========================
  aac_wait: wrapSvg(`
    <!-- 잠깐만요: 손바닥 정지/대기 제스처 -->
    <circle cx="60" cy="60" r="46" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <rect x="40" y="54" width="40" height="32" rx="12" fill="#ffffff"/>
    <rect x="38" y="34" width="8" height="28" rx="4" fill="#ffffff"/>
    <rect x="49" y="26" width="8" height="34" rx="4" fill="#ffffff"/>
    <rect x="60" y="28" width="8" height="32" rx="4" fill="#ffffff"/>
    <rect x="71" y="36" width="8" height="26" rx="4" fill="#ffffff"/>
    <path d="M38 66 L28 56" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
  `),

  aac_uncomfortable: wrapSvg(`
    <!-- 불편해요: 번개/주의 표정 배지 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-rose)" stroke="#ffffff" stroke-width="4"/>
    <path d="M36 44 L48 52 L36 58" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M84 44 L72 52 L84 58" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 80 Q49 70 60 80 T82 80" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M88 18 L76 36 H90 L78 52" stroke="#fde68a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  aac_restroom: wrapSvg(`
    <!-- 화장실 픽토그램 -->
    <rect x="16" y="16" width="88" height="88" rx="22" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <circle cx="40" cy="36" r="9" fill="#ffffff"/>
    <path d="M28 52 H52 L48 86 H32 L28 52 Z" fill="#ffffff"/>
    <line x1="60" y1="28" x2="60" y2="92" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="80" cy="36" r="9" fill="#fde68a"/>
    <path d="M68 84 L74 52 H86 L92 84 H68 Z" fill="#fde68a"/>
  `),

  aac_retry: wrapSvg(`
    <!-- 다시 할래요: 순환 화살표 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="4"/>
    <path d="M36 52 C40 36, 62 30, 76 40 C88 48, 90 68, 78 80 C66 90, 46 88, 38 74" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    <polygon points="30,36 30,58 50,50" fill="#ffffff"/>
  `),

  // ======================== 1단계 감정·상태·생각 어휘 ========================
  mood_good: wrapSvg(`
    <!-- 좋아요: 환한 미소 + 하트 포인트 -->
    <circle cx="60" cy="62" r="42" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="4"/>
    <path d="M38 54 C40 46, 48 46, 50 54" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 54 C72 46, 80 46, 82 54" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M40 70 C46 84, 74 84, 80 70" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <circle cx="34" cy="66" r="6" fill="#fb7185" opacity="0.8"/>
    <circle cx="86" cy="66" r="6" fill="#fb7185" opacity="0.8"/>
  `),

  mood_dislike: wrapSvg(`
    <!-- 싫어요: X 제스처와 단호한 표정 -->
    <circle cx="60" cy="60" r="42" fill="url(#grad-rose)" stroke="#ffffff" stroke-width="4"/>
    <path d="M40 40 L80 80 M80 40 L40 80" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
  `),

  mood_fun: wrapSvg(`
    <!-- 재밌어요 / 신나요: 반짝이는 별과 웃는 얼굴 -->
    <circle cx="60" cy="64" r="40" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <path d="M40 54 L48 50 L40 46" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M80 54 L72 50 L80 46" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42 68 H78 C78 84, 42 84, 42 68 Z" fill="#ffffff"/>
    <polygon points="94,16 98,26 108,28 100,35 102,45 94,39 86,45 88,35 80,28 90,26" fill="#fbbf24"/>
  `),

  mood_hard: wrapSvg(`
    <!-- 힘들어요 / 피곤해요: 땀방울과 지친 표정 -->
    <circle cx="60" cy="64" r="40" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <line x1="36" y1="54" x2="50" y2="50" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <line x1="84" y1="54" x2="70" y2="50" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M44 80 C50 70, 70 70, 76 80" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M92 24 C92 24, 104 40, 104 48 C104 55, 98 60, 92 60 C86 60, 80 55, 80 48 C80 40, 92 24, 92 24 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="3"/>
  `),

  mood_yummy: wrapSvg(`
    <!-- 맛있어요: 엄지 척 & 반짝이 -->
    <circle cx="60" cy="62" r="40" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <path d="M38 52 C40 44, 48 44, 50 52" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M70 52 C72 44, 80 44, 82 52" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M38 68 C46 84, 74 84, 82 68" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
    <path d="M64 76 C66 86, 80 86, 80 74" fill="#fb7185"/>
  `),

  mood_full: wrapSvg(`
    <!-- 배불러요: 든든한 밥그릇과 체크 -->
    <path d="M24 60 H96 C96 86, 78 98, 60 98 C42 98, 24 86, 24 60 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <path d="M30 60 C30 36, 90 36, 90 60 Z" fill="#ffffff"/>
    <circle cx="88" cy="34" r="16" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="3"/>
    <path d="M81 34 L86 39 L96 29" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  mood_sleepy: wrapSvg(`
    <!-- 졸려요 / 피곤해요: 달과 Zzz -->
    <circle cx="56" cy="66" r="38" fill="url(#grad-indigo)" stroke="#ffffff" stroke-width="4"/>
    <path d="M36 62 C40 68, 48 68, 52 62" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <path d="M60 62 C64 68, 72 68, 76 62" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="56" cy="80" r="6" fill="#ffffff"/>
    <path d="M78 22 H96 L78 40 H96" stroke="#fde68a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  mood_bored: wrapSvg(`
    <!-- 심심해요: 시계와 차분한 표정 -->
    <circle cx="60" cy="62" r="40" fill="url(#grad-indigo)" stroke="#ffffff" stroke-width="4"/>
    <circle cx="44" cy="54" r="5" fill="#ffffff"/>
    <circle cx="76" cy="54" r="5" fill="#ffffff"/>
    <line x1="44" y1="76" x2="76" y2="76" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  `),

  mood_okay: wrapSvg(`
    <!-- 괜찮아요 / 쉬워요: 큰 OK 체크 링 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="4"/>
    <path d="M40 60 L54 74 L82 46" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  mood_sick: wrapSvg(`
    <!-- 아파요: 반창고 듀오톤 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-rose)" stroke="#ffffff" stroke-width="4"/>
    <g transform="rotate(-30 60 60)">
      <rect x="24" y="44" width="72" height="32" rx="14" fill="#fde68a" stroke="#ffffff" stroke-width="3"/>
      <rect x="48" y="44" width="24" height="32" fill="#f59e0b"/>
      <circle cx="55" cy="54" r="2.5" fill="#ffffff"/>
      <circle cx="65" cy="54" r="2.5" fill="#ffffff"/>
      <circle cx="55" cy="66" r="2.5" fill="#ffffff"/>
      <circle cx="65" cy="66" r="2.5" fill="#ffffff"/>
    </g>
  `),

  mood_cold: wrapSvg(`
    <!-- 추워요: 눈결정과 얼음 톤 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <path d="M60 24 V96 M24 60 H96 M35 35 L85 85 M85 35 L35 85" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="10" fill="#0284c7" stroke="#ffffff" stroke-width="4"/>
  `),

  mood_hot: wrapSvg(`
    <!-- 더워요: 강렬한 태양 -->
    <circle cx="60" cy="60" r="28" fill="url(#grad-rose)" stroke="#fde68a" stroke-width="5"/>
    <path d="M60 12 V22 M60 98 V108 M12 60 H22 M98 60 H108 M26 26 L34 34 M86 86 L94 94 M94 26 L86 34 M34 86 L26 94" stroke="#fbbf24" stroke-width="7" stroke-linecap="round"/>
  `),

  mood_rain: wrapSvg(`
    <!-- 비 와요: 우산과 빗방울 -->
    <path d="M20 58 C20 30, 100 30, 100 58 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <path d="M60 58 V88 C60 96, 48 96, 48 88" stroke="#fde68a" stroke-width="6" stroke-linecap="round"/>
    <line x1="36" y1="22" x2="32" y2="32" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/>
    <line x1="60" y1="16" x2="56" y2="26" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/>
    <line x1="84" y1="22" x2="80" y2="32" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round"/>
  `),

  mood_angry: wrapSvg(`
    <!-- 화났어요 -->
    <circle cx="60" cy="64" r="40" fill="url(#grad-rose)" stroke="#ffffff" stroke-width="4"/>
    <path d="M36 46 L52 54" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <path d="M84 46 L68 54" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
    <circle cx="46" cy="60" r="5" fill="#ffffff"/>
    <circle cx="74" cy="60" r="5" fill="#ffffff"/>
    <path d="M44 82 C52 72, 68 72, 76 82" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  `),

  // ======================== 2단계 핵심 행동·사물 어휘 ========================
  act_meat: wrapSvg(`
    <!-- 고기반찬: 뼈 있는 고기 일러스트 -->
    <circle cx="28" cy="48" r="10" fill="#ffffff"/>
    <circle cx="22" cy="62" r="10" fill="#ffffff"/>
    <circle cx="92" cy="54" r="10" fill="#ffffff"/>
    <circle cx="96" cy="68" r="10" fill="#ffffff"/>
    <rect x="24" y="50" width="72" height="16" rx="8" transform="rotate(6 60 58)" fill="#ffffff"/>
    <ellipse cx="60" cy="58" rx="30" ry="22" transform="rotate(6 60 58)" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <path d="M48 48 C56 44, 68 46, 74 52" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>
  `),

  act_little: wrapSvg(`
    <!-- 조금만요: 작은 그릇과 작은 스푼 -->
    <path d="M34 62 H86 C86 80, 74 90, 60 90 C46 90, 34 80, 34 62 Z" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <circle cx="60" cy="42" r="10" fill="url(#grad-amber)"/>
  `),

  act_more: wrapSvg(`
    <!-- 더 주세요 / 더 할래요: 큼직한 플러스(+) 배지 -->
    <circle cx="60" cy="60" r="44" fill="url(#grad-emerald)" stroke="#ffffff" stroke-width="4"/>
    <path d="M60 34 V86 M34 60 H86" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  `),

  act_tablet: wrapSvg(`
    <!-- 태블릿 / 유튜브 / 티비 -->
    <rect x="20" y="24" width="80" height="72" rx="14" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <rect x="28" y="32" width="64" height="50" rx="6" fill="#0f172a"/>
    <polygon points="52,46 52,68 72,57" fill="url(#grad-rose)"/>
    <circle cx="60" cy="89" r="3" fill="#ffffff"/>
  `),

  act_water: wrapSvg(`
    <!-- 물 마시기: 맑은 물방울과 컵 -->
    <path d="M32 30 H88 L80 94 H40 L32 30 Z" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
    <path d="M36 54 Q48 48 60 54 T84 54 L80 90 H40 L36 54 Z" fill="url(#grad-sky)"/>
  `),

  act_posture: wrapSvg(`
    <!-- 자세 변경: 의자와 리프레시 화살표 -->
    <path d="M38 26 V64 H78 V94" stroke="url(#grad-sky)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="38" y1="64" x2="38" y2="94" stroke="url(#grad-sky)" stroke-width="10" stroke-linecap="round"/>
    <path d="M70 30 H92 V52" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  `),

  act_write: wrapSvg(`
    <!-- 글자 쓰기: 연필과 반짝이는 선 -->
    <g transform="rotate(35 60 60)">
      <rect x="48" y="18" width="24" height="64" rx="4" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="3"/>
      <polygon points="48,82 72,82 60,102" fill="#fde68a"/>
      <polygon points="56,94 64,94 60,102" fill="#0f172a"/>
      <rect x="48" y="14" width="24" height="10" rx="3" fill="url(#grad-rose)"/>
    </g>
  `),

  act_touch: wrapSvg(`
    <!-- 단어 터치 / 내 차례요: 손가락 터치 파동 -->
    <circle cx="60" cy="34" r="18" stroke="url(#grad-sky)" stroke-width="4" stroke-dasharray="6 4"/>
    <circle cx="60" cy="34" r="9" fill="url(#grad-amber)"/>
    <rect x="52" y="34" width="16" height="42" rx="8" fill="#ffffff"/>
    <rect x="38" y="58" width="46" height="36" rx="14" fill="#ffffff"/>
  `),

  act_trophy: wrapSvg(`
    <!-- 이겼어요: 황금 트로피 -->
    <path d="M36 26 H84 V52 C84 68, 74 78, 60 78 C46 78, 36 68, 36 52 V26 Z" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <path d="M36 34 H22 C22 50, 28 56, 36 56" stroke="#fde68a" stroke-width="5" stroke-linecap="round"/>
    <path d="M84 34 H98 C98 50, 92 56, 84 56" stroke="#fde68a" stroke-width="5" stroke-linecap="round"/>
    <rect x="54" y="78" width="12" height="14" fill="#fde68a"/>
    <rect x="38" y="92" width="44" height="10" rx="4" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="3"/>
  `),

  act_snack: wrapSvg(`
    <!-- 간식 먹기: 초코칩 쿠키 -->
    <circle cx="60" cy="60" r="40" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4"/>
    <circle cx="46" cy="46" r="6" fill="#451a03"/>
    <circle cx="72" cy="42" r="5" fill="#451a03"/>
    <circle cx="62" cy="64" r="7" fill="#451a03"/>
    <circle cx="42" cy="72" r="5" fill="#451a03"/>
    <circle cx="78" cy="70" r="6" fill="#451a03"/>
  `),

  act_clothes: wrapSvg(`
    <!-- 겉옷 입기 / 벗기: 모던 점퍼/티셔츠 -->
    <path d="M38 26 L50 34 H70 L82 26 L104 42 L92 60 L80 52 V94 H40 V52 L28 60 L16 42 L38 26 Z" fill="url(#grad-amber)" stroke="#ffffff" stroke-width="4" stroke-linejoin="round"/>
    <line x1="60" y1="34" x2="60" y2="94" stroke="#ffffff" stroke-width="4"/>
  `),

  act_window: wrapSvg(`
    <!-- 창문 닫기: 4칸 창문 프레임 -->
    <rect x="22" y="22" width="76" height="76" rx="10" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="5"/>
    <line x1="60" y1="22" x2="60" y2="98" stroke="#ffffff" stroke-width="5"/>
    <line x1="22" y1="60" x2="98" y2="60" stroke="#ffffff" stroke-width="5"/>
  `)
};

/**
 * 단어(word), 주제 ID(topicId), 또는 아이콘 힌트를 기반으로
 * 가장 적합한 고해상도 자체 제작 일러스트 HTML을 반환합니다.
 */
function renderHighResIllustration({ key = "", word = "", icon = "", accent = "sky", sizeClass = "" }) {
  const svgMarkup = resolveIllustrationSvg(key, word, icon);
  const frameClass = sizeClass ? `illust-art-frame ${sizeClass}` : "illust-art-frame";
  return `<div class="${frameClass}" data-accent="${accent}" aria-hidden="true">${svgMarkup}</div>`;
}

function resolveIllustrationSvg(key, word, icon) {
  if (key && ILLUSTRATION_CATALOG[key]) {
    return ILLUSTRATION_CATALOG[key];
  }

  const w = (word || "").trim();

  // 주제 및 키워드 매칭
  if (w.includes("급식") || icon === "🍱") return ILLUSTRATION_CATALOG.lunch;
  if (w.includes("쉬는") || w.includes("음악") || icon === "🎧") return ILLUSTRATION_CATALOG.breaktime;
  if (w.includes("컨디션") || icon === "💪") return ILLUSTRATION_CATALOG.condition;
  if (w.includes("이동") || w.includes("휠체어") || w.includes("천천히") || icon === "🧑‍🦽") return ILLUSTRATION_CATALOG.moving;
  if (w.includes("요청") || w.includes("도와") || w.includes("손 잡") || w.includes("같이") || icon === "🤝") return ILLUSTRATION_CATALOG.helper;
  if (w.includes("국어") || w.includes("공부") || icon === "📖") return ILLUSTRATION_CATALOG.korean_class;
  if (w.includes("놀이") || w.includes("게임") || icon === "🎮") return ILLUSTRATION_CATALOG.club_play;
  if (w.includes("집") || w.includes("교실") || icon === "🏠" || icon === "🏫") return ILLUSTRATION_CATALOG.after_school;
  if (w.includes("날씨") || w.includes("맑아") || icon === "🌤️" || icon === "☀️") return ILLUSTRATION_CATALOG.weather_clothes;
  if (w.includes("친구") || w.includes("안녕") || icon === "👋") return ILLUSTRATION_CATALOG.friends_talk;

  // 상시 의사표현(AAC) 매칭
  if (w.includes("잠깐") || w.includes("기다려") || w.includes("그만") || w.includes("안 먹") || icon === "✋" || icon === "⏳") return ILLUSTRATION_CATALOG.aac_wait;
  if (w.includes("불편") || icon === "😣") return ILLUSTRATION_CATALOG.aac_uncomfortable;
  if (w.includes("화장실") || icon === "🚻") return ILLUSTRATION_CATALOG.aac_restroom;
  if (w.includes("다시") || w.includes("한 번 더") || icon === "🔄" || icon === "🔁") return ILLUSTRATION_CATALOG.aac_retry;

  // 감정/상태 매칭
  if (w.includes("좋아") || w.includes("반가") || w.includes("고마") || w.includes("편안") || icon === "😊") return ILLUSTRATION_CATALOG.mood_good;
  if (w.includes("싫어") || icon === "🙅" || icon === "🛑") return ILLUSTRATION_CATALOG.mood_dislike;
  if (w.includes("재밌") || w.includes("신나") || w.includes("하고 싶") || w.includes("가고 싶") || icon === "😄" || icon === "🎉") return ILLUSTRATION_CATALOG.mood_fun;
  if (w.includes("힘들") || w.includes("어려") || icon === "💦") return ILLUSTRATION_CATALOG.mood_hard;
  if (w.includes("맛있") || icon === "😋") return ILLUSTRATION_CATALOG.mood_yummy;
  if (w.includes("배불") || icon === "🫃") return ILLUSTRATION_CATALOG.mood_full;
  if (w.includes("피곤") || w.includes("졸려") || w.includes("일찍 자") || w.includes("쉬고") || w.includes("쉬었다") || icon === "😴") return ILLUSTRATION_CATALOG.mood_sleepy;
  if (w.includes("심심") || w.includes("구경") || w.includes("부끄") || w.includes("미안") || icon === "😐") return ILLUSTRATION_CATALOG.mood_bored;
  if (w.includes("괜찮") || w.includes("쉬워") || w.includes("혼자") || icon === "👌") return ILLUSTRATION_CATALOG.mood_okay;
  if (w.includes("아파") || w.includes("도움") || w.includes("닦아") || icon === "🩹") return ILLUSTRATION_CATALOG.mood_sick;
  if (w.includes("추워") || icon === "🥶") return ILLUSTRATION_CATALOG.mood_cold;
  if (w.includes("더워") || icon === "🥵") return ILLUSTRATION_CATALOG.mood_hot;
  if (w.includes("비 와") || icon === "☔") return ILLUSTRATION_CATALOG.mood_rain;
  if (w.includes("화났") || icon === "😠") return ILLUSTRATION_CATALOG.mood_angry;

  // 2단계 행동/사물 매칭
  if (w.includes("고기") || icon === "🍖") return ILLUSTRATION_CATALOG.act_meat;
  if (w.includes("조금") || icon === "🤏") return ILLUSTRATION_CATALOG.act_little;
  if (w.includes("더 주") || w.includes("더 할") || icon === "➕" || icon === "🥣") return ILLUSTRATION_CATALOG.act_more;
  if (w.includes("태블릿") || w.includes("유튜브") || w.includes("티비") || icon === "📱" || icon === "▶️" || icon === "📺") return ILLUSTRATION_CATALOG.act_tablet;
  if (w.includes("물 ") || w.includes("마시") || icon === "💧") return ILLUSTRATION_CATALOG.act_water;
  if (w.includes("자세") || icon === "🪑") return ILLUSTRATION_CATALOG.act_posture;
  if (w.includes("쓰기") || icon === "✍️") return ILLUSTRATION_CATALOG.act_write;
  if (w.includes("터치") || w.includes("차례") || icon === "👆" || icon === "☝️") return ILLUSTRATION_CATALOG.act_touch;
  if (w.includes("이겼") || icon === "🏆") return ILLUSTRATION_CATALOG.act_trophy;
  if (w.includes("간식") || w.includes("배고") || icon === "🍪" || icon === "🥨") return ILLUSTRATION_CATALOG.act_snack;
  if (w.includes("겉옷") || icon === "🧥" || icon === "👕") return ILLUSTRATION_CATALOG.act_clothes;
  if (w.includes("창문") || icon === "🪟") return ILLUSTRATION_CATALOG.act_window;

  // 기본 커스텀 배지 (새로 추가된 단어의 첫 글자 또는 아이콘을 고해상도 벡터 프레임에 렌더링)
  const displayChar = icon || (w ? w[0] : "★");
  return wrapSvg(`
    <circle cx="60" cy="60" r="44" fill="url(#grad-sky)" stroke="#ffffff" stroke-width="4"/>
    <text x="60" y="76" text-anchor="middle" fill="#ffffff" font-size="46" font-weight="900" font-family="Pretendard, Malgun Gothic, sans-serif">${displayChar}</text>
  `);
}
