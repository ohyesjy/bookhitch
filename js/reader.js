// BookHitch - Reader & Sayu Module

// ── 사유 섹션 빌더 ──────────────────────────────
function buildSayuHTML(ch, idx) {
  if (!ch.sayu) return '';
  var s = ch.sayu;
  var memoKey = 'sayu_b' + curBookIdx + '_' + idx;
  var saved = answers[memoKey];

  // ① 저자의 화두
  var hwadu = '<div class="sayu-hwadu fu4">'
    + '<div class="sayu-label">// 저자의 화두 — 왜 이 장면을 썼는가</div>'
    + '<div class="sayu-hwadu-text">' + s.hwadu + '</div>'
    + '</div>';

  // ③ 핵심어 + 연상어
  var chips = (s.assoc || []).map(function(a) {
    return '<span class="sayu-assoc-chip">' + a + '</span>';
  }).join('');
  var keyword = '<div class="sayu-keyword-card fu4">'
    + '<div class="sayu-label">// 핵심어</div>'
    + '<div class="sayu-keyword-word">' + s.keyword + '</div>'
    + '<div class="sayu-label" style="margin-bottom:6px">// 떠오르는 것들</div>'
    + '<div class="sayu-assoc-wrap">' + chips + '</div>'
    + '</div>';

  // ⑤ 사유 질문
  var qAreaId = 'sayu_qa_' + idx;
  var qArea = saved
    ? '<div class="q-done-box"><div class="q-done-lbl">// MY NOTE</div><div class="q-done-txt">' + saved + '</div></div>'
      + '<button class="q-re" onclick="editSayuMemo(' + idx + ',\'' + memoKey + '\')">[ 다시 쓰기 ]</button>'
    : '<textarea class="q-inp" id="sayu_inp_' + idx + '" rows="5" placeholder="다섯 줄로 내 생각을 써봐요"></textarea>'
      + '<br><button class="q-save" onclick="saveSayuMemo(' + idx + ',\'' + memoKey + '\')">[ SAVE ]</button>';

  var qcard = '<div class="sayu-q-card fu4">'
    + '<div class="sayu-q-label">// 사유 질문</div>'
    + '<div class="sayu-q-text">' + s.question + '</div>'
    + '<div id="' + qAreaId + '">' + qArea + '</div>'
    + '</div>';

  // ⑥ 반론 카드
  var rebuttal = '<div class="sayu-rebuttal fu4">'
    + '<div class="sayu-rebuttal-label">// 반론 — 이렇게 생각할 수도 있지 않나?</div>'
    + '<div class="sayu-rebuttal-text">' + s.rebuttal + '</div>'
    + '</div>';

  // ⑦ 책별 손그림 일러스트
  var sketch = getSayuSketch(curBookIdx, idx);

  return hwadu + keyword + qcard + rebuttal;
}

