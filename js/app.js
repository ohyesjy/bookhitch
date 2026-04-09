// BookHitch - Main App Module

// ══ NAVIGATION & SCREEN MANAGEMENT ══════════════════════════

function navTo(id) {
  if (!window._navHistory) window._navHistory = [];
  var cur = document.querySelector('.screen.active');
  if (cur && cur.id && cur.id !== id) window._navHistory.push(cur.id);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='shelf'){renderShelfFull();}
  document.querySelectorAll('.n-btn').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + id);
  if (nb) nb.classList.add('active');
  if (id === 'addbook')    renderSrch('');
  if (id === 'highlights') renderHL();
  if (id === 'home')       { renderToday(); renderShelf(); }
  // 챕터탭은 reader 화면에서만 표시
  var chTabs = document.getElementById('chTabs');
  if (chTabs) chTabs.style.display = (id === 'reader') ? 'flex' : 'none';
}

function goAddBook() { navTo('addbook'); }

function goBack() {
  if (!window._navHistory || window._navHistory.length === 0) {
    navTo('home'); return;
  }
  var prev = window._navHistory.pop();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(prev).classList.add('active');
  document.querySelectorAll('.n-btn').forEach(b => b.classList.remove('active'));
  var nb = document.getElementById('nav-' + prev);
  if (nb) nb.classList.add('active');
  if (prev === 'shelf') _renderShelfList();
}

// ══ BOOK PROGRESS & SHELF RENDERING ══════════════════════════

function getBookProgress(bookIdx) {
  var book = BOOKS[bookIdx];
  var total = book.chapters.length;
  if (total === 0) return { pct: 0, status: '0%', isDone: false };
  var readSet = _get('bh5_read_b' + bookIdx, []);
  var readCount = readSet.length;
  // 전체 읽었으면 DONE
  if (readCount >= total) return { pct: 100, status: 'DONE', isDone: true };
  // 한 번도 안 읽었으면 초기값 유지
  if (readCount === 0) {
    var initPct = book.progress || 0;
    return { pct: initPct, status: initPct > 0 ? initPct + '%' : 'QUEUE', isDone: false };
  }
  var pct = Math.round((readCount / total) * 100);
  return { pct: pct, status: pct + '%', isDone: false };
}

function renderShelf() {
  var list = document.getElementById('shelfList');
  if (!list) return;

  // 한글 자음 추출
  function getConsonant(str) {
    var c = str.charCodeAt(0);
    if (c >= 0xAC00 && c <= 0xD7A3) {
      var idx = Math.floor((c - 0xAC00) / 588);
      return ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][idx] || '*';
    }
    if (/[a-zA-Z]/.test(str[0])) return 'A';
    return '*';
  }
  function normCon(c) { return {'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'}[c] || c; }

  // 현재 필터
  if (!window._shelfFilter) window._shelfFilter = '전체';
  var filter = window._shelfFilter;

  // 필터된 책 목록
  var filtered = [];
  BOOKS.forEach(function(book, i) {
    if (filter === '전체' || normCon(getConsonant(book.title)) === filter) {
      filtered.push({ book: book, idx: i });
    }
  });

  // 카드 인덱스 관리
  if (!window._shelfCardIdx) window._shelfCardIdx = 0;
  if (window._shelfCardIdx >= filtered.length) window._shelfCardIdx = 0;
  if (window._shelfCardIdx < 0) window._shelfCardIdx = filtered.length - 1;
  var ci = window._shelfCardIdx;

  // 사용 중인 자음 목록
  var usedCons = {};
  BOOKS.forEach(function(b) { usedCons[normCon(getConsonant(b.title))] = true; });
  var allCons = ['전체','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','A','*'];
  var activeCons = allCons.filter(function(c) { return c === '전체' || usedCons[c]; });

  var out = '';

  // ── 자음 필터 바 ──
  out += '<div style="display:flex;gap:4px;overflow-x:auto;padding:6px 0 10px;-webkit-overflow-scrolling:touch;scrollbar-width:none">';
  activeCons.forEach(function(c) {
    var isActive = filter === c;
    var bg = isActive ? '#504840' : 'rgba(160,152,136,0.15)';
    var color = isActive ? '#EDE8E0' : '#706860';
    var size = c === '전체' ? 'padding:5px 12px' : 'width:32px;height:32px;display:flex;align-items:center;justify-content:center';
    out += '<button onclick="filterShelf(\'' + c + '\')" style="' + size + ';background:' + bg + ';color:' + color + ';border:none;border-radius:20px;font-family:var(--font);font-size:13px;font-weight:bold;cursor:pointer;flex-shrink:0">' + c + '</button>';
  });
  out += '</div>';

  if (filtered.length === 0) {
    out += '<div style="text-align:center;padding:30px;font-family:var(--font);font-size:13px;color:var(--dim)">이 자음의 책이 없어요</div>';
  } else {
    var item = filtered[ci];
    var book = item.book;
    var bi = item.idx;
    var prog = getBookProgress(bi);
    var delFnCard = book._builtin ? 'hideBuiltinBook(' + bi + ')' : 'deleteCustomBook(' + bi + ')';
    var delBtn = '<div onclick="event.stopPropagation();' + delFnCard + '" style="text-align:center;margin-top:8px;padding:6px 0;color:#C04040;font-size:12px;font-family:var(--mono);cursor:pointer;letter-spacing:1px">✕ 삭제</div>';

    // 카드
    out += '<div style="display:flex;align-items:center;gap:6px">';
    out += '<button onclick="event.stopPropagation();shelfPrev()" style="width:28px;height:60px;background:none;border:none;font-size:20px;color:#A09888;cursor:pointer;flex-shrink:0">◀</button>';

    out += '<div onclick="selectBook(' + bi + ')" style="flex:1;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.35);border-radius:12px;padding:16px 16px 16px 18px;cursor:pointer;position:relative;box-shadow:0 4px 16px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.4);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)">';
    // 클립 (오른쪽 상단)
    out += '<svg width="24" height="50" viewBox="0 0 24 50" style="position:absolute;top:-12px;right:20px" fill="none"><path d="M12 0 L12 8 Q12 12 8 12 L8 38 Q8 46 16 46 L16 12 Q16 8 12 8" stroke="#888" stroke-width="1.8" fill="none"/></svg>';
    out += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">';
    out += '<span style="font-size:28px">' + book.emo + '</span>';
    out += '<div><div style="font-family:var(--font);font-size:14px;font-weight:bold;color:#2A2520">' + book.title + '</div>';
    out += '<div style="font-family:var(--font);font-size:10px;color:#8A8078;margin-top:2px">' + book.author + '</div></div></div>';
    out += '<span style="font-size:9px;font-family:var(--mono);color:#8A8078;letter-spacing:1px">' + book.chapters.length + ' CHAPTERS</span>';

    if (book.coreLines && book.coreLines[0]) {
      out += '<div style="margin-top:8px;padding:8px;background:rgba(0,0,0,0.03);border-left:2px solid #A09888;border-radius:2px;font-family:var(--font);font-size:11px;color:#504840;line-height:1.5;font-style:italic">"' + book.coreLines[0] + '"</div>';
    }

    out += '<div style="margin-top:10px;display:flex;align-items:center;gap:8px">';
    out += '<div style="flex:1;height:4px;background:rgba(0,0,0,0.08);border-radius:2px;overflow:hidden"><div style="width:' + prog.pct + '%;height:100%;background:#FFFFFF;border-radius:2px"></div></div>';
    out += '<span style="font-family:var(--mono);font-size:10px;color:' + (prog.isDone ? '#4A8050' : '#A09888') + ';font-weight:bold">' + prog.status + '</span></div>';
    out += '</div>';

    out += '<button onclick="event.stopPropagation();shelfNext()" style="width:28px;height:60px;background:none;border:none;font-size:20px;color:#A09888;cursor:pointer;flex-shrink:0">▶</button>';
    out += '</div>';

    // 카운터
    out += '<div style="text-align:center;margin-top:6px;font-family:var(--mono);font-size:10px;color:var(--green3)">' + (ci + 1) + ' / ' + filtered.length + '</div>';
    out += delBtn;

    // 터치 스와이프
    setTimeout(function() {
      var card = list.querySelector('[onclick^="selectBook"]');
      if (card && !card._swipe) {
        card._swipe = true;
        var sx = 0;
        card.addEventListener('touchstart', function(e) { sx = e.touches[0].clientX; }, {passive:true});
        card.addEventListener('touchend', function(e) {
          var d = e.changedTouches[0].clientX - sx;
          if (Math.abs(d) > 50) { if (d > 0) shelfPrev(); else shelfNext(); }
        });
      }
    }, 50);
  }

  out += '<div class="shelf-add" onclick="goAddBook()" style="margin-top:10px;display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:10px;"><span class="shelf-idx" style="color:var(--accent); font-weight:700">[+]</span><div class="shelf-add-txt">ADD NEW BOOK</div></div><span style="font-family:var(--mono);font-size:9px;color:var(--dim);letter-spacing:1px;">사유 도서 생성기</span></div>';
  list.innerHTML = out;
}

