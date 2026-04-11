// BookHitch - Music & Audio Module

// 오디오 전역 상태
var audioCtx = null;
var musicNodes = [];
var musicOn = false;
var musicScheduler = null;

function n(note) {
  var notes = {
    C2:65.4,D2:73.4,E2:82.4,F2:87.3,G2:98,A2:110,B2:123.5,
    C3:130.8,D3:146.8,E3:164.8,F3:174.6,G3:196,A3:220,B3:246.9,
    C4:261.6,D4:293.7,E4:329.6,F4:349.2,G4:392,A4:440,B4:493.9,
    C5:523.3,D5:587.3,E5:659.3,F5:698.5,G5:784,A5:880,
    Db4:277.2,Eb4:311.1,Gb4:370,Ab4:415.3,Bb4:466.2,
    Db3:138.6,Eb3:155.6,Gb3:185,Ab3:207.7,Bb3:233.1,
    Db5:554.4,Eb5:622.3,Gb5:740,Ab5:830.6,Bb5:932.3,
    REST:0
  };
  return notes[note] || 0;
}

// 음표 재생 (부드러운 envelope)
function playNote(ctx, mg, freq, startTime, duration, type, vol) {
  if (!freq) return;
  var osc = ctx.createOscillator();
  var g = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  var att = Math.min(0.08, duration * 0.2);
  var rel = Math.min(duration * 0.45, 0.6);
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(vol || 0.15, startTime + att);
  g.gain.setValueAtTime(vol || 0.15, startTime + duration - rel);
  g.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.connect(g); g.connect(mg);
  osc.start(startTime); osc.stop(startTime + duration + 0.1);
}

// 바이노럴 비트 생성 (헤드폰 권장, 아니어도 저주파 동조 효과)
// 왼쪽 귀: base Hz, 오른쪽 귀: base + beat Hz → 뇌가 차이값을 인식
function createBinaural(ctx, baseFreq, beatFreq, vol) {
  var merger = ctx.createChannelMerger(2);
  var splitter = ctx.createChannelSplitter(2);

  var oscL = ctx.createOscillator();
  var oscR = ctx.createOscillator();
  var gL = ctx.createGain();
  var gR = ctx.createGain();

  oscL.type = 'sine'; oscL.frequency.value = baseFreq;
  oscR.type = 'sine'; oscR.frequency.value = baseFreq + beatFreq;
  gL.gain.value = vol; gR.gain.value = vol;

  oscL.connect(gL); oscR.connect(gR);
  gL.connect(merger, 0, 0);
  gR.connect(merger, 0, 1);
  merger.connect(ctx.destination);

  oscL.start(); oscR.start();
  return [oscL, oscR, gL, gR, merger];
}

// 리버브
function makeReverb(ctx, secs) {
  var conv = ctx.createConvolver();
  var len = ctx.sampleRate * (secs || 2.5);
  var buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (var c = 0; c < 2; c++) {
    var d = buf.getChannelData(c);
    for (var i = 0; i < len; i++)
      d[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2.2);
  }
  conv.buffer = buf;
  return conv;
}

// ══ 책별 음악 정의 ══
// 구조: { bpm, binaural:{base,beat,vol}, mel, bass, melVol, bassVol, melType }
// binaural.beat = 뇌파 동조 주파수
//   세타(6Hz): 창의적 사유, 명상적 독서
//   알파(10Hz): 집중 + 이완, 학습 최적
//   저알파(8Hz): 깊은 이완 + 집중