function getSayuSketch(bookIdx, chIdx) {
  // filter: feTurbulence로 손그림 느낌 전역 적용
  var wobbly = '<defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';

  var sketches = {

    // ── 히치하이커 ──
    '0_0': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 아서 몸 -->
<circle cx="55" cy="25" r="13" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<line x1="55" y1="38" x2="54" y2="70" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<line x1="54" y1="50" x2="35" y2="62" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="54" y1="50" x2="78" y2="57" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="54" y1="70" x2="45" y2="95" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="54" y1="70" x2="64" y2="96" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 수건 -->
<path d="M78 55 Q90 48 95 58 Q90 68 78 63 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<path d="M95 58 L105 52" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<!-- 얼굴 -->
<circle cx="51" cy="22" r="2" fill="#2A0510"/>
<circle cx="59" cy="23" r="2" fill="#2A0510"/>
<path d="M51 30 Q55 33 59 30" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<!-- 화살표 + 라벨 -->
<path d="M68 15 L80 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="80,10 74,8 76,14" fill="#2A0510"/>
<text x="83" y="12" font-family="serif" font-size="9" fill="#2A0510">아서</text>
<path d="M100 55 L118 48" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="118,48 112,44 113,50" fill="#2A0510"/>
<text x="120" y="50" font-family="serif" font-size="9" fill="#2A0510">수건(필수템)</text>
<!-- 우주 별 -->
<path d="M160 20 L163 28 L171 28 L165 33 L167 41 L160 36 L153 41 L155 33 L149 28 L157 28Z" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.5"/>
<circle cx="195" cy="50" r="4" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/>
<circle cx="210" cy="25" r="2.5" fill="#2A0510" opacity="0.3"/>
<path d="M170 70 Q195 55 215 72" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.35" stroke-dasharray="4 3"/>
<text x="175" y="90" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">← 은하수 방향</text>
</g></svg></div>`,

    '0_1': `<div class="sayu-sketch"><svg width="240" height="140" viewBox="0 0 240 140" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 보그족 (네모 머리) -->
<rect x="20" y="15" width="38" height="30" rx="3" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<rect x="26" y="22" width="8" height="8" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<rect x="42" y="22" width="8" height="8" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<path d="M28 38 L48 38" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="39" y1="45" x2="38" y2="75" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<line x1="38" y1="57" x2="20" y2="65" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="38" y1="57" x2="60" y2="62" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="38" y1="75" x2="30" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="38" y1="75" x2="48" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 두루마리 시 -->
<path d="M80 20 Q82 18 90 20 L92 80 Q90 82 82 80 Q78 78 80 20Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<line x1="84" y1="32" x2="90" y2="32" stroke="#2A0510" stroke-width="1" opacity="0.5"/>
<line x1="84" y1="40" x2="90" y2="40" stroke="#2A0510" stroke-width="1" opacity="0.5"/>
<line x1="84" y1="48" x2="90" y2="48" stroke="#2A0510" stroke-width="1" opacity="0.5"/>
<line x1="84" y1="56" x2="90" y2="56" stroke="#2A0510" stroke-width="1" opacity="0.5"/>
<!-- 귀막는 아서 -->
<circle cx="155" cy="28" r="13" stroke="#2A0510" stroke-width="2" fill="none"/>
<circle cx="151" cy="25" r="2" fill="#2A0510"/>
<circle cx="159" cy="25" r="2" fill="#2A0510"/>
<path d="M151 35 Q155 32 159 35" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<path d="M140 22 L130 18 M140 28 L130 28" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<path d="M170 22 L180 18 M170 28 L180 28" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<line x1="155" y1="41" x2="154" y2="72" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 음파 -->
<path d="M100 50 Q115 40 110 60 Q105 70 120 55" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/>
<!-- 화살표 -->
<path d="M15 12 L10 5" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="10,5 6,10 12,11" fill="#2A0510"/>
<text x="0" y="3" font-family="serif" font-size="8" fill="#2A0510">보그족</text>
<path d="M95 18 L105 12" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="105,12 99,9 100,15" fill="#2A0510"/>
<text x="83" y="9" font-family="serif" font-size="8" fill="#2A0510">최악의 시</text>
<path d="M168 18 L178 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="178,10 172,8 173,14" fill="#2A0510"/>
<text x="178" y="9" font-family="serif" font-size="8" fill="#2A0510">아서(괴로움)</text>
<text x="90" y="125" font-family="serif" font-size="8.5" fill="#2A0510" opacity="0.6">우주 3위 최악의 시 낭독중..</text>
</g></svg></div>`,

    '0_2': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 낡은 책 -->
<rect x="15" y="18" width="72" height="92" rx="5" stroke="#2A0510" stroke-width="2.5" fill="none"/>
<rect x="22" y="28" width="58" height="72" rx="2" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.5"/>
<text x="28" y="55" font-family="serif" font-size="12" font-weight="bold" fill="#2A0510">DON'T</text>
<text x="28" y="72" font-family="serif" font-size="12" font-weight="bold" fill="#2A0510">PANIC</text>
<line x1="25" y1="82" x2="75" y2="82" stroke="#2A0510" stroke-width="0.8" opacity="0.4"/>
<text x="27" y="92" font-family="serif" font-size="6.5" fill="#2A0510" opacity="0.5">은하수 여행 안내서</text>
<!-- 수건 -->
<path d="M115 40 Q128 28 148 35 L152 75 Q140 82 122 76 Q108 68 115 40Z" stroke="#2A0510" stroke-width="2" fill="none"/>
<path d="M118 42 L123 38 M135 30 L138 26 M148 35 L153 31" stroke="#2A0510" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
<text x="122" y="58" font-family="serif" font-size="10" fill="#2A0510">수건</text>
<!-- 별들 -->
<circle cx="195" cy="28" r="3.5" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/>
<circle cx="210" cy="55" r="2" fill="#2A0510" opacity="0.4"/>
<circle cx="200" cy="75" r="3" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.4"/>
<!-- 화살표 -->
<path d="M90 35 L112 40" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="112,40 106,36 106,42" fill="#2A0510"/>
<text x="60" y="15" font-family="serif" font-size="8.5" fill="#2A0510">이 책 한권이면 됨</text>
<path d="M148 65 L168 58" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="168,58 162,54 162,60" fill="#2A0510"/>
<text x="170" y="60" font-family="serif" font-size="8" fill="#2A0510">최고의 준비물</text>
<text x="88" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.55">★ 우주여행 필수템: 수건 1장</text>
</g></svg></div>`,

    '0_3': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 컴퓨터 딥소트 -->
<rect x="10" y="20" width="80" height="58" rx="4" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<rect x="18" y="28" width="64" height="38" rx="2" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.5"/>
<text x="30" y="53" font-family="serif" font-size="22" font-weight="bold" fill="#2A0510">42</text>
<line x1="25" y1="78" x2="20" y2="92" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/>
<line x1="50" y1="78" x2="50" y2="92" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/>
<line x1="75" y1="78" x2="80" y2="92" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/>
<line x1="15" y1="92" x2="88" y2="92" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/>
<!-- 물음표 말풍선 -->
<path d="M120 25 Q138 15 162 22 Q172 15 178 26 L175 55 Q162 64 145 57 Q125 50 120 25Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="132" y="44" font-family="serif" font-size="13" fill="#2A0510">???</text>
<line x1="145" y1="64" x2="143" y2="78" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<!-- 과학자 2명 -->
<circle cx="138" cy="90" r="9" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="136" cy="88" r="1.5" fill="#2A0510"/>
<circle cx="141" cy="88" r="1.5" fill="#2A0510"/>
<path d="M136 94 Q139 97 142 94" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="162" cy="90" r="9" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="160" cy="88" r="1.5" fill="#2A0510"/>
<circle cx="165" cy="88" r="1.5" fill="#2A0510"/>
<path d="M160 94 Q162 91 165 94" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<!-- 화살표 -->
<path d=M50 18 L50 22 stroke="#2A0510" stroke-width="1.3"/>
<text x="15" y="14" font-family="serif" font-size="8" fill="#2A0510">750만년 계산함</text>
<path d="M90 60 L118 40" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="118,40 112,38 113,44" fill="#2A0510"/>
<text x="92" y="75" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.6">질문이 뭐였더라..</text>
<text x="125" y="118" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.5">↑ 750만년 기다린 사람들</text>
</g></svg></div>`,

    '0_4': `<div class="sayu-sketch"><svg width="240" height="140" viewBox="0 0 240 140" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 마빈 (사각 로봇) -->
<rect x="45" y="12" width="36" height="28" rx="5" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<line x1="57" y1="22" x2="57" y2="28" stroke="#2A0510" stroke-width="2.5" stroke-linecap="round"/>
<line x1="69" y1="22" x2="69" y2="28" stroke="#2A0510" stroke-width="2.5" stroke-linecap="round"/>
<path d="M58 35 L68 35" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
<rect x="38" y="40" width="50" height="48" rx="3" stroke="#2A0510" stroke-width="2" fill="none"/>
<line x1="38" y1="57" x2="25" y2="55" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<rect x="15" y="52" width="10" height="14" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<line x1="88" y1="57" x2="100" y2="55" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<rect x="100" y="52" width="10" height="14" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<line x1="55" y1="88" x2="52" y2="115" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="71" y1="88" x2="74" y2="115" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="48" y1="115" x2="60" y2="115" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="68" y1="115" x2="80" y2="115" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 말풍선 -->
<path d="M125 18 Q148 8 172 16 Q180 9 186 18 L183 46 Q170 55 150 48 Q128 40 125 18Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="132" y="30" font-family="serif" font-size="8.5" fill="#2A0510">다 의미없어요</text>
<text x="135" y="42" font-family="serif" font-size="8.5" fill="#2A0510">어차피 똑같아요</text>
<line x1="148" y1="55" x2="100" y2="58" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="100,58 106,54 105,60" fill="#2A0510"/>
<!-- 화살표 라벨 -->
<path d=M25 40 L18 32 stroke="#2A0510" stroke-width="1.3"/>
<text x="0" y="30" font-family="serif" font-size="8" fill="#2A0510">마빈</text>
<path d=M72 40 L82 30 stroke="#2A0510" stroke-width="1.3"/>
<text x="83" y="28" font-family="serif" font-size="8" fill="#2A0510">(로봇)</text>
<text x="110" y="130" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.55">능력↑ 행복↓ 의미=없음</text>
</g></svg></div>`,

    '0_5': `<div class="sayu-sketch"><svg width="240" height="120" viewBox="0 0 240 120" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 우주 속 지구 (아주 작은 점) -->
<circle cx="120" cy="55" r="52" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.2" stroke-dasharray="5 4"/>
<circle cx="120" cy="55" r="35" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.15" stroke-dasharray="3 3"/>
<circle cx="120" cy="55" r="5" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="120" cy="55" r="1.5" fill="#2A0510"/>
<!-- 별들 -->
<circle cx="35" cy="22" r="2" fill="#2A0510" opacity="0.4"/>
<circle cx="195" cy="18" r="1.5" fill="#2A0510" opacity="0.35"/>
<circle cx="50" cy="90" r="2.5" fill="#2A0510" opacity="0.3"/>
<circle cx="200" cy="85" r="2" fill="#2A0510" opacity="0.4"/>
<circle cx="20" cy="55" r="1.5" fill="#2A0510" opacity="0.3"/>
<circle cx="220" cy="55" r="2" fill="#2A0510" opacity="0.3"/>
<path d="M65 20 L68 28 L76 28 L70 33 L72 41 L65 36 L58 41 L60 33 L54 28 L62 28Z" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.35"/>
<path d="M175 75 L177 81 L183 81 L178 85 L180 91 L175 87 L170 91 L172 85 L167 81 L173 81Z" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.3"/>
<!-- 화살표 + 라벨 -->
<path d="M127 52 L158 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="158,35 152,33 153,39" fill="#2A0510"/>
<text x="160" y="34" font-family="serif" font-size="8" fill="#2A0510">지구(우리)</text>
<text x="60" y="110" font-family="serif" font-size="8.5" fill="#2A0510" opacity="0.6">DON'T PANIC. 그래도 괜찮아.</text>
</g></svg></div>`,

    // ── 변신 ──
    '1_0': `<div class="sayu-sketch"><svg width="240" height="140" viewBox="0 0 240 140" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 벌레 몸통 -->
<ellipse cx="105" cy="85" rx="58" ry="32" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<!-- 다리들 -->
<path d="M68 76 Q58 62 48 58" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<path d="M80 72 Q75 55 68 50" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<path d="M95 70 Q93 52 90 46" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<path d="M120 70 Q122 52 124 46" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<path d="M138 72 Q145 55 150 50" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<path d="M150 77 Q162 63 170 60" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<!-- 눈 -->
<circle cx="78" cy="78" r="6" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="76" cy="77" r="2.5" fill="#2A0510"/>
<!-- 더듬이 -->
<path d="M72 73 Q65 60 60 52" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" fill="none"/>
<circle cx="60" cy="52" r="2.5" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<!-- 말풍선 생각 -->
<path d="M155 28 Q172 18 192 25 Q200 17 207 27 L205 52 Q193 60 175 54 Q155 46 155 28Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="160" y="38" font-family="serif" font-size="8" fill="#2A0510">회사에</text>
<text x="160" y="50" font-family="serif" font-size="8" fill="#2A0510">지각하면..</text>
<circle cx="148" cy="68" r="3" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<circle cx="152" cy="60" r="2" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<!-- 화살표 -->
<path d="M60 90 L42 100" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="42,100 48,96 46,102" fill="#2A0510"/>
<text x="5" y="112" font-family="serif" font-size="8" fill="#2A0510">그레고르</text>
<path d="M108 55 L130 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="130,35 124,33 125,39" fill="#2A0510"/>
<text x="108" y="28" font-family="serif" font-size="7.5" fill="#2A0510">← 등껍질</text>
<text x="58" y="130" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.55">벌레가 됐는데 회사걱정이 먼저</text>
</g></svg></div>`,

    '1_1': `<div class="sayu-sketch"><svg width="240" height="140" viewBox="0 0 240 140" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 방 테두리 -->
<rect x="12" y="12" width="140" height="118" stroke="#2A0510" stroke-width="2" fill="none"/>
<!-- 창고 물건들 -->
<rect x="22" y="22" width="38" height="28" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="68" y="18" width="28" height="38" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="30" y="72" width="42" height="32" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="80" y="78" width="32" height="26" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="115" y="22" width="22" height="22" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/>
<!-- 구석의 그레고르 (작은 벌레) -->
<ellipse cx="22" cy="120" rx="14" ry="8" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<path d="M12 115 L6 108 M16 113 L12 105 M22 112 L20 104 M28 113 L30 105 M32 115 L36 108" stroke="#2A0510" stroke-width="1.2" fill="none"/>
<!-- 화살표 -->
<path d="M38 120 L22 120" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="22,120 28,117 28,123" fill="#2A0510"/>
<text x="40" y="123" font-family="serif" font-size="7.5" fill="#2A0510">그레고르(구석)</text>
<path d="M70 45 L65 55" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="65,55 63,49 69,50" fill="#2A0510"/>
<text x="160" y="50" font-family="serif" font-size="7.5" fill="#2A0510">창고</text>
<path d=M155 45 L152 52 stroke="#2A0510" stroke-width="1.3"/>
<text x="60" y="10" font-family="serif" font-size="8" fill="#2A0510">방 → 창고 전락기</text>
</g></svg></div>`,

    '1_2': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 전차 -->
<rect x="15" y="50" width="150" height="55" rx="10" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<rect x="28" y="62" width="28" height="22" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="68" y="62" width="28" height="22" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<rect x="108" y="62" width="28" height="22" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/>
<circle cx="50" cy="107" r="10" stroke="#2A0510" stroke-width="2" fill="none"/>
<circle cx="50" cy="107" r="4" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="125" cy="107" r="10" stroke="#2A0510" stroke-width="2" fill="none"/>
<circle cx="125" cy="107" r="4" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<line x1="165" y1="68" x2="185" y2="68" stroke="#2A0510" stroke-width="2.5" stroke-linecap="round"/>
<!-- 가족 3명 창밖 -->
<circle cx="42" cy="55" r="8" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="40" cy="53" r="1.5" fill="#2A0510"/><circle cx="44" cy="53" r="1.5" fill="#2A0510"/>
<path d="M40 58 Q42 60 44 58" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<circle cx="80" cy="55" r="8" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="78" cy="53" r="1.5" fill="#2A0510"/><circle cx="82" cy="53" r="1.5" fill="#2A0510"/>
<path d="M78 58 Q80 60 82 58" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<circle cx="118" cy="55" r="8" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="116" cy="53" r="1.5" fill="#2A0510"/><circle cx="120" cy="53" r="1.5" fill="#2A0510"/>
<path d="M116 58 Q118 60 120 58" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<!-- 봄 꽃 -->
<circle cx="205" cy="35" r="5" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.5"/>
<path d="M200 30 L205 25 L210 30 M205 25 L205 18" stroke="#2A0510" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
<!-- 화살표 -->
<text x="165" y="42" font-family="serif" font-size="8" fill="#2A0510">→ 새 출발</text>
<text x="40" y="15" font-family="serif" font-size="8.5" fill="#2A0510" opacity="0.6">그레고르 없는 봄날</text>
</g></svg></div>`,

    // ── 논어 ──
    '8_0': `<div class="sayu-sketch"><svg width="240" height="145" viewBox="0 0 240 145" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 공자 (수염 있는 선생님) -->
<circle cx="50" cy="28" r="16" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<path d="M43 22 Q50 17 57 22" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/>
<circle cx="45" cy="27" r="2" fill="#2A0510"/>
<circle cx="55" cy="27" r="2" fill="#2A0510"/>
<path d="M44 34 Q50 38 56 34" stroke="#2A0510" stroke-width="2" fill="none"/>
<!-- 수염 -->
<path d="M46 38 Q44 46 46 52 M50 39 Q50 47 50 53 M54 38 Q56 46 54 52" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.6"/>
<line x1="50" y1="44" x2="50" y2="80" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<line x1="50" y1="58" x2="30" y2="70" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="50" y1="58" x2="72" y2="68" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="50" y1="80" x2="42" y2="108" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="50" y1="80" x2="58" y2="108" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 제자 1 -->
<circle cx="130" cy="42" r="11" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="127" cy="40" r="1.5" fill="#2A0510"/><circle cx="133" cy="40" r="1.5" fill="#2A0510"/>
<path d="M128 47 Q131 50 134 47" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<line x1="130" y1="53" x2="130" y2="78" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/>
<line x1="130" y1="63" x2="118" y2="72" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<line x1="130" y1="63" x2="142" y2="70" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<line x1="130" y1="78" x2="124" y2="98" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<line x1="130" y1="78" x2="136" y2="98" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<!-- 제자 2 -->
<circle cx="190" cy="48" r="10" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<circle cx="187" cy="46" r="1.5" fill="#2A0510"/><circle cx="193" cy="46" r="1.5" fill="#2A0510"/>
<path d="M188 53 Q191 56 194 53" stroke="#2A0510" stroke-width="1.3" fill="none"/>
<line x1="190" y1="58" x2="190" y2="80" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<line x1="190" y1="68" x2="178" y2="75" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<line x1="190" y1="68" x2="202" y2="73" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<line x1="190" y1="80" x2="185" y2="98" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<line x1="190" y1="80" x2="195" y2="98" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<!-- 점선 연결 -->
<path d="M72 65 Q100 58 118 62" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.35" stroke-dasharray="3 2"/>
<!-- 화살표 -->
<path d="M35 18 L28 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="28,10 24,15 30,15" fill="#2A0510"/>
<text x="0" y="8" font-family="serif" font-size="8" fill="#2A0510">공자</text>
<text x="112" y="30" font-family="serif" font-size="7.5" fill="#2A0510">안회</text>
<text x="178" y="36" font-family="serif" font-size="7.5" fill="#2A0510">자로</text>
<text x="55" y="130" font-family="serif" font-size="8" fill="#2A0510" opacity="0.55">배우고 때로 익히면...</text>
</g></svg></div>`,

    '8_1': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 손 번쩍 든 사람 -->
<circle cx="70" cy="28" r="14" stroke="#2A0510" stroke-width="2" fill="none"/>
<circle cx="66" cy="26" r="2" fill="#2A0510"/>
<circle cx="74" cy="26" r="2" fill="#2A0510"/>
<path d="M66 34 Q70 37 74 34" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<line x1="70" y1="42" x2="69" y2="75" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 손 번쩍 -->
<path d="M69 52 L48 35 L45 22" stroke="#2A0510" stroke-width="2" stroke-linecap="round" fill="none"/>
<circle cx="45" cy="20" r="5" stroke="#2A0510" stroke-width="1.5" fill="none"/>
<line x1="69" y1="52" x2="90" y2="62" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="69" y1="75" x2="60" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<line x1="69" y1="75" x2="78" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 말풍선 -->
<path d="M130 22 Q148 10 175 17 Q185 8 192 19 L190 48 Q176 58 155 52 Q130 44 130 22Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="138" y="35" font-family="serif" font-size="9" fill="#2A0510">모릅니다!</text>
<text x="142" y="47" font-family="serif" font-size="8.5" fill="#2A0510">(솔직하게)</text>
<line x1="148" y1="58" x2="95" y2="55" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="95,55 101,51 100,57" fill="#2A0510"/>
<!-- 화살표 -->
<path d="M38 18 L30 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="30,10 26,15 32,15" fill="#2A0510"/>
<text x="5" y="8" font-family="serif" font-size="7.5" fill="#2A0510">자로</text>
<text x="55" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.55">아는 것을 안다하고 모르는 것을 모른다</text>
</g></svg></div>`,

    '8_2': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 저울 막대 -->
<line x1="120" y1="18" x2="120" y2="80" stroke="#2A0510" stroke-width="2.5" stroke-linecap="round"/>
<line x1="62" y1="42" x2="178" y2="42" stroke="#2A0510" stroke-width="2.2" stroke-linecap="round"/>
<circle cx="120" cy="16" r="5" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="62" cy="42" r="3" fill="#2A0510" opacity="0.5"/>
<circle cx="178" cy="42" r="3" fill="#2A0510" opacity="0.5"/>
<!-- 왼쪽 그릇: 나 -->
<path d="M42 45 Q32 58 38 72 Q45 82 62 80 Q78 78 75 65 Q72 52 62 45 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="52" y="66" font-family="serif" font-size="11" fill="#2A0510">나</text>
<!-- 오른쪽 그릇: 남 -->
<path d="M158 45 Q148 58 154 72 Q161 82 178 80 Q194 78 191 65 Q188 52 178 45 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<text x="170" y="66" font-family="serif" font-size="11" fill="#2A0510">남</text>
<!-- 받침대 -->
<path d="M108 80 L132 80 L125 100 L115 100 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<line x1="100" y1="100" x2="140" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/>
<!-- 화살표 -->
<path d="M35 42 L22 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="22,35 28,32 27,38" fill="#2A0510"/>
<text x="0" y="32" font-family="serif" font-size="7.5" fill="#2A0510">내 입장</text>
<path d="M190 38 L202 30" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="202,30 196,28 197,34" fill="#2A0510"/>
<text x="203" y="28" font-family="serif" font-size="7.5" fill="#2A0510">상대 입장</text>
<text x="42" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.55">내가 싫은 건 남도 싫다 = 황금률</text>
</g></svg></div>`,

    '8_3': `<div class="sayu-sketch"><svg width="240" height="120" viewBox="0 0 240 120" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 계단 -->
<path d="M18 108 L18 88 L55 88 L55 68 L95 68 L95 48 L138 48 L138 28 L182 28 L182 108 Z" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<!-- 계단 라벨 -->
<text x="20" y="103" font-family="serif" font-size="9" fill="#2A0510">나</text>
<text x="57" y="83" font-family="serif" font-size="9" fill="#2A0510">가족</text>
<text x="97" y="63" font-family="serif" font-size="9" fill="#2A0510">나라</text>
<text x="140" y="43" font-family="serif" font-size="9" fill="#2A0510">천하</text>
<!-- 올라가는 사람 -->
<circle cx="15" cy="80" r="7" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<circle cx="13" cy="78" r="1.2" fill="#2A0510"/><circle cx="17" cy="78" r="1.2" fill="#2A0510"/>
<path d="M13 83 Q15 85 17 83" stroke="#2A0510" stroke-width="1.2" fill="none"/>
<!-- 화살표 방향 -->
<path d="M185 85 L200 65" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<polygon points="200,65 194,65 197,71" fill="#2A0510"/>
<text x="185" y="115" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.55">순서가 중요해요!</text>
</g></svg></div>`,

    '8_4': `<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none">${wobbly}
<g filter="url(#wob)">
<!-- 입 -->
<path d="M30 35 Q50 20 82 28 Q95 18 105 30 L102 60 Q88 72 65 66 Q35 58 30 35Z" stroke="#2A0510" stroke-width="2" fill="none"/>
<!-- 혀 같은거 -->
<path d="M55 52 Q65 58 75 52" stroke="#2A0510" stroke-width="2.2" fill="none"/>
<circle cx="52" cy="42" r="3" fill="#2A0510" opacity="0.5"/>
<circle cx="66" cy="38" r="3" fill="#2A0510" opacity="0.5"/>
<circle cx="80" cy="42" r="3" fill="#2A0510" opacity="0.5"/>
<!-- 말 물결 -->
<path d="M108 42 Q118 35 122 45 Q126 55 118 58" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/>
<path d="M122 38 Q132 30 136 42 Q140 52 130 55" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/>
<!-- 발 (행동) -->
<path d="M168 28 Q178 22 192 26 L195 48 Q188 56 175 52 Q162 46 168 28Z" stroke="#2A0510" stroke-width="2" fill="none"/>
<path d="M185 56 L182 72 Q178 80 172 76 Q168 72 170 64 L172 56" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<path d="M165 75 Q162 84 168 85 L185 85 Q192 84 190 76" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<path d="M195 56 L198 72 Q200 80 208 78 Q213 74 210 66 L207 56" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<path d="M205 76 Q205 85 215 85 L225 85 Q228 82 226 76" stroke="#2A0510" stroke-width="1.8" fill="none"/>
<!-- 화살표 -->
<path d="M65 18 L68 8" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="68,8 63,12 69,13" fill="#2A0510"/>
<text x="50" y="6" font-family="serif" font-size="7.5" fill="#2A0510">말(앞세우지 말것)</text>
<path d="M185 22 L185 12" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/>
<polygon points="185,12 181,17 189,17" fill="#2A0510"/>
<text x="158" y="9" font-family="serif" font-size="7.5" fill="#2A0510">행동이 먼저</text>
<path d="M145 45 L163 40" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/>
<polygon points="163,40 157,37 158,43" fill="#2A0510"/>
<text x="30" y="118" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.55">군자: 행동하고 나서 말한다</text>
</g></svg></div>`,
  };

  // 추가 스케치 (id:2~7, 9~10)
  var extraSketches = {
    '10_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="60" r="50" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.15" stroke-dasharray="5 4"/><circle cx="120" cy="60" r="35" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.12" stroke-dasharray="3 3"/><circle cx="120" cy="60" r="20" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2"/><circle cx="120" cy="60" r="5" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M55 20 L58 28 L66 28 L60 33 L62 41 L55 36 L48 41 L50 33 L44 28 L52 28Z" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/><path d="M185 75 L187 81 L193 81 L188 85 L190 91 L185 87 L180 91 L182 85 L177 81 L183 81Z" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.3"/><circle cx="35" cy="55" r="2" fill="#2A0510" opacity="0.4"/><circle cx="205" cy="30" r="2.5" fill="#2A0510" opacity="0.3"/><path d=M127 57 L148 45 stroke="#2A0510" stroke-width="1.3"/><text x="150" y="43" font-family="serif" font-size="7.5" fill="#2A0510">우주(138억년)</text><text x="50" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">코스모스의 바닷가</text></g></svg></div>',
    '10_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><line x1="120" y1="10" x2="120" y2="110" stroke="#2A0510" stroke-width="1.2" opacity="0.3"/><line x1="20" y1="60" x2="220" y2="60" stroke="#2A0510" stroke-width="1.2" opacity="0.3"/><path d="M118 60 L60 58" stroke="#2A0510" stroke-width="2" stroke-linecap="round" opacity="0.5"/><circle cx="55" cy="58" r="5" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M60 95 L60 58" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/><path d="M68 90 Q70 85 68 80 Q66 75 68 70" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.5"/><path d="M155 38 L172 28" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="174" y="27" font-family="serif" font-size="7.5" fill="#2A0510">에라토스테네스</text><text x="40" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">막대기로 지구를 재다</text></g></svg></div>',
    '10_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="55" r="45" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3"/><circle cx="40" cy="40" r="12" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><circle cx="190" cy="35" r="8" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/><circle cx="175" cy="75" r="10" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/><circle cx="55" cy="80" r="6" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.3"/><text x="108" y="60" font-family="serif" font-size="9" fill="#2A0510" opacity="0.4">우리은하</text><text x="35" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">은하수 너머의 세계</text></g></svg></div>',
    '10_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="55" r="4" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="120" cy="55" r="1.5" fill="#2A0510"/><circle cx="50" cy="22" r="2" fill="#2A0510" opacity="0.4"/><circle cx="195" cy="18" r="1.5" fill="#2A0510" opacity="0.35"/><circle cx="40" cy="85" r="2.5" fill="#2A0510" opacity="0.3"/><circle cx="200" cy="82" r="2" fill="#2A0510" opacity="0.4"/><circle cx="22" cy="55" r="1.5" fill="#2A0510" opacity="0.3"/><circle cx="218" cy="55" r="2" fill="#2A0510" opacity="0.3"/><path d="M60 22 L63 30 L71 30 L65 35 L67 43 L60 38 L53 43 L55 35 L49 30 L57 30Z" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.35"/><path d="M125 52 L150 38" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="150,38 144,36 145,42" fill="#2A0510"/><text x="152" y="36" font-family="serif" font-size="7.5" fill="#2A0510">창백한 푸른 점</text><text x="50" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">저 점 위에 모든 역사가</text></g></svg></div>',
    '10_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="55" r="45" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.2" stroke-dasharray="6 4"/><path d="M75 55 Q90 30 120 25 Q150 30 165 55 Q150 80 120 85 Q90 80 75 55Z" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><circle cx="120" cy="55" r="8" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M145 38 L162 28" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="162,28 156,26 157,32" fill="#2A0510"/><text x="164" y="27" font-family="serif" font-size="7.5" fill="#2A0510">우리가 그 존재</text><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">별의 먼지가 별을 이해해</text></g></svg></div>',
    '2_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="80" cy="55" r="30" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M65 45 Q80 35 95 45" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/><circle cx="73" cy="53" r="3" fill="#2A0510"/><circle cx="87" cy="53" r="3" fill="#2A0510"/><path d="M73 65 Q80 70 87 65" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M90 38 L110 28" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="110,28 104,26 105,32" fill="#2A0510"/><text x="112" y="27" font-family="serif" font-size="8" fill="#2A0510">오르한</text><circle cx="165" cy="45" r="22" stroke="#2A0510" stroke-width="2" fill="none"/><text x="152" y="50" font-family="serif" font-size="18" font-weight="bold" fill="#2A0510">빨강</text><path d="M50 90 L195 90" stroke="#2A0510" stroke-width="1" opacity="0.3" stroke-dasharray="4 3"/><text x="65" y="108" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">이스탄불의 이야기꾼들</text></g></svg></div>',
    '2_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 80 L30 30 L80 10 L130 30 L130 80" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M30 80 L130 80" stroke="#2A0510" stroke-width="2"/><rect x="55" y="50" width="30" height="30" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M55 50 L70 35 L85 50" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="170" cy="50" r="20" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M158 45 L182 45 M158 55 L182 55" stroke="#2A0510" stroke-width="1.2" opacity="0.5"/><path d="M155 88 L170 75" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="170,75 164,74 165,80" fill="#2A0510"/><text x="140" y="100" font-family="serif" font-size="7.5" fill="#2A0510" opacity="0.6">미니아튀르 화가</text></g></svg></div>',
    '2_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M40 100 L40 40 M40 40 L120 40 M40 70 L100 70" stroke="#2A0510" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="160" cy="55" r="25" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.5"/><path d="M148 48 Q160 40 172 48" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="154" cy="54" r="2.5" fill="#2A0510"/><circle cx="166" cy="54" r="2.5" fill="#2A0510"/><text x="148" y="70" font-family="serif" font-size="9" fill="#2A0510">흰색</text><text x="65" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">빛과 어둠 사이</text></g></svg></div>',
    '2_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">🎨</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.4</text></g></svg></div>',
    '2_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">✒️</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.5</text></g></svg></div>',
    '2_5': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">🖼️</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.6</text></g></svg></div>',
    '2_6': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">👁️</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.7</text></g></svg></div>',
    '2_7': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">🗡️</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.8</text></g></svg></div>',
    '2_8': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">🏛️</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.9</text></g></svg></div>',
    '2_9': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="90" y="65" font-family="serif" font-size="40" fill="#2A0510" opacity="0.3">📜</text><circle cx="120" cy="60" r="45" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.2" stroke-dasharray="4 3"/><text x="55" y="110" font-family="serif" font-size="8" fill="#2A0510" opacity="0.4">내 이름은 빨강 Ch.10</text></g></svg></div>',
    '3_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="75" cy="35" r="18" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="68" cy="32" r="2.5" fill="#2A0510"/><circle cx="82" cy="32" r="2.5" fill="#2A0510"/><path d="M68 42 Q75 47 82 42" stroke="#2A0510" stroke-width="2" fill="none"/><line x1="75" y1="53" x2="74" y2="85" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="74" y1="65" x2="55" y2="78" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="74" y1="65" x2="95" y2="75" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="74" y1="85" x2="65" y2="110" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="74" y1="85" x2="83" y2="110" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="20" r="8" stroke="#2A0510" stroke-width="1.5" fill="none"/><text x="30" y="20" font-family="serif" font-size="7">B-612</text><path d="M95 20 L118 12" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="118,12 112,10 113,16" fill="#2A0510"/><text x="120" y="12" font-family="serif" font-size="8" fill="#2A0510">어린왕자</text><text x="45" y="125" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">★ 중요한건 눈에 안보여</text></g></svg></div>',
    '3_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 80 Q80 40 100 30 Q120 20 120 60 Q120 90 80 80Z" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M95 35 L90 25" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><circle cx="90" cy="23" r="3" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M85 55 Q100 60 110 50" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M55 45 L35 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="35,35 41,32 40,38" fill="#2A0510"/><text x="5" y="33" font-family="serif" font-size="7.5" fill="#2A0510">장미(까다로움)</text><text x="50" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">허영심 뒤의 진심</text></g></svg></div>',
    '3_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="60" cy="55" r="15" stroke="#2A0510" stroke-width="1.8" fill="none"/><text x="51" y="60" font-family="serif" font-size="11" fill="#2A0510">왕</text><circle cx="120" cy="45" r="15" stroke="#2A0510" stroke-width="1.8" fill="none"/><text x="109" y="50" font-family="serif" font-size="9" fill="#2A0510">허영쟁</text><circle cx="180" cy="55" r="15" stroke="#2A0510" stroke-width="1.8" fill="none"/><text x="170" y="60" font-family="serif" font-size="9" fill="#2A0510">사업가</text><path d="M40 90 L200 90" stroke="#2A0510" stroke-width="1" opacity="0.3"/><text x="55" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">어른들의 이상한 별들</text></g></svg></div>',
    '3_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="70" cy="55" r="20" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="65" cy="50" r="3" fill="#2A0510"/><circle cx="75" cy="50" r="3" fill="#2A0510"/><path d="M64 62 Q70 66 76 62" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M65 40 L60 28" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><circle cx="60" cy="26" r="2.5" stroke="#2A0510" stroke-width="1.2" fill="none"/><path d="M160 55 Q148 40 162 30 Q175 22 182 35 L178 60 Q168 68 155 60 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><text x="155" y="50" font-family="serif" font-size="8.5" fill="#2A0510">길들인다</text><path d=M155 62 L140 72 stroke="#2A0510" stroke-width="1.3"/><text x="55" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">여우가 가르쳐준 비밀</text></g></svg></div>',
    '3_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M40 65 Q55 45 75 55 Q90 62 80 78 Q70 92 50 85 Q30 78 40 65Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="195" cy="25" r="3" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="168" cy="40" r="2" fill="#2A0510" opacity="0.5"/><circle cx="185" cy="58" r="2.5" fill="#2A0510" opacity="0.4"/><circle cx="155" cy="22" r="1.5" fill="#2A0510" opacity="0.4"/><path d="M140 75 L158 65" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="158,65 152,63 153,69" fill="#2A0510"/><text x="105" y="78" font-family="serif" font-size="7.5" fill="#2A0510">별로 돌아가는 길</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">★ 마음으로 봐야해</text></g></svg></div>',
    '4_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M20 100 Q60 20 120 15 Q180 20 220 100" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M90 15 L85 5 M120 12 L120 2 M150 15 L155 5" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/><rect x="40" y="75" width="50" height="25" rx="3" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="180" cy="55" r="14" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="175" cy="52" r="2" fill="#2A0510"/><circle cx="184" cy="52" r="2" fill="#2A0510"/><path d="M175 60 Q180 63 184 60" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.6"/><path d=M155 55 L168 58 stroke="#2A0510" stroke-width="1.3"/><text x="130" y="52" font-family="serif" font-size="7.5" fill="#2A0510">해리</text><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">킬리만자로 기슭 텐트</text></g></svg></div>',
    '4_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 90 L30 40 L90 10 L150 40 L150 90" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.4"/><path d="M30 90 L150 90" stroke="#2A0510" stroke-width="1.8" opacity="0.4"/><path d="M75 55 L90 30 L105 55" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M185 25 Q195 15 205 22 L205 55 Q197 62 187 56 Q178 48 185 25Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><text x="183" y="43" font-family="serif" font-size="8" fill="#2A0510">미룬</text><text x="180" y="53" font-family="serif" font-size="8" fill="#2A0510">소설들</text><text x="35" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">쓰지 못한 이야기들...</text></g></svg></div>',
    '4_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M40 100 Q80 20 120 80 Q160 20 200 100" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.5"/><circle cx="120" cy="50" r="25" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M155 30 L170 22" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="170,22 164,20 165,26" fill="#2A0510"/><text x="172" y="21" font-family="serif" font-size="8" fill="#2A0510">표범(고귀함)</text><text x="50" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">이유없이 정상을 향해</text></g></svg></div>',
    '4_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="75" cy="45" r="18" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="70" cy="42" r="2.5" fill="#2A0510"/><circle cx="80" cy="42" r="2.5" fill="#2A0510"/><path d="M70 52 Q75 55 80 52" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.6"/><circle cx="165" cy="45" r="18" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="160" cy="42" r="2.5" fill="#2A0510"/><circle cx="170" cy="42" r="2.5" fill="#2A0510"/><path d="M160 55 Q165 50 170 55" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M95 45 L145 45" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"/><path d="M80 28 L100 20" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="102" y="19" font-family="serif" font-size="7.5" fill="#2A0510">해리</text><path d="M148 28 L130 20" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="110" y="19" font-family="serif" font-size="7.5" fill="#2A0510">헬렌</text><text x="55" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">탓은 내가 아닐까</text></g></svg></div>',
    '4_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 100 Q60 40 120 10 Q180 40 210 100" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M110 8 L110 2" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><path d="M95 12 L90 4 M125 12 L130 4" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/><text x="95" y="0" font-family="serif" font-size="8" fill="#2A0510" opacity="0.7">눈 덮인 정상</text><path d="M170 55 L190 45" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="190,45 184,43 185,49" fill="#2A0510"/><text x="192" y="44" font-family="serif" font-size="7.5" fill="#2A0510">✈️환상</text><text x="50" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">마지막 눈부신 정상</text></g></svg></div>',
    '5_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="70" cy="40" r="18" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="64" cy="37" r="2.5" fill="#2A0510"/><circle cx="76" cy="37" r="2.5" fill="#2A0510"/><path d="M64 48 Q70 52 76 48" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.6"/><path d="M50 34 L38 30" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><path d="M50 40 L38 42" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><line x1="70" y1="58" x2="69" y2="90" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="69" y1="70" x2="50" y2="82" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="69" y1="70" x2="90" y2="78" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><path d="M155 30 Q165 18 185 25 L183 55 Q172 63 158 57 Q145 48 155 30Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><text x="157" y="42" font-family="serif" font-size="8" fill="#2A0510">역사는</text><text x="157" y="53" font-family="serif" font-size="8" fill="#2A0510">악몽이다</text><text x="40" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">스티븐의 아침</text></g></svg></div>',
    '5_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><line x1="40" y1="30" x2="200" y2="30" stroke="#2A0510" stroke-width="1.2" opacity="0.3"/><circle cx="80" cy="60" r="16" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="75" cy="57" r="2" fill="#2A0510"/><circle cx="85" cy="57" r="2" fill="#2A0510"/><path d="M75 67 Q80 70 85 67" stroke="#2A0510" stroke-width="1.5" fill="none"/><line x1="80" y1="76" x2="79" y2="100" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="79" y1="86" x2="63" y2="95" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><line x1="79" y1="86" x2="97" y2="93" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><path d="M105 55 Q115 45 125 55 Q135 65 125 75 Q115 82 105 72 Q98 63 105 55Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><text x="107" y="67" font-family="serif" font-size="8" fill="#2A0510">광고</text><text x="108" y="77" font-family="serif" font-size="8" fill="#2A0510">외판원</text><path d="M50 18 L62 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="64" y="9" font-family="serif" font-size="7.5" fill="#2A0510">블룸(평범한 하루)</text><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">6월 16일 더블린</text></g></svg></div>',
    '5_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><rect x="25" y="20" width="70" height="90" rx="3" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M33 38 L87 38 M33 50 L87 50 M33 62 L70 62 M33 74 L87 74 M33 86 L60 86" stroke="#2A0510" stroke-width="1" opacity="0.5"/><text x="35" y="32" font-family="serif" font-size="8" fill="#2A0510">도서관</text><circle cx="168" cy="55" r="20" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="162" cy="51" r="2.5" fill="#2A0510"/><circle cx="174" cy="51" r="2.5" fill="#2A0510"/><path d="M162 62 Q168 58 174 62" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M148 42 L132 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="110" y="33" font-family="serif" font-size="7.5" fill="#2A0510">시민(민족주의자)</text><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">도서관과 술집</text></g></svg></div>',
    '5_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M60 80 Q70 55 85 70 Q95 82 80 92 Q65 100 60 80Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M160 75 Q170 50 185 65 Q195 77 180 87 Q165 95 160 75Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M90 85 L145 80" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3 3" opacity="0.5"/><path d="M130 30 L150 20" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="150,20 144,18 145,24" fill="#2A0510"/><text x="152" y="19" font-family="serif" font-size="7.5" fill="#2A0510">욕망의 밤</text><text x="50" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">현실과 환상의 경계</text></g></svg></div>',
    '5_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 65 Q90 55 95 65 Q90 75 80 65Z" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.7"/><text x="60" y="100" font-family="serif" font-size="14" font-weight="bold" fill="#2A0510">Yes</text><circle cx="170" cy="55" r="28" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="5 3"/><text x="148" y="60" font-family="serif" font-size="12" fill="#2A0510" opacity="0.5">Yes</text><path d=M55 55 L68 48 stroke="#2A0510" stroke-width="1.3"/><text x="35" y="45" font-family="serif" font-size="7.5" fill="#2A0510">몰리의 대답</text><text x="50" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">삶 전체에 Yes</text></g></svg></div>',
    '6_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 80 L55 60 L90 55 L130 60 L160 75 L190 70" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.5"/><circle cx="65" cy="45" r="14" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="60" cy="42" r="2" fill="#2A0510"/><circle cx="70" cy="42" r="2" fill="#2A0510"/><path d="M60 50 Q65 53 70 50" stroke="#2A0510" stroke-width="1.5" fill="none"/><line x1="65" y1="59" x2="64" y2="85" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="64" y1="70" x2="48" y2="80" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="64" y1="70" x2="82" y2="77" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><path d="M160 45 Q180 25 210 40 Q220 60 205 72 Q190 82 170 72 Q155 62 160 45Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M210 38 Q215 30 220 35" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M148 38 L130 28" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="100" y="27" font-family="serif" font-size="7.5" fill="#2A0510">이슈마엘(나를 이슈마엘이라 불러라)</text></g></svg></div>',
    '6_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><rect x="20" y="30" width="40" height="30" rx="3" stroke="#2A0510" stroke-width="1.8" fill="none"/><line x1="40" y1="60" x2="39" y2="100" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><path d="M25 75 L60 72" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><circle cx="150" cy="55" r="28" stroke="#2A0510" stroke-width="2" fill="none"/><text x="128" y="60" font-family="serif" font-size="14" font-weight="bold" fill="#2A0510">고래</text><path d="M85 50 L118 52" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3 2"/><text x="25" y="22" font-family="serif" font-size="7.5" fill="#2A0510">에이헤브(광기)</text><text x="40" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">복수냐 귀환이냐</text></g></svg></div>',
    '6_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M120 110 Q120 20 120 10" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/><path d="M50 110 Q120 20 190 110" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.4"/><circle cx="120" cy="55" r="35" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="6 4"/><text x="95" y="60" font-family="serif" font-size="12" fill="#2A0510" opacity="0.5">흰色</text><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">흰 고래 = 무엇인가</text></g></svg></div>',
    '6_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 85 Q60 20 90 50 Q120 80 150 20 Q180 50 210 35" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.6"/><path d="M65 35 L82 25" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="82,25 76,23 77,29" fill="#2A0510"/><text x="84" y="24" font-family="serif" font-size="7.5" fill="#2A0510">집착↑</text><path d="M185 32 L202 22" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="202,22 196,20 197,26" fill="#2A0510"/><text x="203" y="21" font-family="serif" font-size="7.5" fill="#2A0510">광기↑</text><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">멈출 수 없어..</text></g></svg></div>',
    '6_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 110 Q120 20 160 110" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M30 75 L80 110 L160 110 L210 75" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M175 60 Q195 40 215 55 Q220 75 210 82 Q195 90 178 80 Q165 70 175 60Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M215 53 Q220 45 225 50" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M160 108 L162 95" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="162,95 158,100 164,101" fill="#2A0510"/><text x="130" y="90" font-family="serif" font-size="7.5" fill="#2A0510">침몰</text><text x="40" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">파멸과 홀로남은 자</text></g></svg></div>',
    '7_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><rect x="15" y="15" width="120" height="90" rx="3" stroke="#2A0510" stroke-width="2" fill="none"/><rect x="25" y="25" width="100" height="65" rx="2" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.6"/><circle cx="75" cy="55" r="15" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="70" cy="52" r="2.5" fill="#2A0510"/><circle cx="80" cy="52" r="2.5" fill="#2A0510"/><path d="M170 30 L175 22" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="150" y="20" font-family="serif" font-size="8" fill="#2A0510">빅브라더가</text><text x="155" y="30" font-family="serif" font-size="8" fill="#2A0510">보고있다</text><path d=M140 35 L135 55 stroke="#2A0510" stroke-width="1.2" opacity="0.4"/><text x="45" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">텔레스크린 감시</text></g></svg></div>',
    '7_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="75" cy="55" r="20" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="165" cy="55" r="20" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M95 55 L145 55" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><text x="112" y="51" font-family="serif" font-size="11" fill="#2A0510">♡</text><path d="M68 48 Q75 44 82 48" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.5"/><path d="M158 48 Q165 44 172 48" stroke="#2A0510" stroke-width="1.2" fill="none" opacity="0.5"/><path d="M60 28 L48 18" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="25" y="16" font-family="serif" font-size="7.5" fill="#2A0510">윈스턴</text><path d="M175 28 L188 18" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><text x="190" y="16" font-family="serif" font-size="7.5" fill="#2A0510">줄리아</text><text x="50" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">사랑이 곧 저항</text></g></svg></div>',
    '7_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><text x="50" y="80" font-family="serif" font-size="42" font-weight="bold" fill="#2A0510">2+2=</text><text x="158" y="80" font-family="serif" font-size="42" font-weight="bold" fill="#2A0510">5</text><path d="M20 90 L220 90" stroke="#2A0510" stroke-width="1.2" opacity="0.3"/><path d=M195 75 L208 62 stroke="#2A0510" stroke-width="1.3"/><text x="180" y="58" font-family="serif" font-size="8" fill="#2A0510">당이 말하면</text><text x="182" y="68" font-family="serif" font-size="8" fill="#2A0510">진실이다</text><text x="50" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">진실의 재정의</text></g></svg></div>',
    '7_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="50" r="35" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="113" cy="44" r="5" fill="#2A0510"/><circle cx="127" cy="44" r="5" fill="#2A0510"/><path d="M110 60 Q120 56 130 60" stroke="#2A0510" stroke-width="2.5" fill="none"/><text x="82" y="100" font-family="serif" font-size="10" fill="#2A0510">나는 빅브라더를</text><text x="88" y="112" font-family="serif" font-size="10" fill="#2A0510">사랑했다</text></g></svg></div>',
    '9_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="55" r="40" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M80 55 L90 45 L95 55 L90 65 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M150 55 L160 45 L165 55 L160 65 Z" stroke="#2A0510" stroke-width="1.8" fill="none"/><line x1="95" y1="55" x2="150" y2="55" stroke="#2A0510" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.5"/><text x="108" y="52" font-family="serif" font-size="8" fill="#2A0510" opacity="0.6">선</text><text x="108" y="62" font-family="serif" font-size="8" fill="#2A0510" opacity="0.6">악</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">두 개의 세계</text></g></svg></div>',
    '9_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 80 L90 20 L120 10 L150 20 L160 80" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.5"/><circle cx="120" cy="45" r="20" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="114" cy="41" r="2.5" fill="#2A0510"/><circle cx="126" cy="41" r="2.5" fill="#2A0510"/><path d="M114 52 Q120 56 126 52" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.6"/><path d="M145 28 L162 18" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="162,18 156,16 157,22" fill="#2A0510"/><text x="164" y="17" font-family="serif" font-size="8" fill="#2A0510">데미안</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">카인의 표식</text></g></svg></div>',
    '9_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="120" cy="50" r="30" stroke="#2A0510" stroke-width="2" fill="none"/><text x="100" y="42" font-family="serif" font-size="10" fill="#2A0510">아프락</text><text x="103" y="56" font-family="serif" font-size="10" fill="#2A0510">사스</text><path d="M90 50 L60 35" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="60,35 66,33 65,39" fill="#2A0510"/><text x="30" y="32" font-family="serif" font-size="7.5" fill="#2A0510">선+악=통합</text><path d=M155 50 L175 42 stroke="#2A0510" stroke-width="1.3"/><text x="177" y="41" font-family="serif" font-size="7.5" fill="#2A0510">피스토리우스</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">방황이 성장이다</text></g></svg></div>',
    '9_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 85 Q100 40 120 30 Q140 20 160 45 Q175 65 160 85" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.5"/><circle cx="120" cy="55" r="22" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="114" cy="50" r="2.5" fill="#2A0510"/><circle cx="126" cy="50" r="2.5" fill="#2A0510"/><path d="M114 61 Q120 65 126 61" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M145 38 L160 28" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="160,28 154,26 155,32" fill="#2A0510"/><text x="162" y="27" font-family="serif" font-size="7.5" fill="#2A0510">에바부인(이상)</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">진짜 원함의 힘</text></g></svg></div>',
    '9_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M120 20 Q140 40 135 65 Q130 85 120 90 Q110 85 105 65 Q100 40 120 20Z" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M100 20 Q90 30 95 40" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M140 20 Q150 30 145 40" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M145 55 L162 48" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="162,48 156,46 157,52" fill="#2A0510"/><text x="164" y="47" font-family="serif" font-size="7.5" fill="#2A0510">내 안을 봐</text><text x="45" y="115" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">데미안은 내 안에 있었다</text></g></svg></div>',
    '21_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><ellipse cx="80" cy="85" rx="35" ry="16" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.7"/><path d="M55 85 Q50 75 55 65 Q60 58 70 60" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="72" cy="58" r="9" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="69" cy="56" r="1.5" fill="#2A0510"/><path d="M108 82 Q115 78 110 72" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M60 100 L62 90 M75 100 L75 90 M88 100 L88 90 M100 100 L100 90" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/><circle cx="155" cy="50" r="14" stroke="#2A0510" stroke-width="1.8" fill="none"/><circle cx="150" cy="47" r="2" fill="#2A0510"/><circle cx="160" cy="47" r="2" fill="#2A0510"/><path d="M150 56 Q155 60 160 56" stroke="#2A0510" stroke-width="1.5" fill="none"/><line x1="155" y1="64" x2="155" y2="90" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="155" y1="74" x2="140" y2="85" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><line x1="155" y1="74" x2="170" y2="82" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><path d="M168 35 L185 25" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="185,25 179,23 180,29" fill="#2A0510"/><text x="187" y="24" font-family="serif" font-size="7.5" fill="#2A0510">네로</text><text x="40" y="120" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">파트라슈를 구하다</text></g></svg></div>',
    '21_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M60 100 L75 30 M90 100 L75 30" stroke="#2A0510" stroke-width="1.8" fill="none"/><line x1="55" y1="80" x2="95" y2="80" stroke="#2A0510" stroke-width="1.3"/><rect x="63" y="38" width="28" height="36" rx="2" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M67 48 Q77 42 83 50 Q87 56 80 60 Q73 64 67 58" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.5"/><path d="M95 95 L105 80 Q115 65 120 55" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/><path d="M160 100 L160 40 Q160 25 175 25 Q190 25 190 40 L190 100" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M160 40 Q175 30 190 40" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.4"/><circle cx="200" cy="30" r="2" fill="#2A0510" opacity="0.3"/><circle cx="148" cy="35" r="2" fill="#2A0510" opacity="0.3"/><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">대성당의 루벤스</text></g></svg></div>',
    '22_0': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="70" cy="40" r="12" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="66" cy="38" r="2" fill="#2A0510"/><path d="M64 46 Q70 50 76 46" stroke="#2A0510" stroke-width="1.5" fill="none"/><line x1="70" y1="52" x2="70" y2="85" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="65" x2="50" y2="78" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><line x1="70" y1="65" x2="90" y2="58" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><line x1="90" y1="58" x2="130" y2="55" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="3 2"/><path d="M40 95 Q80 85 120 90 Q160 95 200 88" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.4"/><circle cx="160" cy="50" r="10" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="157" cy="48" r="1.5" fill="#2A0510"/><path d="M156 55 Q160 57 164 55" stroke="#2A0510" stroke-width="1" fill="none"/><line x1="160" y1="60" x2="160" y2="80" stroke="#2A0510" stroke-width="1.5"/><line x1="145" y1="70" x2="160" y2="72" stroke="#2A0510" stroke-width="1.3"/><text x="85" y="50" font-family="serif" font-size="7" fill="#2A0510" opacity="0.5">낚싯줄</text><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">84일째, 빈손의 노인</text></g></svg></div>',
    '22_1': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M80 65 Q90 55 100 65 Q110 55 120 65 Q130 55 140 65" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M60 75 Q80 65 100 75 Q120 65 140 75 Q160 65 180 75" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.25"/><path d="M95 60 L120 60 Q125 60 125 55 L125 50 Q125 45 120 45 L100 45 Q95 45 95 50 Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="107" cy="40" r="7" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="105" cy="38" r="1.5" fill="#2A0510"/><line x1="110" y1="52" x2="110" y2="90" stroke="#2A0510" stroke-width="1" stroke-dasharray="2 3" opacity="0.5"/><line x1="108" y1="52" x2="108" y2="105" stroke="#2A0510" stroke-width="1" stroke-dasharray="2 3" opacity="0.4"/><path d="M100 100 Q110 105 120 100" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3"/><circle cx="40" cy="25" r="12" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.2"/><text x="55" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">먼 바다, 혼자</text></g></svg></div>',
    '22_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><circle cx="80" cy="35" r="12" stroke="#2A0510" stroke-width="2" fill="none"/><circle cx="77" cy="33" r="2" fill="#2A0510"/><path d="M75 40 Q80 38 85 40" stroke="#2A0510" stroke-width="1.3" fill="none"/><line x1="80" y1="47" x2="80" y2="80" stroke="#2A0510" stroke-width="2"/><line x1="80" y1="60" x2="55" y2="50" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="80" y1="60" x2="55" y2="70" stroke="#2A0510" stroke-width="1.8" stroke-linecap="round"/><line x1="55" y1="50" x2="55" y2="70" stroke="#2A0510" stroke-width="2.5" stroke-linecap="round"/><circle cx="55" cy="55" r="3" fill="#2A0510" opacity="0.3"/><circle cx="55" cy="65" r="3" fill="#2A0510" opacity="0.3"/><path d="M55 70 L40 90 Q30 100 20 95" stroke="#2A0510" stroke-width="1.5" fill="none" stroke-dasharray="3 2"/><circle cx="180" cy="30" r="18" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.3"/><path d="M175 25 Q180 20 185 25" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.3"/><text x="170" y="55" font-family="serif" font-size="7" fill="#2A0510" opacity="0.4">달</text><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">이틀 밤낮, 줄을 놓지 않다</text></g></svg></div>',
    '22_3': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M40 70 L90 70 Q95 70 95 65 L95 60 Q95 55 90 55 L45 55 Q40 55 40 60 Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><path d="M95 62 L200 50" stroke="#2A0510" stroke-width="2.5" fill="none"/><path d="M200 40 Q210 45 200 55 Q195 60 190 55 L200 40Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="195" cy="47" r="2" fill="#2A0510"/><path d="M200 55 L220 90" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.5" stroke-dasharray="3 2"/><path d="M30 80 Q70 75 110 80 Q150 85 190 78" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.3"/><path d="M50 62 L55 50" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round"/><polygon points="55,50 52,55 58,55" fill="#2A0510"/><text x="35" y="45" font-family="serif" font-size="7" fill="#2A0510">작살</text><text x="140" y="38" font-family="serif" font-size="7" fill="#2A0510" opacity="0.5">배보다 큰 물고기</text><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">드디어, 청새치를 잡다</text></g></svg></div>',
    '22_4': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M30 60 L60 60 M60 55 L80 55 M80 60 L120 60 M120 55 L150 55 M150 60 L180 60" stroke="#2A0510" stroke-width="2" stroke-linecap="round"/><line x1="60" y1="50" x2="60" y2="70" stroke="#2A0510" stroke-width="1.5"/><line x1="80" y1="50" x2="80" y2="70" stroke="#2A0510" stroke-width="1.5"/><line x1="120" y1="50" x2="120" y2="70" stroke="#2A0510" stroke-width="1.5"/><line x1="150" y1="50" x2="150" y2="70" stroke="#2A0510" stroke-width="1.5"/><circle cx="105" cy="57" r="3" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.4"/><path d="M50 85 Q60 80 70 85 L65 90 Q55 95 50 85Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="58" cy="83" r="1.5" fill="#2A0510"/><path d="M160 85 Q170 80 180 85 L175 90 Q165 95 160 85Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="168" cy="83" r="1.5" fill="#2A0510"/><path d="M100 90 Q110 85 120 90 L115 95 Q105 100 100 90Z" stroke="#2A0510" stroke-width="1.5" fill="none"/><circle cx="108" cy="88" r="1.5" fill="#2A0510"/><path d="M60 30 Q80 20 100 25" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.3"/><circle cx="60" cy="30" r="5" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.2"/><text x="35" y="118" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">뼈만 남은 청새치, 상어 떼</text></g></svg></div>',
    '21_2': '<div class="sayu-sketch"><svg width="240" height="130" viewBox="0 0 240 130" fill="none"><defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter="url(#wob)"><path d="M100 10 L100 80 Q100 90 110 90 L130 90 Q140 90 140 80 L140 10" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.3"/><path d="M100 10 Q120 0 140 10" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.3"/><line x1="120" y1="0" x2="120" y2="90" stroke="#2A0510" stroke-width="0.8" opacity="0.2"/><line x1="100" y1="45" x2="140" y2="45" stroke="#2A0510" stroke-width="0.8" opacity="0.2"/><path d="M30 105 Q50 95 80 100 Q110 105 140 100" stroke="#2A0510" stroke-width="1.5" fill="none"/><ellipse cx="55" cy="100" rx="18" ry="8" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.5"/><circle cx="38" cy="97" r="7" stroke="#2A0510" stroke-width="1.3" fill="none" opacity="0.7"/><circle cx="35" cy="95" r="1.5" fill="#2A0510" opacity="0.5"/><path d="M35 101 Q38 103 41 101" stroke="#2A0510" stroke-width="1" fill="none" opacity="0.5"/><circle cx="185" cy="25" r="3" fill="#2A0510" opacity="0.2"/><circle cx="205" cy="45" r="2" fill="#2A0510" opacity="0.2"/><circle cx="175" cy="50" r="2.5" fill="#2A0510" opacity="0.2"/><circle cx="195" cy="70" r="2" fill="#2A0510" opacity="0.2"/><circle cx="168" cy="30" r="2" fill="#2A0510" opacity="0.15"/><path d="M155 15 L165 10" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="165,10 159,8 160,14" fill="#2A0510"/><text x="167" y="10" font-family="serif" font-size="7.5" fill="#2A0510">루벤스의 빛</text><text x="30" y="120" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">함께한 마지막 밤</text></g></svg></div>',
  };
  var sketchKey = bookIdx + '_' + chIdx;
  if (sketches[sketchKey]) return sketches[sketchKey];
  if (extraSketches[sketchKey]) return extraSketches[sketchKey];

  // AI로 추가된 책 기본 스케치 (책마다 다른 패턴)
  var w = '<defs><filter id="wob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';

  // ── 키워드 기반 스케치 자동 생성 (AI 추가 책) ──
  if (bookIdx >= 11) {
    var ch = BOOKS[bookIdx] && BOOKS[bookIdx].chapters ? BOOKS[bookIdx].chapters[chIdx] : null;
    if (ch && ch.sk) {
      var c = '#2A0510';
      var skLib = {
        'mountain': '<path d="M30 95 L80 25 L130 95Z" stroke="C" stroke-width="2" fill="none"/><path d="M70 95 L110 45 L150 95" stroke="C" stroke-width="1.5" fill="none" opacity="0.4"/><circle cx="170" cy="30" r="10" stroke="C" stroke-width="1.5" fill="none"/>',
        'tree': '<line x1="100" y1="95" x2="100" y2="45" stroke="C" stroke-width="2.5" stroke-linecap="round"/><circle cx="100" cy="35" r="25" stroke="C" stroke-width="2" fill="none"/><circle cx="85" cy="42" r="12" stroke="C" stroke-width="1.5" fill="none" opacity="0.5"/><circle cx="115" cy="42" r="12" stroke="C" stroke-width="1.5" fill="none" opacity="0.5"/>',
        'river': '<path d="M20 40 Q60 25 100 45 Q140 65 180 35" stroke="C" stroke-width="2" fill="none"/><path d="M20 55 Q60 40 100 60 Q140 80 180 50" stroke="C" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M20 70 Q60 55 100 75 Q140 95 180 65" stroke="C" stroke-width="1" fill="none" opacity="0.3"/>',
        'sea': '<path d="M15 50 Q40 35 65 50 Q90 65 115 50 Q140 35 165 50 Q190 65 210 50" stroke="C" stroke-width="2" fill="none"/><path d="M15 65 Q40 50 65 65 Q90 80 115 65 Q140 50 165 65 Q190 80 210 65" stroke="C" stroke-width="1.5" fill="none" opacity="0.5"/><circle cx="170" cy="25" r="12" stroke="C" stroke-width="1.5" fill="none"/>',
        'flower': '<circle cx="110" cy="40" r="10" stroke="C" stroke-width="2" fill="none"/><path d="M100 30 Q110 15 120 30" stroke="C" stroke-width="1.5" fill="none"/><path d="M120 30 Q135 40 120 50" stroke="C" stroke-width="1.5" fill="none"/><path d="M120 50 Q110 65 100 50" stroke="C" stroke-width="1.5" fill="none"/><path d="M100 50 Q85 40 100 30" stroke="C" stroke-width="1.5" fill="none"/><line x1="110" y1="50" x2="110" y2="95" stroke="C" stroke-width="2" stroke-linecap="round"/>',
        'star': '<path d="M110 15 L118 38 L142 38 L123 52 L130 75 L110 62 L90 75 L97 52 L78 38 L102 38Z" stroke="C" stroke-width="2" fill="none"/><circle cx="55" cy="30" r="3" fill="C" opacity="0.3"/><circle cx="170" cy="25" r="2" fill="C" opacity="0.3"/>',
        'moon': '<path d="M120 20 Q100 20 90 40 Q80 60 90 80 Q100 100 120 100 Q105 85 100 60 Q105 35 120 20Z" stroke="C" stroke-width="2" fill="none"/><circle cx="160" cy="30" r="2" fill="C" opacity="0.3"/><circle cx="145" cy="70" r="1.5" fill="C" opacity="0.3"/>',
        'person': '<circle cx="100" cy="25" r="13" stroke="C" stroke-width="2.2" fill="none"/><line x1="100" y1="38" x2="100" y2="70" stroke="C" stroke-width="2.2" stroke-linecap="round"/><line x1="100" y1="50" x2="80" y2="62" stroke="C" stroke-width="2" stroke-linecap="round"/><line x1="100" y1="50" x2="120" y2="62" stroke="C" stroke-width="2" stroke-linecap="round"/><line x1="100" y1="70" x2="88" y2="95" stroke="C" stroke-width="2" stroke-linecap="round"/><line x1="100" y1="70" x2="112" y2="95" stroke="C" stroke-width="2" stroke-linecap="round"/>',
        'heart': '<path d="M110 85 Q70 55 80 35 Q90 18 110 35 Q130 18 140 35 Q150 55 110 85Z" stroke="C" stroke-width="2.2" fill="none"/>',
        'tear': '<path d="M110 25 Q100 50 100 65 Q100 85 110 90 Q120 85 120 65 Q120 50 110 25Z" stroke="C" stroke-width="2" fill="none"/><circle cx="108" cy="60" r="3" fill="C" opacity="0.2"/>',
        'eye': '<path d="M60 55 Q110 20 160 55 Q110 90 60 55Z" stroke="C" stroke-width="2" fill="none"/><circle cx="110" cy="55" r="15" stroke="C" stroke-width="1.5" fill="none"/><circle cx="110" cy="55" r="6" fill="C" opacity="0.4"/>',
        'hand': '<path d="M90 90 L90 50 M90 50 L85 25 M90 50 L95 20 M90 50 L105 22 M90 50 L112 28" stroke="C" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M80 50 L75 35" stroke="C" stroke-width="2" stroke-linecap="round"/>',
        'book': '<rect x="65" y="25" width="50" height="65" rx="2" stroke="C" stroke-width="2" fill="none"/><line x1="90" y1="25" x2="90" y2="90" stroke="C" stroke-width="2"/><path d="M72 40 L87 40 M72 50 L87 50 M72 60 L85 60" stroke="C" stroke-width="1" opacity="0.5"/>',
        'house': '<path d="M50 55 L110 20 L170 55" stroke="C" stroke-width="2" fill="none"/><rect x="60" y="55" width="100" height="40" stroke="C" stroke-width="2" fill="none"/><rect x="95" y="65" width="20" height="30" stroke="C" stroke-width="1.5" fill="none"/>',
        'key': '<circle cx="80" cy="40" r="15" stroke="C" stroke-width="2" fill="none"/><line x1="95" y1="40" x2="155" y2="40" stroke="C" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="40" x2="140" y2="55" stroke="C" stroke-width="2" stroke-linecap="round"/><line x1="150" y1="40" x2="150" y2="50" stroke="C" stroke-width="2" stroke-linecap="round"/>',
        'clock': '<circle cx="110" cy="55" r="35" stroke="C" stroke-width="2" fill="none"/><line x1="110" y1="55" x2="110" y2="30" stroke="C" stroke-width="2" stroke-linecap="round"/><line x1="110" y1="55" x2="130" y2="55" stroke="C" stroke-width="1.5" stroke-linecap="round"/><circle cx="110" cy="55" r="3" fill="C"/>',
        'mirror': '<ellipse cx="110" cy="50" rx="30" ry="40" stroke="C" stroke-width="2" fill="none"/><line x1="110" y1="90" x2="110" y2="105" stroke="C" stroke-width="2.5" stroke-linecap="round"/><line x1="95" y1="105" x2="125" y2="105" stroke="C" stroke-width="2" stroke-linecap="round"/>',
        'candle': '<rect x="98" y="45" width="24" height="50" rx="2" stroke="C" stroke-width="2" fill="none"/><path d="M110 45 Q105 30 110 18 Q115 30 110 45Z" stroke="C" stroke-width="1.5" fill="none"/><circle cx="110" cy="18" r="4" stroke="C" stroke-width="1" fill="none" opacity="0.5"/>',
        'bird': '<path d="M60 50 Q80 30 110 35 Q130 38 140 50" stroke="C" stroke-width="2" fill="none"/><path d="M140 50 L160 40" stroke="C" stroke-width="1.8" stroke-linecap="round"/><circle cx="125" cy="38" r="2.5" fill="C"/><path d="M60 50 Q50 65 65 70" stroke="C" stroke-width="1.5" fill="none"/>',
        'fire': '<path d="M110 90 Q85 65 95 40 Q105 55 110 30 Q115 55 125 40 Q135 65 110 90Z" stroke="C" stroke-width="2" fill="none"/><path d="M110 90 Q100 75 105 60 Q110 70 115 60 Q120 75 110 90Z" stroke="C" stroke-width="1.5" fill="none" opacity="0.5"/>',
        'road': '<path d="M80 100 L100 15" stroke="C" stroke-width="2" fill="none"/><path d="M140 100 L120 15" stroke="C" stroke-width="2" fill="none"/><path d="M110 95 L110 85 M110 75 L110 65 M110 55 L110 45 M110 35 L110 25" stroke="C" stroke-width="1.5" stroke-dasharray="8 8" opacity="0.4"/>',
        'bridge': '<path d="M20 55 Q60 25 110 25 Q160 25 200 55" stroke="C" stroke-width="2.2" fill="none"/><line x1="50" y1="42" x2="50" y2="80" stroke="C" stroke-width="1.5"/><line x1="110" y1="25" x2="110" y2="80" stroke="C" stroke-width="1.5"/><line x1="170" y1="42" x2="170" y2="80" stroke="C" stroke-width="1.5"/><line x1="20" y1="80" x2="200" y2="80" stroke="C" stroke-width="1.5"/>',
        'empty': '<circle cx="110" cy="55" r="40" stroke="C" stroke-width="1.5" fill="none" stroke-dasharray="6 4" opacity="0.4"/><text x="95" y="60" font-family="serif" font-size="14" fill="C" opacity="0.3">&#8709;</text>',
        'temple': '<path d="M50 40 L110 15 L170 40" stroke="C" stroke-width="2" fill="none"/><line x1="65" y1="40" x2="65" y2="85" stroke="C" stroke-width="2"/><line x1="95" y1="40" x2="95" y2="85" stroke="C" stroke-width="2"/><line x1="125" y1="40" x2="125" y2="85" stroke="C" stroke-width="2"/><line x1="155" y1="40" x2="155" y2="85" stroke="C" stroke-width="2"/><line x1="50" y1="85" x2="170" y2="85" stroke="C" stroke-width="2"/>'
      };
      // 한국어 키워드 → 영어 매핑
      var skMap = {
        '고독':'moon','도전':'mountain','인내':'fire','승리':'star','존엄':'bridge',
        '바다':'sea','강':'river','산':'mountain','꽃':'flower','별':'star',
        '달':'moon','사람':'person','사랑':'heart','눈물':'tear','눈':'eye',
        '손':'hand','책':'book','집':'house','열쇠':'key','시간':'clock',
        '거울':'mirror','초':'candle','새':'bird','불':'fire','길':'road',
        '다리':'bridge','절':'temple','비어있음':'empty','나무':'tree',
        '성장':'tree','모험':'mountain','우정':'heart','가족':'house',
        '죽음':'candle','자유':'bird','전쟁':'fire','평화':'flower',
        '정의':'temple','희망':'star','슬픔':'tear','분노':'fire',
        '공포':'eye','용기':'mountain','지혜':'book','꿈':'moon',
        '여행':'road','이별':'tear','만남':'bridge','변화':'river',
        '운명':'clock','진실':'mirror','거짓':'mirror','선':'star','악':'fire',
        '권력':'key','자연':'tree','도시':'house','바닷가':'sea'
      };
      var mappedSk = skMap[ch.sk] || ch.sk;
      // 같은 키워드라도 챕터마다 다른 그림 보이게 회전
      var skKeys = Object.keys(skLib);
      var baseIdx = skKeys.indexOf(mappedSk);
      if (baseIdx === -1) baseIdx = 0;
      var rotatedIdx = (baseIdx + chIdx) % skKeys.length;
      var selectedKey = skKeys[rotatedIdx];
      var svg = skLib[selectedKey].replace(/C/g, c);
      var label = (ch.s || '').length > 10 ? (ch.s || '').slice(0,10) + '…' : (ch.s || '');
      return '<div class="sayu-sketch"><svg width="220" height="115" viewBox="0 0 220 115" fill="none">' + w + '<g filter="url(#wob)">' + svg + '<text x="30" y="108" font-family="serif" font-size="8" fill="' + c + '" opacity="0.5">' + label + '</text></g></svg></div>';
    }
  }

  var defaultPatterns = [
    '<svg width="220" height="110" viewBox="0 0 220 110" fill="none">' + w + '<g filter="url(#wob)"><circle cx="110" cy="50" r="35" stroke="#2A0510" stroke-width="1.8" fill="none" opacity="0.4"/><path d="M80 50 L95 35 L110 50 L125 35 L140 50" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.5"/><circle cx="110" cy="50" r="8" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M120 42 L140 30" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="140,30 134,28 135,34" fill="#2A0510"/><text x="142" y="29" font-family="serif" font-size="8" fill="#2A0510">핵심</text><text x="65" y="95" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">읽고 생각하고 느껴요</text></g></svg>',
    '<svg width="220" height="110" viewBox="0 0 220 110" fill="none">' + w + '<g filter="url(#wob)"><rect x="30" y="20" width="60" height="75" rx="4" stroke="#2A0510" stroke-width="2" fill="none"/><path d="M38 38 L82 38 M38 50 L82 50 M38 62 L70 62 M38 74 L82 74" stroke="#2A0510" stroke-width="1" opacity="0.5"/><circle cx="160" cy="55" r="28" stroke="#2A0510" stroke-width="1.5" fill="none" opacity="0.3" stroke-dasharray="5 3"/><path d="M100 45 L128 48" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="128,48 122,45 122,51" fill="#2A0510"/><text x="135" y="35" font-family="serif" font-size="8" fill="#2A0510" opacity="0.6">사유의 공간</text><text x="45" y="105" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">초록독서 · 밑줄독서</text></g></svg>',
    '<svg width="220" height="110" viewBox="0 0 220 110" fill="none">' + w + '<g filter="url(#wob)"><path d="M40 85 Q70 20 110 15 Q150 20 180 85" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.4"/><path d="M40 85 L180 85" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/><circle cx="110" cy="15" r="6" stroke="#2A0510" stroke-width="1.8" fill="none"/><path d="M155 40 L172 30" stroke="#2A0510" stroke-width="1.3" stroke-linecap="round"/><polygon points="172,30 166,28 167,34" fill="#2A0510"/><text x="174" y="29" font-family="serif" font-size="8" fill="#2A0510">질문</text><text x="55" y="100" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">생각이 자라는 책</text></g></svg>',
    '<svg width="220" height="110" viewBox="0 0 220 110" fill="none">' + w + '<g filter="url(#wob)"><circle cx="60" cy="55" r="25" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.5"/><circle cx="160" cy="55" r="25" stroke="#2A0510" stroke-width="2" fill="none" opacity="0.5"/><path d="M85 55 L135 55" stroke="#2A0510" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"/><text x="50" y="59" font-family="serif" font-size="10" fill="#2A0510" opacity="0.7">이전</text><text x="148" y="59" font-family="serif" font-size="10" fill="#2A0510" opacity="0.7">이후</text><text x="55" y="95" font-family="serif" font-size="8" fill="#2A0510" opacity="0.5">책이 나를 바꾼다</text></g></svg>',
  ];
  var idx = (bookIdx * 7 + chIdx) % defaultPatterns.length;
  return '<div class="sayu-sketch">' + defaultPatterns[idx] + '</div>';
}
function saveSayuMemo(idx, key) {
  var el = document.getElementById('sayu_inp_' + idx);
  if (!el) return;
  var v = el.value.trim();
  if (!v) { showToast('내용을 입력해주세요'); return; }
  answers[key] = v;
  try { _set('bh5_ans', answers); } catch(e) {}
  var area = document.getElementById('sayu_qa_' + idx);
  if (area) {
    area.innerHTML = '<div class="q-done-box"><div class="q-done-lbl">// MY NOTE</div>'
      + '<div class="q-done-txt">' + v + '</div></div>'
      + '<button class="q-re" onclick="editSayuMemo(' + idx + ',\'' + key + '\')">[ 다시 쓰기 ]</button>';
  }
  showToast('저장됐어요!');
}