function filterShelf(con) {
  window._shelfFilter = con;
  window._shelfCardIdx = 0;
  renderShelf();
}

function shelfPrev() {
  window._shelfCardIdx = (window._shelfCardIdx || 0) - 1;
  var filtered = getFilteredBooks();
  if (window._shelfCardIdx < 0) window._shelfCardIdx = filtered.length - 1;
  renderShelf();
}

function shelfNext() {
  window._shelfCardIdx = (window._shelfCardIdx || 0) + 1;
  var filtered = getFilteredBooks();
  if (window._shelfCardIdx >= filtered.length) window._shelfCardIdx = 0;
  renderShelf();
}

function getFilteredBooks() {
  var filter = window._shelfFilter || '전체';
  function getC(str) {
    var c = str.charCodeAt(0);
    if (c >= 0xAC00 && c <= 0xD7A3) { var i = Math.floor((c-0xAC00)/588); return ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][i]||'etc'; }
    if (/[a-zA-Z]/.test(str[0])) return 'A'; return 'etc';
  }
  function norm(c) { return {'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'}[c]||c; }
  var r = [];
  BOOKS.forEach(function(b,i) { if (filter==='전체'||norm(getC(b.title))===filter) r.push({book:b,idx:i}); });
  return r;
}

function goShelfCard(idx) { window._shelfCardIdx = idx; renderShelf(); }
function toggleShelfGroup() {}

function renderShelfFull() {
  var cons = ['전체','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','*'];
  var bar = document.getElementById('shelfConBar');
  if (bar && bar.children.length === 0) {
    if (!window._shelfFullFilter) window._shelfFullFilter = '전체';
    cons.forEach(function(c) {
      var btn = document.createElement('button');
      btn.textContent = c;
      var active = (c === window._shelfFullFilter);
      btn.style.cssText = 'flex-shrink:0;padding:4px 10px;border-radius:16px;border:1px solid rgba(0,0,0,0.2);background:'+(active?'var(--accent)':'transparent')+';color:'+(active?'#fff':'var(--accent)')+';font-size:12px;cursor:pointer;font-family:var(--font);';
      btn.onclick = function(e) {
        e.stopPropagation();
        window._shelfFullFilter = c;
        document.querySelectorAll('#shelfConBar button').forEach(function(b){ b.style.background='transparent'; b.style.color='var(--accent)'; });
        btn.style.background='var(--accent)'; btn.style.color='#fff';
        _renderShelfList();
      };
      bar.appendChild(btn);
    });
  }
  _renderShelfList();
}

