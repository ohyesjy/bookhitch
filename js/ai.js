// BookHitch - AI Book Generation Module

async function _aiCall(prompt, model) {
  var controller = new AbortController();
  var tm = setTimeout(function() { controller.abort(); }, 58000);
  var res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt, model: model || 'sonnet' }),
    signal: controller.signal
  });
  clearTimeout(tm);
  if (!res.ok) throw new Error('서버 오류: ' + res.status);
  var data = await res.json();
  if (!data.content || !data.content[0]) throw new Error('AI 응답이 비어있어요');
  var text = data.content[0].text;
  var clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  var s = clean.indexOf('{'), e = clean.lastIndexOf('}');
  if (s >= 0 && e > s) clean = clean.substring(s, e + 1);
  try { return JSON.parse(clean); }
  catch(pe) {
    clean = clean.replace(/[\x00-\x1F\x7F]/g, ' ').replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    return JSON.parse(clean);
  }
}

function _normCh(ch, i, total) {
  ch.t = ch.t || ((i+1) + '장'); ch.s = ch.s || ch.t;
  ch.body = ch.body || ''; ch.qt = ch.qt || '';
  ch.q = ch.q || ''; ch.ct = ch.ct || ''; ch.lt = ch.lt || '';
  ch.fe = ch.fe || '📖'; ch.sm = ch.sm || []; ch.w = ch.w || [];
  ch.sk = ch.sk || 'book';
  if (i === total - 1) ch.isLast = true;
  return ch;
}

function _registerBook(book) {
  book.id = BOOKS.length;
  book.emo = book.emoji || book.emo || '📚';
  book.coreLines = book.coreLines || [];
  book.emotions = book.emotions || [];
  book.cast = book.cast || [];
  book.bigQ = book.bigQ || '';
  book.chapters = (book.chapters || []).map(function(ch, i) {
    return _normCh(ch, i, book.chapters.length);
  });
  BOOKS.push(book);
  generateBookMusic(book.id, book.genre || '');
  try { _set('bh5_custom_books', BOOKS.filter(function(b){return !b._builtin;})); } catch(e) {}
  return book;
}