function editSayuMemo(idx, key) {
  var prev = answers[key] || '';
  var area = document.getElementById('sayu_qa_' + idx);
  if (!area) return;
  area.innerHTML = '<textarea class="q-inp" id="sayu_inp_' + idx + '" rows="5">' + prev + '</textarea>'
    + '<br><button class="q-save" onclick="saveSayuMemo(' + idx + ',\'' + key + '\')">[ SAVE ]</button>';
  var inp = document.getElementById('sayu_inp_' + idx);
  if (inp) inp.focus();
}

function buildCoreHTML() {
  var book = BOOKS[curBookIdx];
  var lines = book.coreLines || [];
  if (!lines.length) return '';
  var rows = lines.map(function(l) {
    return '<div class="core-line">' + l + '</div>';
  }).join('');
  return '<div class="core-card fu4">'
    + '<div class="core-label">★ 이 책의 핵심 문장</div>'
    + rows
    + '</div>';
}

function buildEmotionHTML() {
  var book = BOOKS[curBookIdx];
  var emos = book.emotions || [];
  if (!emos.length) return '';
  var bars = emos.map(function(e) {
    var h = e.h || 40;
    var chLabel = e.ch.replace('CH.','').replace('PART.','P');
    return '<div class="emotion-bar-wrap">'
      + '<div class="emotion-bar" style="height:' + h + 'px;background:' + e.color + ';opacity:0.85"></div>'
      + '<div class="emotion-lbl">' + e.label + '</div>'
      + '<div class="emotion-ch">' + chLabel + '</div>'
      + '</div>';
  }).join('');
  return '<div class="emotion-card fu4">'
    + '<div class="emotion-label">// 챕터별 감정 흐름</div>'
    + '<div class="emotion-flow" style="align-items:flex-end">' + bars + '</div>'
    + '</div>';
}