function _renderShelfList() {
  var el = document.getElementById('shelfFullList');
  if (!el) return;
  el.innerHTML = '';
  var filter = window._shelfFullFilter || '전체';
  BOOKS.forEach(function(b,i) {
    var con = '*';
    var first = b.title.charCodeAt(0);
    if (first >= 0xAC00 && first <= 0xD7A3) {
      var ci = Math.floor((first - 0xAC00) / 588);
      var rawCon = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][ci];
      con = {'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'}[rawCon] || rawCon;
    }
    if (filter !== '전체' && filter !== con) return;
    var d = document.createElement('div');
    d.style.cssText = 'padding:14px;border-bottom:0.5px solid rgba(0,0,0,0.1);cursor:pointer;';
    var delFn = b._builtin ? 'hideBuiltinBook('+i+')' : 'deleteCustomBook('+i+')';
    var delHtml = '<span onclick="event.stopPropagation();'+delFn+'" style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(192,64,64,0.1);color:#C04040;font-size:16px;font-weight:bold;cursor:pointer;flex-shrink:0;transition:background 0.2s" onmouseenter="this.style.background=\'rgba(192,64,64,0.25)\'" onmouseleave="this.style.background=\'rgba(192,64,64,0.1)\'">✕</span>';
    d.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px">'
      +'<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:14px;color:var(--accent);">'+b.emo+' '+b.title+'</div>'
      +'<div style="font-size:11px;color:var(--dim);margin-top:2px;">'+b.author+'</div></div>'
      +delHtml+'</div>';
    d.onclick = (function(idx){ return function(){ curBookIdx=idx; CHS=BOOKS[idx].chapters; navTo('reader'); renderChTabs(0); }; })(i);
    el.appendChild(d);
  });
}

// ══ HOME & TODAY READING ══════════════════════════

function renderToday() {
  var last = null;
  try {
    last = _get('bh5_last', null);
  } catch(e) { last = null; }
  var bIdx = (last && typeof last.b === 'number' && BOOKS[last.b]) ? last.b : 0;
  var cIdx = (last && typeof last.c === 'number' && BOOKS[bIdx] && BOOKS[bIdx].chapters[last.c]) ? last.c : 0;
  var book = BOOKS[bIdx];
  var ch   = book.chapters[cIdx];
  var pre   = document.getElementById('todayPre');
  var title = document.getElementById('todayTitle');
  var book2 = document.getElementById('todayBook');
  if (pre)   pre.textContent   = ch.t + ' · ' + book.title;
  if (title) title.textContent = ch.s;
  if (book2) book2.textContent = book.author;
  var block = document.getElementById('todayBlock');
  if (block) block.onclick = function() {
    curBookIdx = bIdx;
    CHS = BOOKS[bIdx].chapters;
    navTo('reader');
    document.getElementById('nav-reader').classList.add('active');
    renderChTabs(cIdx);
  };
  // 퀴즈 초기화
  initQuiz();
}

// ══ QUIZ SYSTEM ══════════════════════════

var quizPool = [];
var quizIdx = 0;