var BOOK_SOUNDS = {

  // 🚀 히치하이커 — 알파10Hz + 재즈 우주풍 (C Mixolydian)
  // 알파파: 가볍고 즐거운 집중 상태 → 유머 소설에 최적
  0: {
    bpm: 82, binaural: { base: 200, beat: 10, vol: 0.04 },
    mel: [
      ['G4',1],['E4',1],['C4',1],['D4',1],
      ['F4',1],['E4',0.5],['D4',0.5],['C4',2],
      ['A4',1],['G4',1],['F4',1],['E4',1],
      ['D4',1.5],['C4',0.5],['G3',1],['REST',1],
      ['E4',1],['G4',1],['A4',1],['G4',1],
      ['F4',0.5],['G4',0.5],['E4',2],['REST',2],
    ],
    bass: [
      ['C3',2],['G3',2],['F3',2],['G3',2],
      ['C3',2],['F3',2],['C3',2],['G3',2],
      ['F3',2],['G3',2],['C3',4],
    ],
    melType: 'triangle', melVol: 0.13, bassVol: 0.09
  },

  // 🪲 변신 — 세타6Hz + 쇼팽풍 A minor
  // 세타파: 내면 탐구, 무의식 접근 → 실존 소설에 최적
  1: {
    bpm: 66, binaural: { base: 180, beat: 6, vol: 0.035 },
    mel: [
      ['E4',2],['A4',1.5],['G4',0.5],
      ['F4',2],['E4',2],
      ['D4',1.5],['C4',0.5],['B3',2],
      ['A3',3],['REST',1],
      ['C4',1],['E4',1],['F4',1],['G4',1],
      ['A4',2],['G4',1],['F4',1],
      ['E4',1.5],['D4',0.5],['E4',1],['C4',1],
      ['A3',4],['REST',2],
    ],
    bass: [
      ['A2',4],['F2',4],['C3',4],['A2',4],
      ['F2',4],['E2',4],['A2',4],['A2',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.14, bassVol: 0.09
  },

  // 🎨 내 이름은 빨강 — 세타7Hz + 중동풍 D Phrygian
  // 세타파: 예술적 몰입, 감각적 상상력 자극
  2: {
    bpm: 68, binaural: { base: 210, beat: 7, vol: 0.038 },
    mel: [
      ['D4',1],['Eb4',1],['F4',1],['G4',1],
      ['F4',1.5],['Eb4',0.5],['D4',2],
      ['C4',1],['D4',1],['Eb4',1],['C4',1],
      ['D4',4],
      ['G4',1],['F4',1],['Eb4',1],['D4',1],
      ['C4',1],['Bb3',1],['A3',2],
      ['Bb3',1],['C4',1],['D4',2],
      ['D4',4],['REST',2],
    ],
    bass: [
      ['D3',4],['C3',4],['Bb2',4],['A2',4],
      ['D3',4],['C3',4],['Bb2',4],['D3',4],['REST',2],
    ],
    melType: 'triangle', melVol: 0.12, bassVol: 0.08
  },

  // 🌹 어린 왕자 — 알파10Hz + G장조 왈츠
  // 알파파: 순수한 집중, 동심 → 동화 소설에 최적
  3: {
    bpm: 96, binaural: { base: 220, beat: 10, vol: 0.04 },
    mel: [
      ['G4',1],['A4',1],['B4',1],
      ['C5',2],['B4',1],
      ['A4',1],['G4',1],['A4',1],
      ['G4',3],
      ['D5',1],['C5',1],['B4',1],
      ['A4',2],['G4',1],
      ['F4',1],['G4',1],['A4',1],
      ['G4',3],
      ['E5',1],['D5',1],['C5',1],
      ['B4',2],['A4',1],
      ['G4',1],['A4',1],['B4',1],
      ['G4',3],['REST',3],
    ],
    bass: [
      ['G3',1],['D4',1],['D4',1],
      ['C3',1],['G3',1],['G3',1],
      ['D3',1],['A3',1],['A3',1],
      ['G3',1],['D4',1],['D4',1],
      ['G3',1],['D4',1],['D4',1],
      ['C3',1],['G3',1],['G3',1],
      ['D3',1],['A3',1],['A3',1],
      ['G3',1],['D3',1],['D3',1],
      ['G3',1],['D4',1],['D4',1],
      ['C3',1],['G3',1],['G3',1],
      ['REST',3],
    ],
    melType: 'sine', melVol: 0.14, bassVol: 0.07
  },

  // 🏔️ 킬리만자로 — 알파8Hz + E minor pentatonic
  // 저알파파: 깊은 이완 + 집중 → 헤밍웨이 간결함에 최적
  4: {
    bpm: 72, binaural: { base: 196, beat: 8, vol: 0.038 },
    mel: [
      ['E4',1.5],['G4',0.5],['A4',1],['G4',1],
      ['E4',2],['D4',2],
      ['B3',1.5],['D4',0.5],['E4',1],['G4',1],
      ['A4',2],['E4',2],
      ['G4',1.5],['A4',0.5],['B4',1],['A4',1],
      ['G4',2],['E4',2],
      ['D4',1],['E4',1],['G4',2],
      ['E4',4],['REST',2],
    ],
    bass: [
      ['E3',4],['A3',4],['B3',4],['E3',4],
      ['A3',4],['E3',4],['B2',4],['E3',4],['REST',2],
    ],
    melType: 'triangle', melVol: 0.13, bassVol: 0.09
  },

  // 🌊 율리시스 — 세타6Hz + D Dorian 켈틱
  // 세타파: 의식의 흐름 → 조이스 문체 체험에 최적
  5: {
    bpm: 88, binaural: { base: 174, beat: 6, vol: 0.035 },
    mel: [
      ['D4',1],['F4',1],['G4',1],['A4',1],
      ['G4',2],['F4',1],['E4',1],
      ['D4',1],['E4',1],['F4',1],['D4',1],
      ['E4',2],['D4',2],
      ['A4',1],['G4',1],['F4',1],['E4',1],
      ['D4',1.5],['F4',0.5],['G4',2],
      ['A4',1],['G4',1],['F4',1],['E4',1],
      ['D4',4],['REST',2],
    ],
    bass: [
      ['D3',4],['C3',4],['G3',4],['D3',4],
      ['C3',4],['G3',4],['A3',4],['D3',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.13, bassVol: 0.08
  },

  // 🐳 모비딕 — 세타5Hz + A minor 웅장
  // 저세타파: 깊은 무의식 탐구 → 집착과 운명에 최적
  6: {
    bpm: 54, binaural: { base: 160, beat: 5, vol: 0.04 },
    mel: [
      ['A3',2],['C4',1],['E4',1],
      ['F4',2],['E4',1],['D4',1],
      ['C4',2],['E4',1],['A4',1],
      ['G4',3],['REST',1],
      ['A4',1],['G4',1],['F4',1],['E4',1],
      ['D4',2],['C4',2],
      ['E4',2],['C4',1],['A3',1],
      ['A3',4],['REST',2],
    ],
    bass: [
      ['A2',4],['F2',4],['C3',4],['G2',4],
      ['A2',4],['F2',4],['E2',4],['A2',4],['REST',2],
    ],
    melType: 'triangle', melVol: 0.13, bassVol: 0.1
  },

  // 👁️ 1984 — 알파8Hz + C minor (냉혹하지만 집중)
  // 저알파파: 비판적 사고 자극 → 디스토피아 분석에 최적
  7: {
    bpm: 60, binaural: { base: 160, beat: 8, vol: 0.035 },
    mel: [
      ['C4',2],['Eb4',1],['D4',1],
      ['C4',2],['Bb3',2],
      ['Ab3',2],['G3',1],['Ab3',1],
      ['G3',4],
      ['Eb4',2],['D4',1],['C4',1],
      ['Bb3',2],['C4',1],['D4',1],
      ['Eb4',2],['G4',1],['F4',1],
      ['Eb4',4],['REST',2],
    ],
    bass: [
      ['C3',4],['Ab2',4],['Eb3',4],['G2',4],
      ['C3',4],['Ab2',4],['Eb3',4],['C3',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.11, bassVol: 0.09
  },

  // 📜 논어 — 알파10Hz + C Pentatonic (동양 고요)
  // 알파파: 성찰과 집중의 균형 → 철학 사유에 최적
  8: {
    bpm: 63, binaural: { base: 220, beat: 10, vol: 0.04 },
    mel: [
      ['E4',2],['G4',1],['A4',1],
      ['G4',2],['E4',2],
      ['C4',2],['D4',1],['E4',1],
      ['D4',3],['REST',1],
      ['A4',2],['G4',1],['E4',1],
      ['G4',2],['C4',2],
      ['D4',1.5],['E4',0.5],['G4',1],['E4',1],
      ['C4',4],['REST',2],
    ],
    bass: [
      ['C3',4],['G3',4],['C3',4],['G3',4],
      ['A3',4],['C3',4],['G3',4],['C3',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.12, bassVol: 0.07
  },

  // 🥚 데미안 — 세타7Hz + E 장단조 몽환
  // 세타파: 내면 각성, 자아 탐구 → 성장 소설에 최적
  9: {
    bpm: 70, binaural: { base: 200, beat: 7, vol: 0.038 },
    mel: [
      ['E4',2],['Gb4',1],['Ab4',1],
      ['B4',2],['Ab4',1],['Gb4',1],
      ['E4',2],['Db4',1],['E4',1],
      ['Gb4',3],['REST',1],
      ['Ab4',2],['B4',1],['Db5',1],
      ['B4',2],['Ab4',2],
      ['Gb4',1.5],['E4',0.5],['Db4',1],['E4',1],
      ['E4',4],['REST',2],
    ],
    bass: [
      ['E3',4],['A3',4],['Db3',4],['Gb3',4],
      ['A3',4],['E3',4],['B2',4],['E3',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.13, bassVol: 0.08
  },

  // 🌌 코스모스 — 세타6Hz + F Lydian 광활
  // 세타파: 우주적 상상력, 경이감 자극 → 과학+철학에 최적
  10: {
    bpm: 56, binaural: { base: 174, beat: 6, vol: 0.04 },
    mel: [
      ['F4',2],['G4',1],['A4',1],
      ['C5',2],['A4',1],['G4',1],
      ['A4',2],['C5',1],['D5',1],
      ['C5',4],
      ['D5',2],['C5',1],['A4',1],
      ['G4',2],['F4',2],
      ['G4',2],['A4',1],['C5',1],
      ['F4',4],['REST',2],
    ],
    bass: [
      ['F2',4],['C3',4],['Bb2',4],['F2',4],
      ['F2',4],['C3',4],['Bb2',4],['F2',4],['REST',2],
    ],
    melType: 'sine', melVol: 0.14, bassVol: 0.09
  }
};

function startMusicLoop(bookId) {
  if (!audioCtx) return;
  var sound = BOOK_SOUNDS[bookId] || BOOK_SOUNDS[0];
  var beat = 60 / (sound.bpm || 72);

  // 마스터 게인
  var masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.75;

  // 리버브 (홀 느낌)
  var reverb = makeReverb(audioCtx, 3);
  var dryGain = audioCtx.createGain(); dryGain.gain.value = 0.55;
  var wetGain = audioCtx.createGain(); wetGain.gain.value = 0.45;
  masterGain.connect(dryGain); dryGain.connect(audioCtx.destination);
  masterGain.connect(reverb); reverb.connect(wetGain); wetGain.connect(audioCtx.destination);
  musicNodes.push(masterGain, reverb, dryGain, wetGain);

  // 바이노럴 비트 (뇌파 동조)
  if (sound.binaural) {
    var bn = createBinaural(
      audioCtx,
      sound.binaural.base,
      sound.binaural.beat,
      sound.binaural.vol
    );
    musicNodes = musicNodes.concat(bn);
  }

  // 멜로디 루프 스케줄러
  var nextLoopTime = audioCtx.currentTime + 0.15;

  function schedule() {
    if (!musicOn) return;
    if (nextLoopTime < audioCtx.currentTime + 0.4) {
      var t = nextLoopTime;
      var loopDur = 0;

      // 멜로디
      sound.mel.forEach(function(m) {
        playNote(audioCtx, masterGain, n(m[0]), t, m[1]*beat*0.82, sound.melType||'sine', sound.melVol||0.13);
        t += m[1] * beat;
      });
      loopDur = t - nextLoopTime;

      // 베이스
      t = nextLoopTime;
      sound.bass.forEach(function(b) {
        playNote(audioCtx, masterGain, n(b[0]), t, b[1]*beat*0.75, 'sine', sound.bassVol||0.09);
        t += b[1] * beat;
      });

      nextLoopTime += loopDur;
    }
    musicScheduler = setTimeout(schedule, 120);
  }
  schedule();
}

function stopMusic() {
  if (musicScheduler) { clearTimeout(musicScheduler); musicScheduler = null; }
  musicNodes.forEach(function(node) {
    try { if (node.stop) node.stop(); node.disconnect(); } catch(e) {}
  });
  musicNodes = [];
}

function toggleMusic() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (musicOn) {
    stopMusic();
    musicOn = false;
    document.getElementById('music-ico').textContent = '♪';
    document.getElementById('music-lbl').textContent = 'BGM';
    document.getElementById('nav-music').classList.remove('active');
    showToast('음악 꺼짐');
  } else {
    var bookId = typeof curBookIdx !== 'undefined' ? curBookIdx : 0;
    musicOn = true;
    startMusicLoop(bookId);
    document.getElementById('music-ico').textContent = '♫';
    document.getElementById('music-lbl').textContent = 'BGM ON';
    document.getElementById('nav-music').classList.add('active');
    var bv = BOOK_SOUNDS[bookId] ? BOOK_SOUNDS[bookId].binaural : null;
    var hz = bv ? ' · α' + bv.beat + 'Hz' : '';
    showToast('♫ ' + (BOOKS[bookId] ? BOOKS[bookId].title : '') + hz);
  }
}

function switchMusicForBook(bookId) {
  if (!musicOn) return;
  stopMusic();
  startMusicLoop(bookId);
}

function showToast(m) {
  const t = document.getElementById('toast');
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ══ 장르별 자동 음악 생성 ══
function generateBookMusic(bookId, genre) {
  var presets = {
    // 세타파(5-7Hz): 깊은 사유, 무의식 → 철학/문학/심리
    'deep': { bpm:60, binaural:{base:180,beat:6,vol:0.035},
      mel:[['E4',2],['A4',1.5],['G4',0.5],['F4',2],['E4',2],['D4',1.5],['C4',0.5],['B3',2],['A3',3],['REST',1],['C4',1],['E4',1],['A4',2],['G4',1],['E4',1],['D4',2],['REST',2]],
      bass:[['A2',2],['E3',2],['F3',2],['E3',2],['A2',2],['D3',2],['E3',2],['A2',2]],
      melType:'sine',melVol:0.11,bassVol:0.08 },
    // 알파파(8-10Hz): 가벼운 집중 → 모험/SF/판타지
    'adventure': { bpm:84, binaural:{base:200,beat:10,vol:0.04},
      mel:[['G4',1],['E4',1],['C4',1],['D4',1],['F4',1],['E4',0.5],['D4',0.5],['C4',2],['A4',1],['G4',1],['E4',1.5],['D4',0.5],['C4',2],['REST',2]],
      bass:[['C3',2],['G3',2],['F3',2],['G3',2],['C3',2],['F3',2],['C3',4]],
      melType:'triangle',melVol:0.13,bassVol:0.09 },
    // 알파파(8Hz): 편안한 집중 → 에세이/수필/자기계발
    'calm': { bpm:72, binaural:{base:196,beat:8,vol:0.038},
      mel:[['C4',2],['E4',1],['G4',1],['A4',2],['G4',2],['F4',1],['E4',1],['D4',2],['C4',2],['REST',2],['E4',1],['G4',1],['C5',2],['A4',1],['G4',1],['E4',2],['REST',2]],
      bass:[['C3',4],['F3',4],['G3',4],['C3',4]],
      melType:'sine',melVol:0.10,bassVol:0.07 },
    // 세타파(5Hz): 명상적 → 시/동양철학
    'meditative': { bpm:54, binaural:{base:160,beat:5,vol:0.04},
      mel:[['D4',3],['F4',1],['A4',2],['G4',2],['F4',2],['D4',2],['REST',2],['A3',2],['D4',2],['F4',2],['E4',3],['D4',1],['REST',4]],
      bass:[['D3',4],['A2',4],['F3',4],['D3',4]],
      melType:'sine',melVol:0.09,bassVol:0.07 },
    // 알파파(10Hz): 활발한 집중 → 역사/사회/논픽션
    'energetic': { bpm:88, binaural:{base:220,beat:10,vol:0.04},
      mel:[['E4',1],['G4',1],['A4',0.5],['B4',0.5],['C5',1],['B4',1],['A4',1],['G4',1],['E4',2],['REST',1],['D4',1],['E4',1],['G4',1],['A4',2],['G4',1],['E4',1],['D4',2],['REST',2]],
      bass:[['E3',2],['A2',2],['D3',2],['E3',2],['A2',2],['B2',2],['E3',4]],
      melType:'triangle',melVol:0.12,bassVol:0.09 },
    // 세타파(7Hz): 감성적 → 동화/성장/감동
    'emotional': { bpm:68, binaural:{base:190,beat:7,vol:0.036},
      mel:[['C4',2],['E4',1],['G4',1],['F4',2],['E4',1],['D4',1],['C4',3],['REST',1],['A3',1],['C4',1],['E4',2],['D4',1],['C4',1],['B3',2],['REST',2]],
      bass:[['C3',4],['F3',2],['G3',2],['E3',2],['A2',2],['C3',4]],
      melType:'sine',melVol:0.11,bassVol:0.08 }
  };

  // 장르 키워드 매칭
  var g = (genre || '').toLowerCase();
  var preset;
  if (g.match(/철학|사상|논어|도덕|윤리/)) preset = 'meditative';
  else if (g.match(/sf|SF|판타지|모험|탐험|우주|공상|과학소설/)) preset = 'adventure';
  else if (g.match(/수필|에세이|자기계발|경제|경영/)) preset = 'calm';
  else if (g.match(/역사|사회|과학|논픽션|정치/)) preset = 'energetic';
  else if (g.match(/동화|성장|감동|우화|그림책/)) preset = 'emotional';
  else if (g.match(/소설|문학|심리|실존|고전/)) preset = 'deep';
  else preset = 'calm';

  BOOK_SOUNDS[bookId] = presets[preset];
  return preset;
}