/* ★ FIX 2: buildBeforeAfterHTML 함수는 유지하되 loadCh에서 호출하지 않음 */
function buildBeforeAfterHTML(idx) { return ''; }

function saveBA(key, inpId) {
  var el = document.getElementById(inpId);
  if (!el) return;
  var v = el.value.trim();
  if (!v) { showToast('내용을 입력해주세요'); return; }
  answers[key] = v;
  try { _set('bh5_ans', answers); } catch(e) {}
  var wrap = el.closest ? el.closest('.ba-before, .ba-after') : el.parentElement;
  if (wrap) {
    var tag = wrap.querySelector('.ba-tag');
    var tagText = tag ? tag.innerHTML : '';
    wrap.innerHTML = '<div class="ba-tag">' + tagText + '</div>'
      + '<div class="ba-txt">' + v + '</div>'
      + '<button class="ba-re" onclick="editBA(\'' + key + '\',\'' + inpId + '\')">[ 수정 ]</button>';
  }
  showToast('저장됐어요!');
}

function editBA(key, inpId) {
  var prev = answers[key] || '';
  var els = document.querySelectorAll('.ba-re');
  var wrap = null;
  for (var i = 0; i < els.length; i++) {
    var oc = els[i].getAttribute('onclick') || '';
    if (oc.indexOf(key) !== -1) { wrap = els[i].parentElement; break; }
  }
  if (!wrap) return;
  var tag = wrap.querySelector('.ba-tag');
  var tagText = tag ? tag.innerHTML : '';
  wrap.innerHTML = '<div class="ba-tag">' + tagText + '</div>'
    + '<textarea class="ba-inp" id="' + inpId + '" rows="2">' + prev + '</textarea>'
    + '<button class="ba-save" onclick="saveBA(\'' + key + '\',\'' + inpId + '\')">[ SAVE ]</button>';
  var inp = document.getElementById(inpId);
  if (inp) inp.focus();
}