function getQuizSketch(type) {
  var w = '<defs><filter id="qwob"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
  var c = '#1A1A1A';
  var sketches = {
    'a1': '<circle cx="50" cy="38" r="22" stroke="C" stroke-width="2" fill="none"/><path d="M40 32 Q44 28 48 32" stroke="C" stroke-width="2" fill="none"/><path d="M52 30 Q56 26 60 30" stroke="C" stroke-width="2" fill="none"/><circle cx="44" cy="35" r="3" fill="C"/><circle cx="56" cy="33" r="3" fill="C"/><path d="M44 46 Q50 50 56 46" stroke="C" stroke-width="2" fill="none"/><line x1="50" y1="60" x2="50" y2="82" stroke="C" stroke-width="2"/><path d="M50 70 L35 64" stroke="C" stroke-width="2"/><path d="M50 70 L65 64" stroke="C" stroke-width="2"/><path d="M35 82 L50 82 L65 82" stroke="C" stroke-width="2"/>',
    'a2': '<text x="20" y="30" font-family="monospace" font-size="11" fill="C">^__^</text><text x="20" y="44" font-family="monospace" font-size="11" fill="C">(^ω^)</text><text x="20" y="58" font-family="monospace" font-size="11" fill="C">/つ つ</text><path d="M20 65 L80 65" stroke="C" stroke-width="1.5"/><text x="15" y="78" font-family="monospace" font-size="10" fill="C">UFO cat</text>',
    'a3': '<ellipse cx="50" cy="30" rx="30" ry="20" stroke="C" stroke-width="2" fill="none"/><circle cx="36" cy="26" r="4" stroke="C" stroke-width="1.5" fill="none"/><circle cx="50" cy="24" r="4" stroke="C" stroke-width="1.5" fill="none"/><circle cx="64" cy="26" r="4" stroke="C" stroke-width="1.5" fill="none"/><path d="M20 40 L15 50 L85 50 L80 40" stroke="C" stroke-width="2" fill="none"/><path d="M30 50 L25 60 M50 50 L50 60 M70 50 L75 60" stroke="C" stroke-width="1.5"/><line x1="50" y1="10" x2="50" y2="2" stroke="C" stroke-width="2"/><circle cx="50" cy="0" r="3" fill="C"/><path d="M30 8 L22 4 M70 6 L78 2" stroke="C" stroke-width="1.5"/>',
    'a4': '<text x="25" y="25" font-family="monospace" font-size="10" fill="C">-=≡ ᶘ◉ᴥ◉ᶅ</text><text x="28" y="40" font-family="monospace" font-size="10" fill="C">-=≡  /つ_つ</text><text x="28" y="55" font-family="monospace" font-size="10" fill="C">-=≡  人  Y</text><text x="28" y="70" font-family="monospace" font-size="10" fill="C">   レ\フ</text>',
    'a5': '<circle cx="50" cy="35" r="18" stroke="C" stroke-width="2" fill="none"/><line x1="35" y1="30" x2="42" y2="33" stroke="C" stroke-width="2"/><line x1="65" y1="30" x2="58" y2="33" stroke="C" stroke-width="2"/><circle cx="43" cy="34" r="3" fill="C"/><circle cx="57" cy="34" r="3" fill="C"/><path d="M44 42 Q50 46 56 42" stroke="C" stroke-width="2" fill="none"/><text x="60" y="22" font-family="serif" font-size="16" fill="C">?</text><line x1="50" y1="53" x2="50" y2="75" stroke="C" stroke-width="2"/><path d="M50 63 L38 56 M50 63 L62 56" stroke="C" stroke-width="2"/><path d="M40 75 L50 75 L60 75" stroke="C" stroke-width="2"/>',
    'a6': '<text x="30" y="20" font-family="monospace" font-size="9" fill="C">( ( ( (</text><text x="28" y="32" font-family="monospace" font-size="9" fill="C">( :  .mmm.  : )</text><text x="28" y="44" font-family="monospace" font-size="9" fill="C">( :  ,_O  ,_O : )</text><text x="32" y="56" font-family="monospace" font-size="9" fill="C">:   __  __ :</text><text x="34" y="68" font-family="monospace" font-size="9" fill="C">-======-</text><text x="30" y="80" font-family="monospace" font-size="9" fill="C">-,`______,`-</text>',
    'a7': '<path d="M30 20 Q50 10 70 20 Q80 35 70 50 Q50 60 30 50 Q20 35 30 20Z" stroke="C" stroke-width="2" fill="none"/><path d="M38 35 L45 35" stroke="C" stroke-width="2.5"/><path d="M55 35 L62 35" stroke="C" stroke-width="2.5"/><path d="M42 48 Q50 52 58 48" stroke="C" stroke-width="2" fill="none"/><line x1="50" y1="60" x2="50" y2="80" stroke="C" stroke-width="2"/><path d="M50 70 L35 63 M50 70 L65 63" stroke="C" stroke-width="2"/><path d="M25 18 L20 10 M75 18 L80 10" stroke="C" stroke-width="1.5"/>',
    'a8': '<text x="22" y="18" font-family="monospace" font-size="8" fill="C">≋ ≋ ^ ≋ ≋</text><text x="22" y="29" font-family="monospace" font-size="8" fill="C">(˙·.˙ω˙.˙·)</text><text x="24" y="40" font-family="monospace" font-size="8" fill="C">| |   | |</text><text x="22" y="51" font-family="monospace" font-size="8" fill="C">\_\___/_/</text><path d="M18 56 L82 56" stroke="C" stroke-width="1.5"/><text x="30" y="68" font-family="monospace" font-size="8" fill="C">*****  *****</text><text x="28" y="79" font-family="monospace" font-size="8" fill="C">******* *******</text>',
    'a9': '<circle cx="50" cy="28" r="16" stroke="C" stroke-width="2" fill="none"/><path d="M42 24 Q46 20 50 24 Q54 20 58 24" stroke="C" stroke-width="1.5" fill="none"/><circle cx="44" cy="29" r="2.5" fill="C"/><circle cx="56" cy="29" r="2.5" fill="C"/><path d="M44 35 Q50 38 56 35" stroke="C" stroke-width="1.5" fill="none"/><line x1="50" y1="44" x2="50" y2="65" stroke="C" stroke-width="2"/><path d="M50 52 L38 46 M50 52 L62 46" stroke="C" stroke-width="2"/><path d="M40 65 L50 65 L60 65" stroke="C" stroke-width="2"/><text x="62" y="20" font-family="serif" font-size="14" fill="C">*</text>',
    'a10': '<path d="M35 55 Q25 50 25 38 Q25 20 40 16 Q55 12 65 22 Q73 30 67 42 Q60 50 52 50 L52 62" stroke="C" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="52" cy="68" r="3" fill="C"/><text x="58" y="48" font-family="serif" font-size="12" fill="C">!</text>',
    'a11': '<text x="15" y="22" font-family="monospace" font-size="8" fill="C">fffff  fffff</text><text x="15" y="32" font-family="monospace" font-size="8" fill="C">LLLLL  LLLLL</text><text x="15" y="42" font-family="monospace" font-size="8" fill="C">lllll  lllll</text><path d="M15 48 L85 48" stroke="C" stroke-width="1.5"/><text x="20" y="58" font-family="monospace" font-size="9" fill="C">SMASH!</text><path d="M15 62 L85 62" stroke="C" stroke-width="1.5"/><text x="15" y="74" font-family="monospace" font-size="8" fill="C">\  /  \  /</text><text x="20" y="84" font-family="monospace" font-size="8" fill="C">V      V</text>',
    'a12': '<circle cx="50" cy="32" r="20" stroke="C" stroke-width="2" fill="none"/><circle cx="42" cy="28" r="5" stroke="C" stroke-width="1.5" fill="none"/><circle cx="58" cy="28" r="5" stroke="C" stroke-width="1.5" fill="none"/><circle cx="42" cy="28" r="2" fill="C"/><circle cx="58" cy="28" r="2" fill="C"/><path d="M43 38 L50 42 L57 38" stroke="C" stroke-width="1.5" stroke-linecap="round"/><path d="M50 52 L50 72" stroke="C" stroke-width="2"/><path d="M38 60 L50 56 L62 60" stroke="C" stroke-width="2"/><path d="M38 72 L62 72" stroke="C" stroke-width="2"/>',
    'a13': '<text x="28" y="20" font-family="monospace" font-size="9" fill="C">) ) ) ) ) )</text><text x="28" y="31" font-family="monospace" font-size="9" fill="C">( ( ( ( ( (</text><text x="32" y="43" font-family="monospace" font-size="9" fill="C">3  J  3</text><text x="32" y="54" font-family="monospace" font-size="9" fill="C">=  =  =</text><path d="M20 60 L80 60" stroke="C" stroke-width="1.5"/><text x="28" y="72" font-family="monospace" font-size="8" fill="C">. . . . . .</text><text x="24" y="83" font-family="monospace" font-size="8" fill="C">o o o o o o o</text>',
    'a14': '<path d="M50 15 Q65 15 70 28 Q75 42 65 52 Q55 60 50 60 Q45 60 35 52 Q25 42 30 28 Q35 15 50 15Z" stroke="C" stroke-width="2" fill="none"/><path d="M40 32 L46 32" stroke="C" stroke-width="2.5"/><path d="M54 32 L60 32" stroke="C" stroke-width="2.5"/><path d="M44 45 Q50 48 56 45" stroke="C" stroke-width="2" fill="none"/><path d="M42 16 L40 8 M58 16 L60 8" stroke="C" stroke-width="1.5"/><line x1="50" y1="60" x2="50" y2="78" stroke="C" stroke-width="2"/><path d="M38 78 L62 78" stroke="C" stroke-width="2"/>',
    'a15': '<text x="18" y="20" font-family="monospace" font-size="8" fill="C">"""""""""</text><text x="18" y="30" font-family="monospace" font-size="8" fill="C">( e     e )</text><text x="20" y="42" font-family="monospace" font-size="8" fill="C">(   J    )</text><text x="20" y="54" font-family="monospace" font-size="8" fill="C">(  ====  )</text><path d="M18 58 L82 58" stroke="C" stroke-width="1.5"/><text x="28" y="70" font-family="monospace" font-size="8" fill="C">|  ||||  |</text><text x="28" y="81" font-family="monospace" font-size="8" fill="C">O        O</text>',
    'a16': '<path d="M20 50 Q20 20 50 15 Q80 20 80 50 Q80 75 50 80 Q20 75 20 50Z" stroke="C" stroke-width="2" fill="none"/><circle cx="40" cy="42" r="5" stroke="C" stroke-width="1.5" fill="none"/><circle cx="60" cy="42" r="5" stroke="C" stroke-width="1.5" fill="none"/><circle cx="40" cy="42" r="2" fill="C"/><circle cx="60" cy="42" r="2" fill="C"/><path d="M42 56 Q50 62 58 56" stroke="C" stroke-width="2" fill="none"/><text x="45" y="32" font-family="serif" font-size="12" fill="C">á</text>',
    'a17': '<text x="24" y="18" font-family="monospace" font-size="9" fill="C">~ ~ ~ ~ ~</text><text x="22" y="30" font-family="monospace" font-size="9" fill="C">(˙ · ω · ˙)</text><text x="24" y="42" font-family="monospace" font-size="9" fill="C">/ つ_つ /</text><text x="24" y="54" font-family="monospace" font-size="9" fill="C">人   Y</text><text x="26" y="66" font-family="monospace" font-size="9" fill="C">レ\フ</text><path d="M18 72 L82 72" stroke="C" stroke-width="1.5"/>',
    'a18': '<circle cx="50" cy="40" r="24" stroke="C" stroke-width="2" fill="none"/><path d="M38 34 Q41 30 44 34" stroke="C" stroke-width="2" fill="none"/><path d="M56 34 Q59 30 62 34" stroke="C" stroke-width="2" fill="none"/><circle cx="41" cy="37" r="3" fill="C"/><circle cx="59" cy="37" r="3" fill="C"/><path d="M44 52 Q50 56 56 52" stroke="C" stroke-width="2" fill="none"/><path d="M36 20 L32 12 M50 18 L50 10 M64 20 L68 12" stroke="C" stroke-width="1.5" stroke-linecap="round"/><text x="68" y="36" font-family="serif" font-size="14" fill="C">?</text>',
    'a19': '<text x="20" y="22" font-family="monospace" font-size="8" fill="C">* * * * * * *</text><text x="20" y="33" font-family="monospace" font-size="8" fill="C">*  ô / ē  *</text><text x="20" y="44" font-family="monospace" font-size="8" fill="C">*  3  J  3  *</text><text x="20" y="55" font-family="monospace" font-size="8" fill="C">*    V      *</text><path d="M20 60 L80 60" stroke="C" stroke-width="1.5"/><text x="15" y="72" font-family="monospace" font-size="8" fill="C">. . * * * * * . .</text><text x="18" y="83" font-family="monospace" font-size="8" fill="C">. * * * * * * * .</text>',
    'a20': '<path d="M32 45 Q28 30 35 22 Q45 12 55 18 Q68 24 65 38 Q62 50 55 52 L55 62" stroke="C" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="55" cy="68" r="3.5" fill="C"/><path d="M28 44 L22 48 M28 38 L22 35" stroke="C" stroke-width="1.5"/><path d="M65 36 L71 32 M65 42 L71 46" stroke="C" stroke-width="1.5"/>'
  };
  var keys = Object.keys(sketches);
  var svg = sketches[type] || sketches[keys[Math.floor(Math.random() * keys.length)]];
  svg = svg.replace(/C/g, c);
  return '<svg width="100" height="95" viewBox="0 0 100 95" fill="none">' + w + '<g filter="url(#qwob)">' + svg + '</g></svg>';
}