async function generateBookWithAI(volOverride) {
  var title = volOverride ? volOverride.title : document.getElementById('aiBookTitle').value.trim();
  var author = volOverride ? volOverride.author : document.getElementById('aiBookAuthor').value.trim();
  var volNum = volOverride ? volOverride.vol : 1;
  var statusEl = document.getElementById('aiStatus');
  var genBtn = document.querySelector('[onclick="generateBookWithAI()"]');

  if (!title) { showToast('책 제목을 입력해주세요'); return; }
  if (genBtn) { genBtn.disabled = true; genBtn.style.opacity = '0.5'; }

  var authorStr = author || '미상';
  var volLabel = volNum > 1 ? ' ('+volNum+'권 생성 중)' : '';

  statusEl.innerHTML = '<div style="margin-bottom:8px">📚 AI가 분석 중... (약 30초)' + volLabel + '</div>'
    + '<div style="width:100%;height:6px;background:rgba(0,0,0,0.16);border-radius:3px;overflow:hidden">'
    + '<div id="aiProg" style="width:5%;height:100%;background:linear-gradient(90deg,#3d0814,#E7F9A9);border-radius:3px;transition:width 0.5s"></div></div>';
  var pTimer = setInterval(function() {
    var bar = document.getElementById('aiProg');
    if (bar) { var w = parseFloat(bar.style.width); if (w < 90) bar.style.width = (w + Math.random()*3) + '%'; }
  }, 1500);

  var volPart = volNum > 1
    ? volNum + '권 내용을 생성해. 앞 권 내용 이후 이어지는 부분.'
    : '긴 책이면 앞부분만(vol:1,totalVol:총권수). 짧은 책은 전체(vol:1,totalVol:1).';

  var prompt = title + '(' + authorStr + '). JSON만(```없이). 원작기반. 5챕터. ' + volPart + '\n'
    + 'body:4~5줄(무슨일+감정변화+왜중요). 초등고학년수준.\n'
    + '{"title":"","author":"","emoji":"","genre":"","vol":'+volNum+',"totalVol":1,"volTitle":"부제","coreLines":["","",""],"bigQ":"","cast":[{"name":"","role":"","emo":"","desc":""}],"emotions":[{"ch":"1장","label":"","color":"#hex","h":50},{"ch":"2장","label":"","color":"#hex","h":60}],"chapters":[{"t":"1장","s":"","body":"4~5줄","qt":"","sm":["","",""],"q":"사유질문","ct":"비판적사고","lt":"논리추론","fe":"이모지2개","sk":"키워드","w":[{"w":"","d":"","e":""}]}]}';

  try {
    var book = await _aiCall(prompt, 'haiku');
    clearInterval(pTimer);

    if (!book.chapters || book.chapters.length === 0) throw new Error('AI가 챕터를 생성하지 못했어요');

    // 분권 시 제목에 권수 표시
    var totalVol = book.totalVol || 1;
    var curVol = book.vol || volNum;
    if (totalVol > 1) book.title = book.title.replace(/ \d+권$/, '') + ' ' + curVol + '권';

    _registerBook(book);
    console.log('✅ 도서 추가:', book.title, book.chapters.length + '챕터 / 총', BOOKS.length, '권');

    if (!volOverride) {
      document.getElementById('aiBookTitle').value = '';
      document.getElementById('aiBookAuthor').value = '';
    }
    renderMyCustomBooks();

    // ── 완료 팝업 ──
    var nextVolHtml = '';
    if (totalVol > 1 && curVol < totalVol) {
      nextVolHtml = '<button onclick="generateBookWithAI({title:\'' + book.title.replace(/ \d+권$/, '').replace(/'/g,"\\'") + '\',author:\'' + (book.author||'').replace(/'/g,"\\'") + '\',vol:' + (curVol+1) + '})" style="margin-top:14px;padding:10px 20px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-family:var(--mono);font-size:12px;cursor:pointer;letter-spacing:1px">[ ' + (curVol+1) + '권 이어서 생성 → ]</button>';
    }

    statusEl.innerHTML = '<div style="background:rgba(255,255,255,0.95);border:1px solid rgba(61,8,20,0.15);border-radius:14px;padding:24px 20px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.12);animation:popIn 0.3s ease">'
      + '<div style="font-size:36px;margin-bottom:10px">🎉</div>'
      + '<div style="font-family:var(--font);font-size:16px;font-weight:700;color:var(--accent);margin-bottom:6px">"' + book.title + '" 완성!</div>'
      + '<div style="font-family:var(--mono);font-size:12px;color:var(--dim);letter-spacing:1px">' + book.chapters.length + '챕터' + (totalVol > 1 ? ' · 전체 ' + totalVol + '권 중 ' + curVol + '권' : '') + '</div>'
      + nextVolHtml
      + '<div style="margin-top:12px;font-family:var(--font);font-size:11px;color:#8A8078">' + (nextVolHtml ? '다음 권을 생성하거나, ' : '') + '3초 후 홈으로 이동</div>'
      + '</div>';

    if (!nextVolHtml) {
      setTimeout(function() {
        statusEl.style.transition = 'opacity 0.5s';
        statusEl.style.opacity = '0';
        setTimeout(function() {
          statusEl.innerHTML = ''; statusEl.style.opacity = '1'; statusEl.style.transition = '';
          navTo('home'); renderShelf();
        }, 500);
      }, 3000);
    } else {
      setTimeout(function() {
        if (statusEl.innerHTML.includes('🎉')) {
          statusEl.style.transition = 'opacity 0.5s'; statusEl.style.opacity = '0';
          setTimeout(function() {
            statusEl.innerHTML = ''; statusEl.style.opacity = '1'; statusEl.style.transition = '';
            navTo('home'); renderShelf();
          }, 500);
        }
      }, 8000);
    }

  } catch(e) {
    clearInterval(pTimer);
    console.error('AI 생성 오류:', e);
    var errMsg = e.message;
    if (e.name === 'AbortError') errMsg = '응답 시간 초과. 다시 시도해주세요.';
    else if (errMsg.includes('JSON')) errMsg = 'AI 응답 해석 실패.';
    else if (errMsg.includes('504')) errMsg = '서버가 바쁩니다. 잠시 후 다시 시도해주세요.';
    statusEl.innerHTML = '❌ ' + errMsg + '<br><span style="font-size:11px;color:var(--dim)">[ AI로 책 생성하기 ] 버튼을 다시 눌러보세요.</span>';
    document.getElementById('aiJsonInput').style.display = 'block';
    document.getElementById('aiJsonBtn').style.display = 'block';
  } finally {
    if (genBtn) { genBtn.disabled = false; genBtn.style.opacity = '1'; }
  }
}

function _getApiKey() {
  var stored = _get('bh5_apikey', '');
  return stored;
}

function applyBookJSON() {
  var jsonText = document.getElementById('aiJsonInput').value.trim();
  var status = document.getElementById('aiStatus');
  try {
    var clean = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    var jsonStart = clean.indexOf('{');
    var jsonEnd = clean.lastIndexOf('}');
    if (jsonStart >= 0 && jsonEnd > jsonStart) clean = clean.substring(jsonStart, jsonEnd + 1);
    var book = JSON.parse(clean);
    if (!book.title || !book.chapters) throw new Error('title 또는 chapters가 없어요');
    _registerBook(book);
    status.textContent = '✅ 완성!';
    document.getElementById('aiBookTitle').value = '';
    document.getElementById('aiBookAuthor').value = '';
    document.getElementById('aiJsonInput').value = '';
    document.getElementById('aiJsonInput').style.display = 'none';
    document.getElementById('aiJsonBtn').style.display = 'none';
    showToast('📚 ' + book.title + ' 추가 완료!');
    renderMyCustomBooks();
    setTimeout(function() { navTo('home'); renderShelf(); }, 1000);
  } catch(e) {
    status.textContent = '❌ ' + (e.message || 'JSON 형식 오류') + ' 다시 시도해주세요.';
  }
}

function renderSrch(q) {
  if (!q) { document.getElementById('srchRes').innerHTML = ''; renderMyCustomBooks(); return; }
  const f = SRCH.filter(b => b.t.includes(q) || b.a.includes(q));
  document.getElementById('srchRes').innerHTML = f.map((b) =>
    `<div class="res-item"><div class="res-emo">${b.e}</div><div style="flex:1"><div class="res-ttl">${b.t}</div><div class="res-auth">${b.a}</div><div class="res-genre">${b.g}</div></div><button class="res-add" onclick="showToast('ADDED')">ADD</button></div>`
  ).join('');
  renderMyCustomBooks();
}
function renderMyCustomBooks() {
  var el = document.getElementById('myCustomBooks');
  if (!el) return;
  var customs = [];
  BOOKS.forEach(function(b, i) { if (!b._builtin) customs.push({book:b, idx:i}); });
  if (customs.length === 0) { el.innerHTML = ''; return; }
  var html = '<div style="margin-bottom:12px;font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:2px">MY BOOKS (' + customs.length + ')</div>';
  customs.forEach(function(item) {
    var b = item.book;
    html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 0;border-bottom:0.5px solid rgba(0,0,0,0.08)">';
    html += '<div onclick="curBookIdx='+item.idx+';CHS=BOOKS['+item.idx+'].chapters;navTo(\'reader\');renderChTabs(0);" style="flex:1;min-width:0;cursor:pointer">';
    html += '<div style="font-weight:700;font-size:13px;color:var(--accent)">' + (b.emo||'📚') + ' ' + b.title + '</div>';
    html += '<div style="font-size:10px;color:var(--dim);margin-top:2px">' + b.author + ' · ' + (b.chapters?b.chapters.length:0) + '챕터</div></div>';
    html += '<span onclick="deleteCustomBook('+item.idx+');renderMyCustomBooks();" style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(192,64,64,0.1);color:#C04040;font-size:16px;font-weight:bold;cursor:pointer;flex-shrink:0">✕</span>';
    html += '</div>';
  });
  el.innerHTML = html;
}
function hideBuiltinBook(idx) {
  var book = BOOKS[idx];
  if (!book) return;
  if (!confirm('"' + book.title + '" 을 목록에서 숨길까요?\n(설정에서 다시 복원 가능)')) return;
  var hidden = _get('bh5_hidden_books', []);
  var key = book.title + '::' + book.author;
  if (hidden.indexOf(key) === -1) hidden.push(key);
  _set('bh5_hidden_books', hidden);
  BOOKS.splice(idx, 1);
  BOOKS.forEach(function(b, i) { b.id = i; });
  renderShelf();
  renderToday();
  _renderShelfList();
  renderMyCustomBooks();
  showToast('"' + book.title + '" 숨김 처리됨');
}
function unhideAllBooks() {
  _set('bh5_hidden_books', []);
  showToast('숨긴 도서가 복원됩니다. 새로고침 해주세요.');
}
function deleteCustomBook(idx) {
  var book = BOOKS[idx];
  if (!book) return;
  if (!confirm('"' + book.title + '" 을 삭제할까요?')) return;
  BOOKS.splice(idx, 1);
  // Re-assign IDs
  BOOKS.forEach(function(b, i) { b.id = i; });
  // Save custom books
  try { _set('bh5_custom_books', BOOKS.filter(function(b) { return !b._builtin; })); } catch(e) {}
  renderShelf();
  renderToday();
  _renderShelfList();
  renderMyCustomBooks();
  showToast('"' + book.title + '" 삭제됨');
}

function filterBooks(v) { renderSrch(v); }