function buildBigQHTML(idx) {
  var book = BOOKS[curBookIdx];
  if (!book.bigQ) return '';
  var key = 'bigq_b' + curBookIdx;
  var saved = answers[key];
  var qBlock = saved
    ? '<div class="ending-qa-wrap"><div class="ending-done-lbl">// MY NOTE</div><div class="ending-done">' + saved + '</div><button class="ending-re" onclick="editEndingAns(\'' + key + '\',\'bigq_inp_' + curBookIdx + '\')">[ 다시 쓰기 ]</button></div>'
    : '<div class="ending-qa-wrap"><textarea class="ending-inp" id="bigq_inp_' + curBookIdx + '" rows="3" placeholder="솔직하게 써봐요"></textarea><button class="ending-save" onclick="saveEndingAns(\'' + key + '\',\'bigq_inp_' + curBookIdx + '\')">[ SAVE ]</button></div>';
  return '<div class="bigq-card fu4">'
    + '<div class="bigq-label">★ 이 책이 내 삶에 묻는 질문</div>'
    + '<div class="bigq-text">' + book.bigQ + '</div>'
    + '<div class="bigq-sub">// 이 질문에 지금 솔직하게 답해봐요</div>'
    + qBlock
    + '</div>';
}

function buildEndingKey(q, idx) { return 'end_b' + curBookIdx + '*' + idx + '*' + q; }