function initQuiz() {
  quizPool = [];
  // 모든 책에서 퀴즈 생성
  BOOKS.forEach(function(book, bi) {
    if (!book.chapters) return;
    book.chapters.forEach(function(ch, ci) {
      // 요약 기반 O/X 퀴즈
      if (ch.sm && ch.sm.length > 0) {
        quizPool.push({
          type: 'ox',
          book: book.title,
          q: '"' + book.title + '" - 다음 내용이 맞을까?',
          statement: ch.sm[0],
          answer: true,
          sketch: ['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12','a13','a14','a15','a16','a17','a18','a19','a20'][Math.floor(Math.random()*20)]
        });
      }
      // 챕터 제목 맞히기
      if (ch.s && ch.body) {
        var bodySnippet = ch.body.slice(0, 60) + '...';
        quizPool.push({
          type: 'title',
          book: book.title,
          q: '"' + book.title + '" - 이 내용의 챕터 제목은?',
          hint: bodySnippet,
          answer: ch.s,
          sketch: ['brain','bulb','cat','dizzy'][Math.floor(Math.random()*4)]
        });
      }
      // 단어 뜻 맞히기
      if (ch.w && ch.w.length > 0) {
        var word = ch.w[0];
        quizPool.push({
          type: 'word',
          book: book.title,
          q: '"' + word.w + '"의 뜻은?',
          answer: word.d,
          wrong1: '기억이 안 나요...',
          sketch: ['worm','bomb','cat'][Math.floor(Math.random()*3)]
        });
      }
    });
  });
  // 셔플
  for (var i = quizPool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = quizPool[i]; quizPool[i] = quizPool[j]; quizPool[j] = tmp;
  }
  quizIdx = 0;
  showQuiz();
}

function showQuiz() {
  if (!quizPool.length) {
    var wrap = document.getElementById('quizWrap');
    if (wrap) wrap.innerHTML = '<div style="padding:14px 0; text-align:center; font-family:var(--font); font-size:12px; color:var(--green3);">책을 읽고 퀴즈를 풀어보세요!</div>';
    return;
  }
  var quiz = quizPool[quizIdx % quizPool.length];
  var sketchEl = document.getElementById('quizSketch');
  var qEl = document.getElementById('quizQuestion');
  var optEl = document.getElementById('quizOptions');
  var resEl = document.getElementById('quizResult');
  if (!sketchEl || !qEl) return;

  sketchEl.innerHTML = getQuizSketch(quiz.sketch);
  resEl.style.display = 'none';

  if (quiz.type === 'ox') {
    qEl.innerHTML = quiz.q + '<br><span style="font-weight:normal;font-size:12px;color:#6A3040;">"' + quiz.statement + '"</span>';
    optEl.innerHTML = '<button onclick="event.stopPropagation();answerQuiz(true)" style="padding:7px 20px;margin-right:8px;background:rgba(255,255,255,0.15);color:#1A1A1A;border:1px solid rgba(255,255,255,0.6);border-radius:20px;font-family:var(--mono);font-size:11px;font-weight:600;cursor:pointer;letter-spacing:1px;backdrop-filter:blur(4px);box-shadow:0 2px 8px rgba(0,0,0,0.08)">O 맞아</button>'
      + '<button onclick="event.stopPropagation();answerQuiz(false)" style="padding:7px 20px;background:rgba(255,255,255,0.15);color:#1A1A1A;border:1px solid rgba(255,255,255,0.6);border-radius:20px;font-family:var(--mono);font-size:11px;font-weight:600;cursor:pointer;letter-spacing:1px;backdrop-filter:blur(4px);box-shadow:0 2px 8px rgba(0,0,0,0.08)">X 아니야</button>';
  } else if (quiz.type === 'word') {
    qEl.innerHTML = quiz.q;
    optEl.innerHTML = '<button onclick="event.stopPropagation();revealAnswer()" style="padding:10px 20px;background:var(--accent);color:#E7F9A9;border:none;border-radius:8px;font-family:var(--mono);font-size:14px;cursor:pointer;background:rgba(255,255,255,0.15);color:#1A1A1A;border:1px solid rgba(255,255,255,0.6);box-shadow:0 2px 8px rgba(0,0,0,0.08);backdrop-filter:blur(4px)">🤔 정답 보기</button>';
  } else {
    qEl.innerHTML = quiz.q + '<br><span style="font-weight:normal;font-size:11px;color:#6A3040;">' + quiz.hint + '</span>';
    optEl.innerHTML = '<button onclick="event.stopPropagation();revealAnswer()" style="padding:10px 20px;background:rgba(255,255,255,0.15);color:#1A1A1A;border:1px solid rgba(0,0,0,0.2);border-radius:8px;font-family:var(--mono);font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.08);backdrop-filter:blur(4px)">💡 정답 확인</button>';
  }
}

function answerQuiz(userAnswer) {
  var quiz = quizPool[quizIdx % quizPool.length];
  var resEl = document.getElementById('quizResult');
  var correct = (userAnswer === quiz.answer);
  resEl.style.display = 'block';
  resEl.innerHTML = correct
    ? '<span style="color:#2A6040">🎉 정답! 기억력 짱!</span>'
    : '<span style="color:#8B3040">😅 아쉽! 다시 읽어볼까?</span>';
}

function revealAnswer() {
  var quiz = quizPool[quizIdx % quizPool.length];
  var resEl = document.getElementById('quizResult');
  resEl.style.display = 'block';
  resEl.innerHTML = '<span style="color:#2A6040">💡 정답: ' + quiz.answer + '</span>';
}

function showNextQuiz() {
  quizIdx++;
  showQuiz();
}

// ══ READER & BOOK SELECTION ══════════════════════════

function selectBook(bookIdx) {
  curBookIdx = bookIdx;
  CHS = BOOKS[bookIdx].chapters;
  var p = document.getElementById('castPanel');
  var t = document.getElementById('castToggle');
  if (p) p.classList.remove('open');
  if (t) t.classList.remove('open');
  navTo('reader');
  document.getElementById('nav-reader').classList.add('active');
  switchMusicForBook(bookIdx);
  renderChTabs(0);
}

function goReader() {
  navTo('reader');
  document.getElementById('nav-reader').classList.add('active');
  var chTabs = document.getElementById('chTabs');
  if (chTabs) chTabs.style.display = 'flex';
  renderChTabs(0);
}