function buildEndingQBlock(qText, qNum, idx) {
  var key = buildEndingKey(qNum, idx);
  var saved = answers[key];
  var uid = 'eq_' + curBookIdx + '*' + idx + '*' + qNum;
  if (saved) {
    return '<div class="ending-qa-wrap">'
      + '<div class="ending-done-lbl">// MY NOTE</div>'
      + '<div class="ending-done">' + saved + '</div>'
      + '<button class="ending-re" onclick="editEndingAns(\'' + key + '\',\'' + uid + '\')">[다시 쓰기]</button>'
      + '</div>';
  }
  return '<div class="ending-qa-wrap">'
    + '<textarea class="ending-inp" id="' + uid + '" rows="3" placeholder="내 생각을 써봐요"></textarea>'
    + '<button class="ending-save" onclick="saveEndingAns(\'' + key + '\',\'' + uid + '\')">[ SAVE ]</button>'
    + '</div>';
}

function buildEndingHTML(idx) {
  var ch = CHS[idx];
  if (!ch || !ch.isLast) return '';
  return '<div class="ending-card fu4">'
    + '<div class="ending-badge">★ FINAL CHAPTER — 작가의 의도 &amp; 결말</div>'
    + '<div class="ending-divider"></div>'
    + '<div class="ending-section-title">// 작가의 의도</div>'
    + '<div class="ending-text">' + ch.authorIntent + '</div>'
    + '<div class="ending-divider"></div>'
    + '<div class="ending-section-title">// 결말 요약</div>'
    + '<div class="ending-text">' + ch.ending + '</div>'
    + '<div class="ending-divider"></div>'
    + '<div class="ending-q">' + ch.endingQ1 + '</div>'
    + buildEndingQBlock(ch.endingQ1, 'q1', idx)
    + '</div>';
}