// ══ CHARACTER CAST ══════════════════════════

function toggleCast() {
  var panel = document.getElementById('castPanel');
  var toggle = document.getElementById('castToggle');
  if (!panel || !toggle) return;
  var isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    toggle.classList.remove('open');
  } else {
    renderCast();
    panel.classList.add('open');
    toggle.classList.add('open');
  }
}

function renderCast() {
  var panel = document.getElementById('castPanel');
  if (!panel) return;
  var book = BOOKS[curBookIdx];
  var cast = book.cast || [];
  panel.innerHTML = cast.map(function(c) {
    return '<div class="cast-item">'
      + '<div class="cast-emo">' + c.emo + '</div>'
      + '<div>'
      + '<div class="cast-name">' + c.name + '</div>'
      + '<div class="cast-role">' + c.role + '</div>'
      + '<div class="cast-desc">' + c.desc + '</div>'
      + '</div></div>';
  }).join('');
}

// ══ CHAPTER NAVIGATION ══════════════════════════

function renderChTabs(activeIdx) {
  const book = BOOKS[curBookIdx];
  const titleEl = document.getElementById('rTitle');
  if (titleEl) titleEl.textContent = book.title;
  const tabs = document.getElementById('chTabs');
  tabs.innerHTML = book.chapters.map(function(ch, i) {
    return '<button class="ch-tab' + (i === activeIdx ? ' active' : '') + '" onclick="loadCh(' + i + ',this)">'
      + '<span class="ch-tab-num">[' + i + '] ' + ch.t + '</span>'
      + '<span class="ch-tab-title">' + ch.s + '</span>'
      + '</button>';
  }).join('');
  loadCh(activeIdx, tabs.querySelectorAll('.ch-tab')[activeIdx]);
}

// ══ CHAPTER NAV BUTTONS ══
function buildChNavButtons(idx) {
  var total = CHS.length;
  var prevBtn = idx > 0
    ? '<button onclick="goChPrev()" style="flex:1;padding:16px;background:var(--accent);color:#E7F9A9;border:none;border-radius:10px;font-family:var(--mono);font-size:13px;letter-spacing:1px;cursor:pointer">◀ 이전 챕터</button>'
    : '<div style="flex:1"></div>';
  var nextBtn = idx < total - 1
    ? '<button onclick="goChNext()" style="flex:1;padding:16px;background:var(--accent);color:#E7F9A9;border:none;border-radius:10px;font-family:var(--mono);font-size:13px;letter-spacing:1px;cursor:pointer">다음 챕터 ▶</button>'
    : '<div style="flex:1"></div>';
  var counter = '<div style="font-family:var(--mono);font-size:10px;color:var(--green3);text-align:center;margin-bottom:6px">' + (idx+1) + ' / ' + total + '</div>';
  return '<div style="padding:20px 0 10px">' + counter + '<div style="display:flex;gap:10px">' + prevBtn + nextBtn + '</div></div>';
}

function goChPrev() {
  if (curChIdx > 0) {
    var newIdx = curChIdx - 1;
    var tabs = document.querySelectorAll('.ch-tab');
    loadCh(newIdx, tabs[newIdx] || null);
  }
}

function goChNext() {
  if (curChIdx < CHS.length - 1) {
    var newIdx = curChIdx + 1;
    var tabs = document.querySelectorAll('.ch-tab');
    loadCh(newIdx, tabs[newIdx] || null);
  }
}

function loadCh(idx, tabEl) {
  curChIdx = idx;
  CHS = BOOKS[curBookIdx].chapters;
  // 마지막 읽은 책+챕터 저장
  try { _set('bh5_last', {b: curBookIdx, c: idx}); } catch(e) {}
  // 읽은 챕터 기록 (진행도 자동 계산용)
  var readKey = 'bh5_read_b' + curBookIdx;
  var readSet = _get(readKey, []);
  if (readSet.indexOf(idx) === -1) { readSet.push(idx); _set(readKey, readSet); }
  document.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  const ch = CHS[idx];
  const body = document.getElementById('rBody');

  const storyHTML = ch.body.split('\n\n').map(p => `<p>${p}</p>`).join('');
  const sumHTML   = ch.sm.map(s => `<div class="sum-item">${s}</div>`).join('');
  const wordsHTML = ch.w.map(w =>
    `<div class="word-row" onclick="showWord('${w.w}','${w.d}','${w.e}')"><span class="w-term">${w.w}</span><span class="w-def">${w.d}</span></div>`
  ).join('');
  const qAreaHTML = buildQArea(idx);

  body.innerHTML =
    `<div class="ch-eyebrow fu">${ch.t}</div>` +
    `<div class="ch-title fu">${ch.s}</div>` +
    `<div class="ch-sub fu2">${BOOKS[curBookIdx].title} · ${BOOKS[curBookIdx].author}</div>` +
    `<div class="funny-box fu2"><span class="funny-emo">${ch.fe}</span><div class="funny-cap">// CHAPTER VISUAL</div></div>` +
    `<div class="story-text fu3">${storyHTML}</div>` +
    `<div class="quote-line fu3">${ch.qt}</div>` +
    getSayuSketch(curBookIdx, idx) +
    `<div class="sum-block fu3"><div class="sum-hd">SUMMARY</div>${sumHTML}</div>` +
    `<div class="words-block fu4"><div class="words-hd">WORDS</div>${wordsHTML}</div>` +
    `<div class="q-block fu4"><div class="q-hd">THINK</div>` +
    `<div class="q-card-inner"><div class="q-text">${ch.q}</div>` +
    `<div id="qa${idx}">${qAreaHTML}</div></div></div>` +
    (ch.ct ? `<div class="q-block fu4" style="border-left:3px solid #C04040"><div class="q-hd" style="color:#C04040">🔍 비판적 사고</div><div class="q-card-inner"><div class="q-text">${ch.ct}</div></div></div>` : '') +
    (ch.lt ? `<div class="q-block fu4" style="border-left:3px solid #4060C0"><div class="q-hd" style="color:#4060C0">⚙️ 논리적 사고</div><div class="q-card-inner"><div class="q-text">${ch.lt}</div></div></div>` : '') +
    (ch.sayu ? buildSayuHTML(ch, idx) : '') +
    (ch.isLast ? buildCoreHTML() : '') +
    (ch.isLast ? buildEmotionHTML() : '') +
    (ch.isLast ? buildBigQHTML(idx) : '') +
    (ch.isLast ? buildEndingHTML(idx) : '') +
    buildChNavButtons(idx) +
    `<div style="height:10px"></div>`;

  // 챕터 전환 시 스크롤 최상단 복귀
  var readerEl = document.getElementById('reader');
  if (readerEl) readerEl.scrollTop = 0;
  body.scrollTop = 0;
}