function saveEndingAns(key, uid) {
  var el = document.getElementById(uid);
  if (!el) return;
  var v = el.value.trim();
  if (!v) { showToast('내용을 입력해주세요'); return; }
  answers[key] = v;
  try { _set('bh5_ans', answers); } catch(e) {}
  var wrap = el.closest('.ending-qa-wrap') || el.parentElement;
  if (wrap) {
    wrap.innerHTML = '<div class="ending-done-lbl">// MY NOTE</div>'
      + '<div class="ending-done">' + v + '</div>'
      + '<button class="ending-re" onclick="editEndingAns(\'' + key + '\',\'' + uid + '\')">[다시 쓰기]</button>';
  }
  showToast('저장됐어요!');
}

function editEndingAns(key, uid) {
  var prev = answers[key] || '';
  var btns = document.querySelectorAll('.ending-re');
  var wrap = null;
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].getAttribute('onclick') && btns[i].getAttribute('onclick').includes(key)) {
      wrap = btns[i].parentElement; break;
    }
  }
  if (!wrap) return;
  wrap.innerHTML = '<textarea class="ending-inp" id="' + uid + '" rows="3">' + prev + '</textarea>'
    + '<button class="ending-save" onclick="saveEndingAns(\'' + key + '\',\'' + uid + '\')">[ SAVE ]</button>';
  var inp = document.getElementById(uid);
  if (inp) inp.focus();
}

function buildCastHTML() {
  var book = BOOKS[curBookIdx];
  var cast = book.cast || [];
  if (!cast.length) return '';
  var rows = cast.map(function(c) {
    return '<div class="cast-row">'
      + '<div class="cast-row-emo">' + c.emo + '</div>'
      + '<div>'
      + '<div class="cast-row-name">' + c.name + '</div>'
      + '<div class="cast-row-role">' + c.role + '</div>'
      + '<div class="cast-row-desc">' + c.desc + '</div>'
      + '</div></div>';
  }).join('');
  var uid = 'cast_' + curBookIdx;
  return '<div class="cast-inline fu2">'
    + '<button class="cast-inline-toggle" id="' + uid + '_btn" onclick="toggleCastInline(\'' + uid + '\')">'
    + 'CAST   <span style="font-size:12px">▼</span>'
    + '</button>'
    + '<div class="cast-inline-body" id="' + uid + '_body">' + rows + '</div>'
    + '</div>';
}

function toggleCastInline(uid) {
  var btn  = document.getElementById(uid + '_btn');
  var body = document.getElementById(uid + '_body');
  if (!btn || !body) return;
  var open = body.classList.contains('open');
  if (open) {
    body.classList.remove('open');
    btn.classList.remove('open');
  } else {
    body.classList.add('open');
    btn.classList.add('open');
  }
}

function getKey(idx) { return 'b' + curBookIdx + '*' + idx; }

function buildQArea(idx) {
  const s = answers[getKey(idx)];
  if (s) {
    return '<div class="q-done-box">'
      + '<div class="q-done-lbl">// MY NOTE</div>'
      + '<div class="q-done-txt">' + s + '</div>'
      + '</div>'
      + '<br><button class="q-re" onclick="editAns(' + idx + ')">[ 다시 쓰기 ]</button>';
  }
  return '<textarea class="q-inp" placeholder="내 생각을 써봐요 (10글자 이상)" '
    + 'id="qi' + idx + '" rows="4"></textarea>'
    + '<br>'
    + '<button class="q-save" onclick="saveAns(' + idx + ')">[ SAVE ]</button>';
}

function saveAns(idx) {
  var el = document.getElementById('qi' + idx);
  if (!el) { showToast('ERROR'); return; }
  var v = el.value.trim();
  if (v.length < 1) { showToast('내용을 입력해주세요'); return; }
  answers[getKey(idx)] = v;
  try { _set('bh5_ans', answers); } catch(e) {}
  var area = document.getElementById('qa' + idx);
  if (area) {
    area.innerHTML = '<div class="q-done-box">'
      + '<div class="q-done-lbl">// MY NOTE</div>'
      + '<div class="q-done-txt">' + v + '</div>'
      + '</div>'
      + '<br><button class="q-re" onclick="editAns(' + idx + ')">[ 다시 쓰기 ]</button>';
  }
  showToast('저장됐어요!');
}

function editAns(idx) {
  var area = document.getElementById('qa' + idx);
  if (!area) return;
  var prev = answers[getKey(idx)] || '';
  area.innerHTML = '<textarea class="q-inp" id="qi' + idx + '" rows="4">' + prev + '</textarea>'
    + '<br>'
    + '<button class="q-save" onclick="saveAns(' + idx + ')">[ SAVE ]</button>';
  var inp = document.getElementById('qi' + idx);
  if (inp) inp.focus();
}