// ══ HIGHLIGHTS & NOTES ══════════════════════════

var hlActiveBook = -1; // -1 = 전체

window._hlCon = window._hlCon || '전체';
function _hlGetCon(s) {
  var c = s.charCodeAt(0);
  if (c >= 0xAC00 && c <= 0xD7A3) {
    var r = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'][Math.floor((c-0xAC00)/588)] || 'etc';
    return {'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'}[r] || r;
  }
  return /[a-zA-Z]/.test(s[0]) ? 'A' : 'etc';
}

function renderHLConBar() {
  var bar = document.getElementById('hlConBar');
  if (!bar) return;
  var used = {};
  BOOKS.forEach(function(b) { used[_hlGetCon(b.title)] = true; });
  var all = ['전체','ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ','A'];
  bar.innerHTML = all.filter(function(c){ return c==='전체'||used[c]; }).map(function(c) {
    var on = window._hlCon === c;
    var sz = c==='전체' ? 'padding:4px 10px' : 'width:30px;height:30px;display:flex;align-items:center;justify-content:center';
    return '<button onclick="hlFilterCon(\''+c+'\')" style="'+sz+';background:'+(on?'#504840':'rgba(160,152,136,0.15)')+';color:'+(on?'#EDE8E0':'#706860')+';border:none;border-radius:20px;font-family:var(--font);font-size:12px;font-weight:bold;cursor:pointer;flex-shrink:0">'+c+'</button>';
  }).join('');
}

function hlFilterCon(con) {
  window._hlCon = con; hlActiveBook = -1;
  renderHLConBar(); renderHLTabs(); renderHLList();
}

function renderHLTabs() {
  var tabs = document.getElementById('hlTabs');
  if (!tabs) return;
  var con = window._hlCon || '전체';
  var filtered = con === '전체' ? BOOKS : BOOKS.filter(function(b){ return _hlGetCon(b.title)===con; });
  var out = '';
  filtered.forEach(function(book) {
    var isActive = hlActiveBook === book.id;
    out += '<button class="hl-tab' + (isActive ? ' active' : '') + '" onclick="filterHL(' + book.id + ')">'
      + book.emo + ' ' + book.title.split(' ')[0] + '</button>';
  });
  tabs.innerHTML = out;
}

function filterHL(bookId) {
  hlActiveBook = bookId;
  renderHLTabs();
  renderHLList();
}

function renderHL() {
  renderHLConBar();
  renderHLTabs();
  renderHLList();
}

function renderHLList() {
  var list = document.getElementById('hlList');
  if (!list) return;
  var out = '';
  var _con = window._hlCon || '전체';
  var _cb = _con === '전체' ? BOOKS : BOOKS.filter(function(b){ return _hlGetCon(b.title)===_con; });
  var booksToShow = hlActiveBook === -1 ? _cb : _cb.filter(function(b){ return b.id === hlActiveBook; });
  booksToShow.forEach(function(book) {
    out += '<div class="note-book-header">[' + book.emo + '] ' + book.title + '</div>';
    book.chapters.forEach(function(ch, idx) {
      var key = 'b' + book.id + '*' + idx;
      var ans = answers[key];
      out += '<div class="note-item">';
      out += '<div class="note-book">' + ch.t + ' — ' + ch.s + '</div>';
      out += '<div class="note-q">' + ch.q + '</div>';
      if (ans) {
        out += '<div class="note-ans">' + ans + '</div>';
        out += '<button class="note-del" onclick="delNote(' + book.id + ',' + idx + ')">[삭제]</button>';
      } else {
        out += '<div class="note-empty">&gt; 아직 답변 없음</div>';
        out += '<button class="note-go" onclick="jumpToQ(' + book.id + ',' + idx + ')">[ 답변하기 ]</button>';
      }
      out += '</div>';
    });
  });
  list.innerHTML = out || '<div style="padding:30px 20px;font-size:10px;color:var(--dim);">&gt; 아직 답변 없음</div>';
}

function delNote(bookId, chIdx) {
  var key = 'b' + bookId + '*' + chIdx;
  delete answers[key];
  try { _set('bh5_ans', answers); } catch(e) {}
  renderHL();
  showToast('삭제됐어요');
}

function jumpToQ(bookId, chIdx) {
  curBookIdx = bookId;
  CHS = BOOKS[bookId].chapters;
  navTo('reader');
  document.getElementById('nav-reader').classList.add('active');
  renderChTabs(chIdx);
  setTimeout(function() {
    var qa = document.getElementById('qa' + chIdx);
    if (qa) qa.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 350);
}

// ══ WORD POPUP ══════════════════════════

function showWord(w, d, e) {
  document.getElementById('popTerm').textContent = w;
  document.getElementById('popDef').textContent = d;
  document.getElementById('popEx').textContent = e;
  document.getElementById('wordPop').classList.add('show');
  document.getElementById('overlay').classList.add('show');
}

function closePop() {
  document.getElementById('wordPop').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}
