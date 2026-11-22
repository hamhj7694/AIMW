/*
 * AIMW Design v3.1 Generator — The Work Order
 * ------------------------------------------------------------------
 * 문서 → 3색 토큰 → 컴포넌트 → 작업 행 화면 → 수치 검증 → 핸드오프
 * 이 플러그인은 design-v3/00~06 문서의 값만 옮긴다. 디자인을 제안하지 않는다.
 */

const PRIMITIVES = {
  'paper': '#E8E9E2',
  'ink': '#202722',
  'signal': '#B8371B',
  'ink/70': '#59625B',
  'ink/20': '#C9CCC3',
  'signal/soft': '#EFD9D2',
  'paper/alt': '#DCDDD5'
};

const SEMANTIC = {
  'bg/base': 'paper',
  'bg/recess': 'paper/alt',
  'border/rule': 'ink/20',
  'text/primary': 'ink',
  'text/secondary': 'ink/70',
  'text/on-signal': 'paper',
  'signal/action': 'signal',
  'signal/soft': 'signal/soft'
};

const SPACING = [4, 8, 12, 16, 24, 32, 48, 64];
const RADIUS = { none: 0, tight: 2 };

const TEXT_STYLES = [
  { name: 'Display', family: 'sans', size: 32, line: 40, weight: 700 },
  { name: 'H1', family: 'sans', size: 26, line: 34, weight: 700 },
  { name: 'H2', family: 'sans', size: 19, line: 28, weight: 600 },
  { name: 'Body', family: 'sans', size: 14, line: 22, weight: 400 },
  { name: 'Caption', family: 'sans', size: 12, line: 18, weight: 400 },
  { name: 'Stamp', family: 'stamp', size: 40, line: 44, weight: 700 }
];

const FONT = { sansRegular: null, sansSemi: null, sansBold: null, stamp: null };

const state = {
  pages: {},
  vars: {},
  styles: {},
  components: {},
  report: {
    steps: [], warnings: [], overflow: [], fonts: {},
    unbound: 0, hardcodedHex: 0, primaryActions: []
  }
};

/* ---------------------------------- utils --------------------------------- */

function hexToRgb(value) {
  const s = String(value).replace('#', '');
  return {
    r: parseInt(s.slice(0, 2), 16) / 255,
    g: parseInt(s.slice(2, 4), 16) / 255,
    b: parseInt(s.slice(4, 6), 16) / 255
  };
}

function post(type, payload) {
  figma.ui.postMessage(Object.assign({ type: type }, payload || {}));
}

function log(step, detail) {
  state.report.steps.push({ step: step, detail: detail });
  post('progress', { text: step + ' — ' + detail });
}

function warn(message) {
  state.report.warnings.push(message);
  post('warn', { text: message });
}

function fontKey(fontName) {
  return fontName ? fontName.family + '|' + fontName.style : '-';
}

async function probeFonts() {
  const list = await figma.listAvailableFontsAsync();
  const families = list.map(function (f) { return f.family; });

  function pickFamily(candidates) {
    for (let i = 0; i < candidates.length; i++) {
      if (families.indexOf(candidates[i]) !== -1) return candidates[i];
    }
    return families.length ? families[0] : candidates[0];
  }

  function pickStyle(family, candidates) {
    for (let i = 0; i < candidates.length; i++) {
      if (list.some(function (f) { return f.family === family && f.style === candidates[i]; })) {
        return candidates[i];
      }
    }
    const found = list.filter(function (f) { return f.family === family; });
    return found.length ? found[0].style : 'Regular';
  }

  const sans = pickFamily(['Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic']);
  const serif = pickFamily(['Nanum Myeongjo', 'Noto Serif KR', 'Batang']);

  FONT.sansRegular = { family: sans, style: pickStyle(sans, ['Regular']) };
  FONT.sansSemi = { family: sans, style: pickStyle(sans, ['SemiBold', 'Medium', 'Bold', 'Regular']) };
  FONT.sansBold = { family: sans, style: pickStyle(sans, ['Bold', 'SemiBold', 'Regular']) };
  FONT.stamp = { family: serif, style: pickStyle(serif, ['Bold', 'Regular']) };

  const unique = [FONT.sansRegular, FONT.sansSemi, FONT.sansBold, FONT.stamp];
  const loaded = {};
  for (let i = 0; i < unique.length; i++) {
    const key = fontKey(unique[i]);
    if (!loaded[key]) {
      try {
        await figma.loadFontAsync(unique[i]);
        loaded[key] = true;
      } catch (e) {
        warn('폰트 로드 실패: ' + key);
      }
    }
  }

  state.report.fonts = { sans: fontKey(FONT.sansRegular), stamp: fontKey(FONT.stamp) };
  if (sans !== 'Pretendard') warn('Pretendard가 없어 ' + sans + '를 사용합니다.');
  if (serif !== 'Nanum Myeongjo') warn('나눔명조가 없어 ' + serif + '를 숫자 도장에 사용합니다.');
  log('환경 프로브', 'SANS=' + fontKey(FONT.sansRegular) + ' / STAMP=' + fontKey(FONT.stamp));
}

async function ensurePage(name) {
  let page = null;
  for (let i = 0; i < figma.root.children.length; i++) {
    const child = figma.root.children[i];
    if (child.type === 'PAGE' && child.name === name) page = child;
  }
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  await figma.setCurrentPageAsync(page);
  return page;
}

function collection(name) {
  const c = figma.variables.createVariableCollection(name);
  try { c.renameMode(c.modes[0].modeId, 'Value'); } catch (e) { /* ignore */ }
  return c;
}

function makeColorVar(name, value, targetCollection, modeId) {
  const v = figma.variables.createVariable(name, targetCollection, 'COLOR');
  v.setValueForMode(modeId, hexToRgb(value));
  return v;
}

function makeNumberVar(name, value, targetCollection, modeId) {
  const v = figma.variables.createVariable(name, targetCollection, 'FLOAT');
  v.setValueForMode(modeId, value);
  return v;
}

function makeAliasVar(name, targetVar, targetCollection, modeId) {
  const v = figma.variables.createVariable(name, targetCollection, 'COLOR');
  try {
    const alias = figma.variables.setVariableAlias(v, targetVar.id);
    v.setValueForMode(modeId, alias);
  } catch (e) {
    warn('별칭 바인딩 실패: ' + name + ' — 원시값으로 대체');
    const raw = targetVar.valuesByMode[modeId];
    if (raw && typeof raw === 'object') v.setValueForMode(modeId, raw);
  }
  return v;
}

function fallbackFor(variable) {
  if (!variable) return PRIMITIVES.paper;
  if (PRIMITIVES[variable.name]) return PRIMITIVES[variable.name];
  if (SEMANTIC[variable.name] && PRIMITIVES[SEMANTIC[variable.name]]) {
    return PRIMITIVES[SEMANTIC[variable.name]];
  }
  return PRIMITIVES.paper;
}

function fillOf(variable) {
  return [{ type: 'SOLID', color: hexToRgb(fallbackFor(variable)) }];
}

function bindFill(node, variable) {
  if (!node || !variable) {
    state.report.unbound++;
    return false;
  }
  try {
    node.setBoundVariable('fills', variable.id);
    return true;
  } catch (e) {
    state.report.unbound++;
    return false;
  }
}

function painted(node, variable) {
  node.fills = fillOf(variable);
  bindFill(node, variable);
  return node;
}

function frame(name, x, y, w, h, colorVar, parent, clip) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  painted(f, colorVar);
  f.clipsContent = !!clip;
  if (parent) parent.appendChild(f);
  f.x = x;
  f.y = y;
  return f;
}

function rectangle(name, x, y, w, h, colorVar, parent) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  painted(r, colorVar);
  if (parent) parent.appendChild(r);
  r.x = x;
  r.y = y;
  return r;
}

function text(name, characters, x, y, w, h, styleName, parent, colorVar) {
  const t = figma.createText();
  t.name = name;
  const spec = TEXT_STYLES.filter(function (s) { return s.name === styleName; })[0] || TEXT_STYLES[3];
  t.fontName = spec.family === 'stamp' ? FONT.stamp
    : spec.weight >= 700 ? FONT.sansBold
      : spec.weight >= 600 ? FONT.sansSemi : FONT.sansRegular;
  t.fontSize = spec.size;
  t.lineHeight = { unit: 'PIXELS', value: spec.line };
  t.letterSpacing = { unit: 'PERCENT', value: 0 };
  t.characters = characters;
  if (w) t.resize(w, h || spec.line);
  painted(t, colorVar || state.vars.semantic['text/primary']);
  if (parent) parent.appendChild(t);
  t.x = x;
  t.y = y;
  return t;
}

function rule(parent, x, y, w) {
  return rectangle('Rule', x, y, w, 1, state.vars.semantic['border/rule'], parent);
}

function vRule(parent, x, y, h) {
  return rectangle('Rule vertical', x, y, 1, h, state.vars.semantic['border/rule'], parent);
}

function signalBar(parent, x, y, h) {
  return rectangle('Signal bar', x, y, 2, h, state.vars.semantic['signal/action'], parent);
}

function autoLayout(node, gap, padding) {
  node.layoutMode = 'HORIZONTAL';
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'FIXED';
  node.itemSpacing = gap;
  node.paddingLeft = padding;
  node.paddingRight = padding;
  node.paddingTop = 0;
  node.paddingBottom = 0;
  node.primaryAxisAlignItems = 'MIN';
  node.counterAxisAlignItems = 'CENTER';
  return node;
}

function setInstanceText(instance, index, value) {
  try {
    const nodes = instance.children.filter(function (c) { return c.type === 'TEXT'; });
    if (nodes[index]) nodes[index].characters = value;
  } catch (e) { /* ignore */ }
}

function instance(parent, key, name, x, y) {
  const target = state.components[key];
  if (!target) return null;
  const inst = target.createInstance();
  inst.name = name;
  parent.appendChild(inst);
  inst.x = x;
  inst.y = y;
  return inst;
}

/* ------------------------------- 1. tokens -------------------------------- */

async function buildTokens() {
  const p = state.vars;
  const cPrim = collection('Primitives');
  const cColor = collection('Color Light');
  const cSpace = collection('Spacing');
  const cRadius = collection('Radius');
  const modePrim = cPrim.modes[0].modeId;
  const modeColor = cColor.modes[0].modeId;
  const modeSpace = cSpace.modes[0].modeId;
  const modeRadius = cRadius.modes[0].modeId;

  p.primitive = {};
  Object.keys(PRIMITIVES).forEach(function (name) {
    p.primitive[name] = makeColorVar(name, PRIMITIVES[name], cPrim, modePrim);
  });

  p.semantic = {};
  Object.keys(SEMANTIC).forEach(function (name) {
    p.semantic[name] = makeAliasVar(name, p.primitive[SEMANTIC[name]], cColor, modeColor);
  });

  p.spacing = {};
  SPACING.forEach(function (value) {
    p.spacing[value] = makeNumberVar(String(value), value, cSpace, modeSpace);
  });

  p.radius = {};
  Object.keys(RADIUS).forEach(function (name) {
    p.radius[name] = makeNumberVar(name, RADIUS[name], cRadius, modeRadius);
  });

  log('토큰', '색 3개 + 파생 4개, Semantic 8개, 간격 8개, 반경 2개');
}

async function buildTextStyles() {
  for (let i = 0; i < TEXT_STYLES.length; i++) {
    const spec = TEXT_STYLES[i];
    const style = figma.createTextStyle();
    style.name = spec.name;
    style.fontName = spec.family === 'stamp' ? FONT.stamp
      : spec.weight >= 700 ? FONT.sansBold
        : spec.weight >= 600 ? FONT.sansSemi : FONT.sansRegular;
    style.fontSize = spec.size;
    style.lineHeight = { unit: 'PIXELS', value: spec.line };
    style.letterSpacing = { unit: 'PERCENT', value: 0 };
    try { style.fontWeight = spec.weight; } catch (e) { /* ignore */ }
    state.styles[spec.name] = style;
  }
  log('텍스트 스타일', TEXT_STYLES.length + '종 생성, 모노 없음');
}

/* --------------------------- 2. foundations ------------------------------- */

function foundationBoards(page) {
  const paper = state.vars.semantic['bg/base'];
  const ink = state.vars.semantic['text/primary'];
  const secondary = state.vars.semantic['text/secondary'];
  const signal = state.vars.semantic['signal/action'];

  const f0 = frame('F0 작업 지시서 · 원칙', 0, 0, 760, 420, paper, page);
  text('F0 title', 'The Work Order', 28, 28, 560, 44, 'Display', f0, ink);
  text('F0 subtitle', '캠페인 제작을 확인하는 한 장', 28, 82, 560, 32, 'H2', f0, signal);
  rule(f0, 28, 128, 704);
  text('F0 role', '이 화면은 지금 확인해야 할 일 하나와 그 근거를 보여 준다.', 28, 152, 700, 28, 'Body', f0, ink);
  text('F0 do', '한다: 말로 시작, 사람이 확정, 게이트와 근거를 숨기지 않음', 28, 200, 700, 26, 'Body', f0, ink);
  text('F0 dont', '하지 않는다: 카드 남발, 배지 남발, 자동 연결, 자동 완성', 28, 236, 700, 26, 'Body', f0, ink);
  text('F0 note', '미학은 업종과 무관한 마케팅 운영의 브리프와 검수표에서 가져왔습니다.', 28, 300, 700, 24, 'Caption', f0, secondary);

  const f1 = frame('F1 컬러 · 3색 + 명도 파생', 820, 0, 1080, 500, paper, page);
  text('F1 title', '컬러', 28, 24, 300, 34, 'H1', f1, ink);
  text('F1 ratio', 'paper 60%   ink 30%   signal 10%', 28, 62, 600, 22, 'Caption', f1, secondary);
  const keys = Object.keys(PRIMITIVES);
  keys.forEach(function (key, i) {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 28 + col * 250;
    const y = 100 + row * 176;
    rectangle('Swatch/' + key, x, y, 230, 88, state.vars.primitive[key], f1);
    text('Swatch name', key, x, y + 100, 220, 20, 'Body', f1, ink);
    text('Swatch hex', PRIMITIVES[key], x, y + 124, 220, 18, 'Caption', f1, secondary);
  });
  text('F1 rule', '파생 4개는 명도만 다릅니다. 다른 색은 없습니다.', 28, 452, 900, 24, 'Body', f1, signal);

  const f2 = frame('F2 타이포 · 6 styles', 0, 480, 760, 560, paper, page);
  text('F2 title', '타이포', 28, 24, 300, 34, 'H1', f2, ink);
  TEXT_STYLES.forEach(function (spec, i) {
    const y = 84 + i * 74;
    text('Spec/' + spec.name, spec.name + '  ' + spec.size + '/' + spec.line, 28, y, 200, 20, 'Caption', f2, secondary);
    const sample = spec.family === 'stamp' ? '24' : '좋은 오후예요. 지금 할 일이 하나 있어요.';
    text('Sample/' + spec.name, sample, 236, y - 10, 500, spec.line, spec.name, f2, ink);
  });

  const f3 = frame('F3 구조 · 간격 반경 그리드', 820, 560, 1080, 420, paper, page);
  text('F3 title', '간격, 반경, 그리드', 28, 24, 400, 34, 'H1', f3, ink);
  SPACING.forEach(function (value, i) {
    const x = 28 + i * 126;
    rectangle('Space/' + value, x, 88, value, 20, state.vars.semantic['signal/action'], f3);
    text('Space label', String(value), x, 118, 80, 18, 'Caption', f3, ink);
  });
  const rNone = rectangle('Radius/none', 28, 184, 120, 64, state.vars.semantic['bg/recess'], f3);
  const rTight = rectangle('Radius/tight', 180, 184, 120, 64, state.vars.semantic['bg/recess'], f3);
  rTight.cornerRadius = RADIUS.tight;
  text('Radius label', 'none 0   tight 2', 28, 258, 300, 20, 'Caption', f3, ink);
  rule(f3, 28, 312, 1024);
  text('F3 grid', '상단 56   좌측 208   우측 280   하단 28   여백 28   행 64', 28, 332, 980, 24, 'Body', f3, ink);
  text('F3 no shadow', '그림자, 카드, 그라데이션, 점 그리드는 만들지 않습니다.', 28, 368, 980, 24, 'Body', f3, signal);

  log('기초 보드', 'F0~F3 4장 생성');
}

/* --------------------------- 3. components -------------------------------- */

function buildComponents(page) {
  const sec = frame('C 컴포넌트 · 16종', 0, 1100, 1560, 1600, state.vars.semantic['bg/base'], page);
  const c = state.components;
  const ink = state.vars.semantic['text/primary'];
  const secondary = state.vars.semantic['text/secondary'];
  const signal = state.vars.semantic['signal/action'];
  const paper = state.vars.semantic['bg/base'];

  const action = figma.createComponent();
  action.name = 'Button/Action';
  action.resize(156, 40);
  painted(action, signal);
  autoLayout(action, 8, 16);
  text('Label', '결과 확인', 0, 0, 124, 22, 'Body', action, state.vars.semantic['text/on-signal']);
  sec.appendChild(action);
  c.action = action;

  const quiet = figma.createComponent();
  quiet.name = 'Button/Quiet';
  quiet.resize(96, 40);
  quiet.fills = [];
  autoLayout(quiet, 0, 8);
  text('Label', '선택', 0, 0, 80, 22, 'Body', quiet, ink);
  sec.appendChild(quiet);
  c.quiet = quiet;

  const input = figma.createComponent();
  input.name = 'Input/Line';
  input.resize(360, 40);
  input.fills = [];
  rectangle('Underline', 0, 39, 360, 1, state.vars.semantic['border/rule'], input);
  text('Placeholder', '키워드 또는 도메인', 0, 7, 340, 22, 'Body', input, secondary);
  sec.appendChild(input);
  c.input = input;

  const textarea = figma.createComponent();
  textarea.name = 'Textarea/Line';
  textarea.resize(560, 80);
  textarea.fills = [];
  rectangle('Underline', 0, 79, 560, 1, state.vars.semantic['border/rule'], textarea);
  text('Placeholder', '편하게 적어 주세요.', 0, 8, 520, 22, 'Body', textarea, secondary);
  sec.appendChild(textarea);
  c.textarea = textarea;

  const select = figma.createComponent();
  select.name = 'Select/Line';
  select.resize(200, 40);
  select.fills = [];
  rectangle('Underline', 0, 39, 200, 1, state.vars.semantic['border/rule'], select);
  text('Value', '기간 선택', 0, 7, 180, 22, 'Body', select, ink);
  sec.appendChild(select);
  c.select = select;

  const rowTask = figma.createComponent();
  rowTask.name = 'Row/Task';
  rowTask.resize(896, 64);
  rowTask.fills = [];
  rule(rowTask, 0, 63, 896);
  text('Key', '수집', 0, 10, 180, 24, 'Body', rowTask, ink);
  text('Value', '진행 중', 220, 10, 420, 24, 'Body', rowTask, ink);
  text('Meta', '14:02', 760, 10, 136, 24, 'Caption', rowTask, secondary);
  sec.appendChild(rowTask);
  c.rowTask = rowTask;

  const rowResult = figma.createComponent();
  rowResult.name = 'Row/Result';
  rowResult.resize(896, 64);
  rowResult.fills = [];
  rule(rowResult, 0, 63, 896);
  text('Version', 'v2', 0, 10, 80, 24, 'Stamp', rowResult, signal);
  text('Title', '결과 01', 100, 10, 400, 24, 'Body', rowResult, ink);
  text('Meta', '카피와 이미지 초안', 520, 10, 260, 24, 'Caption', rowResult, secondary);
  text('Time', '14:01', 800, 10, 96, 24, 'Caption', rowResult, secondary);
  sec.appendChild(rowResult);
  c.rowResult = rowResult;

  const rowSetting = figma.createComponent();
  rowSetting.name = 'Row/Setting';
  rowSetting.resize(896, 64);
  rowSetting.fills = [];
  rule(rowSetting, 0, 63, 896);
  text('Key', '로컬 AI', 0, 10, 220, 24, 'Body', rowSetting, ink);
  text('Value', '연결됨, qwen', 240, 10, 560, 24, 'Body', rowSetting, secondary);
  sec.appendChild(rowSetting);
  c.rowSetting = rowSetting;

  const stamp = figma.createComponent();
  stamp.name = 'Stamp/Status';
  stamp.resize(124, 28);
  stamp.fills = [];
  autoLayout(stamp, 8, 8);
  signalBar(stamp, 0, 0, 28);
  text('Label', '검증 필요', 0, 0, 100, 22, 'Caption', stamp, signal);
  sec.appendChild(stamp);
  c.stamp = stamp;

  const gate = figma.createComponent();
  gate.name = 'Gate/Step';
  gate.resize(200, 44);
  gate.fills = [];
  rule(gate, 0, 0, 200);
  text('Label', 'G2 구도, 현재', 0, 12, 190, 22, 'Caption', gate, signal);
  sec.appendChild(gate);
  c.gate = gate;

  const progress = figma.createComponent();
  progress.name = 'Progress/Inline';
  progress.resize(240, 28);
  progress.fills = [];
  text('Value', '—', 0, 0, 80, 24, 'Stamp', progress, signal);
  rectangle('Track', 92, 13, 120, 2, state.vars.semantic['border/rule'], progress);
  rectangle('Fill', 92, 13, 60, 2, state.vars.semantic['signal/action'], progress);
  sec.appendChild(progress);
  c.progress = progress;

  const tab = figma.createComponent();
  tab.name = 'Tab/Text';
  tab.resize(112, 40);
  tab.fills = [];
  rectangle('Underline', 0, 39, 112, 2, state.vars.semantic['signal/action'], tab);
  text('Label', '수집', 0, 7, 100, 22, 'Body', tab, signal);
  sec.appendChild(tab);
  c.tab = tab;

  const dock = figma.createComponent();
  dock.name = 'Dock/Next';
  dock.resize(224, 280);
  dock.fills = [];
  vRule(dock, 0, 0, 280);
  text('Label', '다음 수령', 24, 0, 180, 20, 'Caption', dock, secondary);
  rule(dock, 24, 36, 176);
  text('Title', '수집 결과 확인', 24, 56, 176, 30, 'H2', dock, ink);
  text('Body', '새 결과가 도착했어요.', 24, 100, 176, 48, 'Body', dock, secondary);
  rule(dock, 24, 168, 176);
  text('Reason label', '근거', 24, 184, 80, 20, 'Caption', dock, secondary);
  text('Reason value', '1', 24, 208, 176, 26, 'Stamp', dock, signal);
  text('Meta', '예상 1분', 24, 252, 176, 20, 'Caption', dock, secondary);
  sec.appendChild(dock);
  c.dock = dock;

  const notice = figma.createComponent();
  notice.name = 'Notice/Line';
  notice.resize(896, 48);
  notice.fills = [];
  signalBar(notice, 0, 0, 48);
  text('Message', '시연 화면입니다. 실제 발행은 일어나지 않아요.', 16, 12, 860, 24, 'Body', notice, ink);
  sec.appendChild(notice);
  c.notice = notice;

  const dialog = figma.createComponent();
  dialog.name = 'Dialog/Confirm';
  dialog.resize(560, 200);
  painted(dialog, paper);
  rectangle('Top signal', 0, 0, 560, 2, signal, dialog);
  text('Title', '단일 승인 금액이 10,000원을 넘어요', 28, 28, 500, 30, 'H2', dialog, ink);
  text('Body', '계속하려면 한 번 더 확인해 주세요.', 28, 76, 500, 24, 'Body', dialog, ink);
  rule(dialog, 28, 128, 504);
  text('Confirm', '승인하고 큐에 넣기', 28, 148, 240, 24, 'Body', dialog, signal);
  sec.appendChild(dialog);
  c.dialog = dialog;

  const sw = figma.createComponent();
  sw.name = 'Switch';
  sw.resize(48, 28);
  painted(sw, ink);
  const knob = rectangle('Knob', 26, 4, 20, 20, state.vars.semantic['text/on-signal'], sw);
  knob.cornerRadius = RADIUS.tight;
  sec.appendChild(sw);
  c.switch = sw;

  let componentY = 24;
  Object.keys(c).forEach(function (key) {
    const comp = c[key];
    comp.x = 24;
    comp.y = componentY;
    componentY += comp.height + 28;
  });

  log('컴포넌트', Object.keys(c).length + '종 생성 (카드·배지 없음)');
}

/* ------------------------------- 4. screens ------------------------------- */

function shell(page, name, x, y, active) {
  const screen = frame(name, x, y, 1440, 900, state.vars.semantic['bg/base'], page, true);

  const top = frame(name + '/Topbar', 0, 0, 1440, 56, state.vars.semantic['bg/base'], screen);
  rule(top, 0, 55, 1440);
  text('Project', '워크스페이스', 24, 16, 280, 24, 'Body', top, state.vars.semantic['text/primary']);
  text('Doc', '작업 지시서 07', 360, 16, 240, 24, 'Caption', top, state.vars.semantic['text/secondary']);
  text('Provider', '로컬 AI 연결됨', 820, 16, 200, 24, 'Caption', top, state.vars.semantic['text/secondary']);
  text('Cost', '비용 0원', 1180, 16, 160, 24, 'Caption', top, state.vars.semantic['text/secondary']);

  const left = frame(name + '/List', 0, 56, 208, 816, state.vars.semantic['bg/base'], screen);
  vRule(left, 207, 0, 816);
  const items = ['홈', '살펴보기', '스튜디오', '영상 워크벤치', '발행', '성과', '성장', '설정'];
  items.forEach(function (label, i) {
    const yy = 24 + i * 52;
    if (label === active) signalBar(left, 0, yy - 4, 30);
    text('Nav/' + label, label, 20, yy, 170, 24, label === active ? 'H2' : 'Body', left,
      label === active ? state.vars.semantic['signal/action'] : state.vars.semantic['text/secondary']);
  });

  const work = frame(name + '/Work', 208, 56, 952, 816, state.vars.semantic['bg/base'], screen);

  const right = frame(name + '/Right', 1160, 56, 280, 816, state.vars.semantic['bg/base'], screen);
  vRule(right, 0, 0, 816);
  const dock = instance(right, 'dock', 'Dock/Next · ' + name, 24, 24);
  text('Right link', '작업 열기', 24, 332, 176, 22, 'Body', right, state.vars.semantic['signal/action']);

  const status = frame(name + '/Status', 0, 872, 1440, 28, state.vars.semantic['bg/base'], screen);
  rule(status, 0, 0, 1440);
  text('Status line', '시연 화면입니다. 실제 발행은 일어나지 않아요. 자동 연결 0건.', 24, 5, 900, 18, 'Caption', status, state.vars.semantic['text/secondary']);

  return { screen: screen, work: work, right: right, dock: dock };
}

function dockText(dock, title, body, meta, reason) {
  if (!dock) return;
  setInstanceText(dock, 1, title);
  setInstanceText(dock, 2, body);
  setInstanceText(dock, 4, reason);
  setInstanceText(dock, 5, meta);
}

function section(work, label, y) {
  text('Section/' + label, label, 28, y, 500, 26, 'H2', work, state.vars.semantic['text/primary']);
  rule(work, 28, y + 34, 896);
}

function taskRow(work, y, key, value, meta) {
  const r = instance(work, 'rowTask', 'Row/Task ' + key, 28, y);
  setInstanceText(r, 0, key);
  setInstanceText(r, 1, value);
  setInstanceText(r, 2, meta);
  return r;
}

function resultRow(work, y, version, title, meta, time) {
  const r = instance(work, 'rowResult', 'Row/Result ' + title, 28, y);
  setInstanceText(r, 0, version);
  setInstanceText(r, 1, title);
  setInstanceText(r, 2, meta);
  setInstanceText(r, 3, time);
  return r;
}

function settingRow(work, y, key, value) {
  const r = instance(work, 'rowSetting', 'Row/Setting ' + key, 28, y);
  setInstanceText(r, 0, key);
  setInstanceText(r, 1, value);
  return r;
}

function stampAt(parent, label, x, y) {
  const s = instance(parent, 'stamp', 'Stamp/' + label, x, y);
  setInstanceText(s, 0, label);
  return s;
}

function textTabs(work, labels, activeIndex, y) {
  labels.forEach(function (label, i) {
    const isActive = i === activeIndex;
    const t = instance(work, 'tab', 'Tab/' + label, 28 + i * 132, y);
    if (t) {
      setInstanceText(t, 0, label);
      if (!isActive) {
        const underline = t.children.filter(function (n) { return n.name === 'Underline'; })[0];
        if (underline) underline.visible = false;
        const labelNode = t.children.filter(function (n) { return n.type === 'TEXT'; })[0];
        if (labelNode) {
          labelNode.fills = fillOf(state.vars.semantic['text/secondary']);
          bindFill(labelNode, state.vars.semantic['text/secondary']);
        }
      }
    }
  });
  rule(work, 28, y + 48, 896);
}

function buildScreens(page) {
  const ink = state.vars.semantic['text/primary'];
  const secondary = state.vars.semantic['text/secondary'];
  const signal = state.vars.semantic['signal/action'];

  // S0 홈 — 먹색 작업 띠가 화면의 중심
  let s = shell(page, 'S0 홈', 0, 0, '홈');
  const hero = frame('Hero/지금 할 일', 0, 0, 952, 184, ink, s.work);
  text('Hero label', '지금 할 일', 28, 20, 300, 20, 'Caption', hero, state.vars.semantic['text/on-signal']);
  rectangle('Hero rule', 28, 48, 896, 1, state.vars.semantic['bg/recess'], hero);
  text('Hero number', '1', 28, 68, 96, 64, 'Stamp', hero, signal);
  text('Hero title', '수집 결과 확인', 140, 68, 520, 40, 'H1', hero, state.vars.semantic['text/on-signal']);
  text('Hero body', '새 결과가 도착했어요.', 140, 116, 520, 24, 'Body', hero, state.vars.semantic['bg/recess']);
  instance(hero, 'action', 'Action/열기', 780, 88);
  section(s.work, '진행 중', 212);
  taskRow(s.work, 258, '수집', '진행 중', '대기');
  taskRow(s.work, 322, '스튜디오', '초안', '검수 대기');
  taskRow(s.work, 386, '영상', '게이트 2', '승인 대기');
  section(s.work, '최근 결과', 462);
  resultRow(s.work, 508, 'v2', '결과 01', '카피와 이미지 초안', '14:01');
  resultRow(s.work, 572, 'v2', '결과 02', '카피와 이미지 초안', '14:01');
  resultRow(s.work, 636, 'v1', '결과 03', '카피와 이미지 초안', '13:54');
  resultRow(s.work, 700, 'v1', '결과 04', '카피와 이미지 초안', '13:40');
  dockText(s.dock, '수집 결과 확인', '새 결과가 도착했어요.', '예상 1분', '확인 대기 1건');

  // S1 살펴보기
  s = shell(page, 'S1 살펴보기', 1560, 0, '살펴보기');
  textTabs(s.work, ['수집', '참고', '우리 콘텐츠'], 0, 24);
  text('Page title', '경쟁사가 지금 내놓는 콘텐츠', 28, 88, 700, 34, 'H1', s.work, ink);
  instance(s.work, 'input', 'Input/키워드', 28, 144);
  instance(s.work, 'action', 'Action/수집 시작', 408, 144);
  text('Filters', '전체 24    영상 8    이미지 6    블로그 6    뉴스 4', 28, 204, 850, 22, 'Caption', s.work, secondary);
  rule(s.work, 28, 240, 896);
  [['레퍼런스 01', '영상', '14:02'], ['레퍼런스 02', '영상', '14:01'],
    ['레퍼런스 03', '이미지', '13:58'], ['레퍼런스 04', '문서', '13:52']].forEach(function (row, i) {
    const r = instance(s.work, 'rowResult', 'Row/Result ' + row[0], 28, 252 + i * 72);
    setInstanceText(r, 0, String(i + 1).padStart(2, '0'));
    setInstanceText(r, 1, row[0]);
    setInstanceText(r, 2, row[1]);
    setInstanceText(r, 3, row[2]);
  });
  text('Notice', '출처 메타가 함께 저장돼요. 미디어는 재호스팅하지 않아요.', 28, 568, 850, 22, 'Caption', s.work, secondary);
  dockText(s.dock, '레퍼런스 3개 분석', '저장된 항목의 훅과 메시지를 정리할 수 있어요.', '근거 3개', '선택 항목 3개');

  // S2 스튜디오
  s = shell(page, 'S2 스튜디오', 0, 1020, '스튜디오');
  const gates = ['브리프 완료', '콘셉트 현재', '결과 대기'];
  gates.forEach(function (label, i) {
    const g = instance(s.work, 'gate', 'Gate/' + i, 28 + i * 300, 24);
    setInstanceText(g, 0, label);
    if (i !== 1) {
      const t = g.children.filter(function (n) { return n.type === 'TEXT'; })[0];
      if (t) {
        t.fills = fillOf(state.vars.semantic['text/secondary']);
        bindFill(t, state.vars.semantic['text/secondary']);
      }
    }
  });
  text('Page title', '콘셉트 3안 중 하나를 골라 주세요', 28, 96, 700, 34, 'H1', s.work, ink);
  rule(s.work, 28, 144, 896);
  [['안 1', '첫 번째 구성', '선택'], ['안 2', '두 번째 구성', '선택됨'],
    ['안 3', '세 번째 구성', '선택']].forEach(function (row, i) {
    taskRow(s.work, 160 + i * 76, row[0], row[1], row[2]);
    if (i === 1) signalBar(s.work, 28, 160 + i * 76, 64);
  });
  instance(s.work, 'action', 'Action/이걸로 결과 만들기', 28, 408);
  dockText(s.dock, '결과 4장 만들기', '선택한 콘셉트로 카피와 이미지 초안을 만들어요.', '예상 2분', '레퍼런스 3개');

  // S3 영상 워크벤치
  s = shell(page, 'S3 영상 워크벤치', 1560, 1020, '영상 워크벤치');
  text('Page title', '어떤 장면이 필요해요?', 28, 24, 700, 34, 'H1', s.work, ink);
  instance(s.work, 'textarea', 'Textarea/자연어 요청', 28, 76);
  // 업종·상황 예시는 화면에 넣지 않습니다. 입력 필드의 라벨만 유지합니다.
  instance(s.work, 'quiet', 'Quiet/해석해 보기', 28, 196);
  rule(s.work, 28, 252, 896);
  text('Interpret title', '이렇게 이해했어요. 맞나요?', 28, 272, 580, 30, 'H2', s.work, ink);
  stampAt(s.work, '검증 필요 1건', 700, 274);
  ['원문', '표준용어', '근거 등급', '신뢰도'].forEach(function (label, i) {
    text('Th/' + label, label, 28 + i * 216, 322, 200, 22, 'Caption', s.work, secondary);
  });
  rule(s.work, 28, 350, 896);
  [['요청 01', '표준 용어 01', 'KB A', '높음'],
    ['요청 02', '표준 용어 02', 'KB B', '높음'],
    ['요청 03', '표준 용어 03', 'KB C', '확인 필요']].forEach(function (row, i) {
    taskRow(s.work, 360 + i * 56, row[0], row[1] + '  ' + row[2], row[3]);
  });
  const vg = ['G1 콘티 완료', 'G2 구도 현재', 'G3 애니매틱', 'G4 렌더 시연'];
  vg.forEach(function (label, i) {
    const g = instance(s.work, 'gate', 'Gate/' + i, 28 + i * 224, 560);
    setInstanceText(g, 0, label);
    if (i !== 1) {
      const t = g.children.filter(function (n) { return n.type === 'TEXT'; })[0];
      if (t) {
        t.fills = fillOf(state.vars.semantic['text/secondary']);
        bindFill(t, state.vars.semantic['text/secondary']);
      }
    }
  });
  const preview = frame('Preview/구도', 28, 616, 520, 148, state.vars.semantic['text/primary'], s.work);
  text('Preview hint', '구도 와이어프레임', 24, 60, 300, 24, 'Body', preview, state.vars.semantic['bg/base']);
  text('Cost', '예상 2분, 시연', 572, 620, 300, 24, 'Caption', s.work, secondary);
  text('Cost detail', '실제 렌더 없음', 572, 648, 300, 20, 'Caption', s.work, secondary);
  instance(s.work, 'action', 'Action/다음 단계 진행', 572, 684);
  text('Shots', '샷 01    샷 02(선택)    샷 03        이 샷만 수정', 28, 784, 850, 20, 'Caption', s.work, signal);
  dockText(s.dock, 'G2 구도 확인', '콘티가 확정됐어요. 구도를 먼저 확인합니다.', '예상 2분', '게이트 1 승인');

  // S4 발행
  s = shell(page, 'S4 발행', 0, 2040, '발행');
  const pubNotice = instance(s.work, 'notice', 'Notice/시연', 28, 24);
  setInstanceText(pubNotice, 0, '시연 화면입니다. 실제 발행은 일어나지 않아요.');
  text('Page title', '승인된 결과를 어디에 낼까요?', 28, 88, 700, 34, 'H1', s.work, ink);
  rule(s.work, 28, 136, 896);
  [['채널 A', '연결됨'], ['채널 B', '연결됨'], ['채널 C', '연동 대기'], ['채널 D', '연동 대기']].forEach(function (row, i) {
    taskRow(s.work, 152 + i * 64, row[0], row[1], '');
  });
  section(s.work, '이번 주 예약', 424);
  ['월', '화', '수', '목', '금', '토', '일'].forEach(function (day, i) {
    text('Day/' + day, day, 28 + i * 128, 476, 100, 22, 'Caption', s.work, secondary);
    rule(s.work, 28 + i * 128, 506, 112);
    if (day === '수') text('Slot', '예약 1건', 28 + i * 128, 522, 112, 22, 'Body', s.work, signal);
  });
  instance(s.work, 'action', 'Action/승인하고 큐에 넣기', 28, 588);
  dockText(s.dock, '승인 완료 2개', '검수가 끝난 결과가 큐에 들어갈 준비가 됐어요.', '근거 14:01', '검수 승인 이력');

  // S5 성과
  s = shell(page, 'S5 성과', 1560, 2040, '성과');
  textTabs(s.work, ['성과', '예측', '오디언스'], 0, 24);
  text('Page title', '성과와 예측을 한눈에', 28, 88, 700, 34, 'H1', s.work, ink);
  text('Drop', 'CSV를 올리거나 샘플로 둘러보세요', 28, 140, 560, 24, 'Body', s.work, ink);
  rule(s.work, 28, 176, 896);
  instance(s.work, 'quiet', 'Quiet/샘플로 보기', 740, 136);
  [['124,800', '노출'], ['3,210', '클릭'], ['2.57%', 'CTR'], ['84', '전환']].forEach(function (m, i) {
    text('Metric/' + i, m[0], 28 + i * 224, 208, 200, 44, 'Stamp', s.work, signal);
    text('Metric label/' + i, m[1], 28 + i * 224, 256, 200, 20, 'Caption', s.work, secondary);
  });
  rule(s.work, 28, 292, 896);
  text('Chart note', '실적은 실선, 예측은 점선', 28, 312, 500, 22, 'Caption', s.work, secondary);
  rectangle('Chart baseline', 28, 460, 896, 1, state.vars.semantic['border/rule'], s.work);
  text('Forecast', '예측입니다. 신뢰도 보통. 이동평균 기준 6개월.', 28, 488, 800, 24, 'Caption', s.work, secondary);
  instance(s.work, 'action', 'Action/개선안 브리프로 보내기', 28, 540);
  dockText(s.dock, 'Top 콘텐츠 5건', '성과와 개선안이 준비됐어요.', '6개월 기준', '업로드 또는 샘플');

  // S6 성장
  s = shell(page, 'S6 성장', 0, 3060, '성장');
  textTabs(s.work, ['진단', '키워드와 콘텐츠', '예산과 예측', '취합과 개선'], 0, 24);
  text('Page title', '고쳐 쓸 수 있는 제목 3건', 28, 88, 700, 34, 'H1', s.work, ink);
  [['원문 01', '제안 01'],
    ['원문 02', '제안 02'],
    ['원문 03', '제안 03']].forEach(function (row, i) {
    const y = 140 + i * 92;
    text('Original/' + i, '원문 보존  ' + row[0], 28, y, 500, 22, 'Caption', s.work, secondary);
    text('Suggestion/' + i, '제안  ' + row[1], 28, y + 28, 800, 24, 'Body', s.work, ink);
    rule(s.work, 28, y + 64, 896);
  });
  text('Forecast', '예측입니다. 신뢰도 보통. 룰 기반. 시연.', 28, 444, 800, 24, 'Caption', s.work, secondary);
  instance(s.work, 'action', 'Action/개선안 브리프로 보내기', 28, 496);
  dockText(s.dock, '개선안 3건', '원문은 보존되고 제안만 표시돼요.', '순위 보장 0건', '공개 가이드와 수동 입력');

  // S7 설정
  s = shell(page, 'S7 설정', 1560, 3060, '설정');
  text('Page title', '연결과 비용 한도', 28, 24, 700, 34, 'H1', s.work, ink);
  section(s.work, '연결 상태', 80);
  settingRow(s.work, 126, '로컬 AI', '연결됨, qwen');
  settingRow(s.work, 190, '계정 연동', '연결 안 함, 직접 로그인');
  settingRow(s.work, 254, '모듈 링크', '3개, 모두 클릭으로 생성');
  section(s.work, '비용', 350);
  text('Limits', '단일 승인 한도 10,000원    월 100,000원    기본 상한 0원', 28, 400, 850, 24, 'Body', s.work, ink);
  text('Guide', '실제 비용이 발생하는 동작은 매번 확인을 받아요.', 28, 436, 850, 22, 'Caption', s.work, secondary);
  instance(s.work, 'action', 'Action/한도 저장', 28, 484);
  dockText(s.dock, '연결 확인', '계정 로그인은 소유자가 직접 합니다.', '기본 상한 0원', '비용 승인 정책');

  buildMobile(page);
  buildStatesAndFlows(page);
  log('화면', '데스크톱 8장, 모바일 2장, 상태와 흐름 보드 생성');
}

function buildMobile(page) {
  const paper = state.vars.semantic['bg/base'];
  const ink = state.vars.semantic['text/primary'];
  const secondary = state.vars.semantic['text/secondary'];
  const signal = state.vars.semantic['signal/action'];

  const m1 = frame('M1 홈 (390×844)', 3120, 0, 390, 844, paper, page, true);
  rule(m1, 0, 55, 390);
  text('Project', '워크스페이스', 20, 16, 240, 24, 'Body', m1, ink);
  text('Search', '검색', 330, 16, 44, 22, 'Caption', m1, secondary);
  text('Now', '지금 할 일', 20, 84, 200, 20, 'Caption', m1, secondary);
  rule(m1, 20, 112, 350);
  text('Next', '수집 결과 확인', 20, 128, 240, 28, 'H2', m1, ink);
  instance(m1, 'action', 'Action/결과 확인', 210, 122);
  text('Next body', '키워드 3개의 결과가 모였어요.', 20, 164, 340, 22, 'Body', m1, secondary);
  rule(m1, 20, 200, 350);
  [['수집', '진행 중'], ['스튜디오', '검수 대기'], ['영상', '승인 대기']].forEach(function (row, i) {
    const y = 216 + i * 84;
    text('Task/' + i, row[0], 20, y, 240, 24, 'Body', m1, ink);
    text('Meta/' + i, row[1], 20, y + 28, 240, 20, 'Caption', m1, secondary);
    rule(m1, 20, y + 60, 350);
  });
  rule(m1, 0, 780, 390);
  ['홈', '살펴보기', '만들기', '발행', '성과'].forEach(function (label, i) {
    text('Tab/' + label, label, 12 + i * 76, 798, 72, 20, 'Caption', m1, i === 0 ? signal : secondary);
  });

  const m2 = frame('M2 스튜디오 (390×844)', 3120, 964, 390, 844, paper, page, true);
  rule(m2, 0, 55, 390);
  text('Title', '콘셉트 3안', 20, 16, 240, 24, 'H2', m2, ink);
  ['브리프 완료', '콘셉트 현재', '결과 대기'].forEach(function (label, i) {
    text('Gate/' + i, label, 20 + i * 124, 80, 120, 20, 'Caption', m2, i === 1 ? signal : secondary);
  });
  rule(m2, 20, 112, 350);
  ['첫 번째 구성', '두 번째 구성', '세 번째 구성'].forEach(function (label, i) {
    const y = 132 + i * 112;
    text('Concept/' + i, label, 20, y, 340, 24, i === 1 ? 'H2' : 'Body', m2, i === 1 ? signal : ink);
    text('Hint/' + i, i === 1 ? '선택됨' : '선택하고 결과 만들기', 20, y + 32, 340, 20, 'Caption', m2, secondary);
    rule(m2, 20, y + 72, 350);
  });
  rule(m2, 0, 770, 390);
  instance(m2, 'action', 'Action/결과 만들기', 20, 790);

  log('모바일', 'M1 홈, M2 스튜디오 생성');
}

function buildStatesAndFlows(page) {
  const board = frame('상태 4종 + 흐름 3개', 0, 4200, 2000, 560, state.vars.semantic['bg/base'], page);
  text('Board title', '상태와 흐름', 28, 24, 400, 34, 'H1', board, state.vars.semantic['text/primary']);
  rule(board, 28, 68, 1944);
  const states = [
    ['Empty', '아직 모은 콘텐츠가 없어요', '키워드를 등록해 주세요.'],
    ['Loading', '진행 숫자와 2px 선', '숫자와 2px 선으로 표시'],
    ['Partial', '3개 중 1개 실패', '성공한 3개는 그대로 둘게요.'],
    ['Error', '로컬 AI 연결 실패', '서버를 켠 뒤 다시 시도해 주세요.']
  ];
  states.forEach(function (item, i) {
    const y = 96 + i * 76;
    text('State/' + item[0], item[0], 28, y, 180, 22, 'Caption', board, state.vars.semantic['signal/action']);
    text('State title/' + i, item[1], 220, y - 4, 520, 26, 'Body', board, state.vars.semantic['text/primary']);
    text('State hint/' + i, item[2], 760, y - 4, 600, 26, 'Caption', board, state.vars.semantic['text/secondary']);
    rule(board, 28, y + 40, 1372);
  });
  const flows = [
    ['F1 첫 캠페인', '홈 → 수집 → 스튜디오 → 발행(시연) → 성과 → 브리프'],
    ['F2 영상 요청', '문장 입력 → 해석 확정 → G1 → G2 → G3 → G4 → 검수'],
    ['F3 독립 진입', '우리 콘텐츠 또는 예측 또는 SEO → 클릭 → 스튜디오']
  ];
  text('Flows title', '흐름', 1460, 96, 200, 26, 'H2', board, state.vars.semantic['text/primary']);
  flows.forEach(function (item, i) {
    const y = 144 + i * 112;
    text('Flow title/' + i, item[0], 1460, y, 500, 24, 'Body', board, state.vars.semantic['text/primary']);
    text('Flow path/' + i, item[1], 1460, y + 32, 500, 40, 'Caption', board, state.vars.semantic['text/secondary']);
    rule(board, 1460, y + 84, 500);
  });
}

/* ------------------------------ 5. handoff -------------------------------- */

function buildHandoff(page) {
  const b = frame('Handoff · AIMW v3.1', 0, 0, 1440, 1480, state.vars.semantic['bg/base'], page);
  const ink = state.vars.semantic['text/primary'];
  const secondary = state.vars.semantic['text/secondary'];
  const signal = state.vars.semantic['signal/action'];

  text('Title', 'AIMW Design v3.1 — The Work Order', 32, 28, 1000, 44, 'Display', b, ink);
  text('Intro', '방향은 design-v3/00~06 문서가 정합니다. 이 보드는 토큰과 구현 매핑만 정리합니다.', 32, 84, 1200, 26, 'Body', b, secondary);
  rule(b, 32, 124, 1376);

  text('H1', '토큰', 32, 152, 300, 34, 'H1', b, ink);
  text('Tokens', 'Primitive 7개(색 3개 + 명도 파생 4개), Semantic 8개, 간격 8개, 반경 2개, 텍스트 6종', 32, 196, 1200, 26, 'Body', b, secondary);
  text('Rule', '하드코딩 hex 0개. 모든 fill은 변수에 바인딩.', 32, 228, 900, 26, 'Body', b, signal);

  text('H2a', 'CSS 매핑', 32, 288, 300, 34, 'H1', b, ink);
  const mappings = [
    'paper → --color-paper', 'ink → --color-ink', 'signal → --color-signal',
    'ink/70 → --color-ink-70', 'ink/20 → --color-rule', 'paper/alt → --color-paper-alt',
    'spacing → --space-1 ~ --space-8', 'radius → --radius-none / --radius-tight',
    'sans → --font-sans', 'stamp → --font-stamp'
  ];
  mappings.forEach(function (line, i) {
    text('Map/' + i, line, 32 + (i % 2) * 660, 338 + Math.floor(i / 2) * 30, 620, 24, 'Body', b, ink);
  });

  text('H2b', '컴포넌트 16종', 32, 530, 400, 34, 'H1', b, ink);
  text('Components', 'Button 2 · Input 3 · Row 3 · Stamp · Gate · Progress · Tab · Dock · Notice · Dialog · Switch', 32, 574, 1300, 26, 'Body', b, secondary);
  text('No cards', '카드, 배지 알약, 그림자, 그라데이션, 점 그리드는 만들지 않습니다.', 32, 608, 1200, 24, 'Body', b, signal);

  text('H2c', '접근성', 32, 668, 300, 34, 'H1', b, ink);
  [
    '본문 대비 4.5:1 이상, signal 4.77:1',
    'focus-visible 2px signal 링',
    '최소 클릭 영역 40×40',
    '상태는 텍스트와 선으로 전달',
    '가로 스크롤 0',
    'prefers-reduced-motion 존중'
  ].forEach(function (line, i) {
    text('A11y/' + i, line, 32 + (i % 2) * 660, 714 + Math.floor(i / 2) * 30, 620, 24, 'Body', b, ink);
  });

  text('H2d', '열린 이슈', 32, 844, 300, 34, 'H1', b, ink);
  [
    'Pretendard와 나눔명조 미설치 시 폰트 폴백 보고',
    'Figma Starter 페이지 수 한도 3개',
    '썸네일 실 미디어 미저장, 텍스트 플레이스홀더 사용',
    '인터랙션 프로토타입 링크는 사람이 연결',
    '숫자 검증과 별개로 육안 게이트가 최종'
  ].forEach(function (line, i) {
    text('Issue/' + i, line, 32, 890 + i * 30, 1300, 24, 'Body', b, secondary);
  });

  rule(b, 32, 1080, 1376);
  text('Footer', '생성 시각: ' + new Date().toLocaleString('ko-KR'), 32, 1104, 700, 22, 'Caption', b, secondary);
  log('핸드오프', '토큰, CSS 매핑, 컴포넌트, 접근성, 열린 이슈 1장');
}

/* ------------------------------ 6. audit ---------------------------------- */

function walk(node, visitor) {
  visitor(node);
  if ('children' in node) {
    for (let i = 0; i < node.children.length; i++) walk(node.children[i], visitor);
  }
}

function auditScreens(pages) {
  const result = [];
  const screensPage = pages.screens;

  Object.keys(pages).forEach(function (key) {
    pages[key].children.forEach(function (node) {
      if (node.type !== 'FRAME' || !/^S\d|^M\d/.test(node.name)) return;
      const fb = node.absoluteBoundingBox;
      let overflow = 0;
      node.children.forEach(function (child) {
        const cb = child.absoluteBoundingBox;
        if (!cb || !fb) return;
        if (cb.x < fb.x - 1 || cb.y < fb.y - 1 ||
            cb.x + cb.width > fb.x + fb.width + 1 ||
            cb.y + cb.height > fb.y + fb.height + 1) overflow++;
      });
      let actions = 0;
      walk(node, function (n) {
        if (n.name && n.name.indexOf('Action/') === 0) actions++;
      });
      result.push({ name: node.name, overflow: overflow, actions: actions });
      if (overflow > 0) state.report.overflow.push(node.name + ' (' + overflow + ')');
      if (actions !== 1) state.report.primaryActions.push(node.name + ' (' + actions + ')');
    });
  });

  if (screensPage) {
    walk(screensPage, function (n) {
      if (n.type !== 'TEXT' || !n.characters) return;
      if (/Swatch/.test(n.name)) return;
      if (/#[0-9A-Fa-f]{6}/.test(n.characters)) state.report.hardcodedHex++;
    });
  }

  log('수치 검증', '화면 ' + result.length + '장, 넘침 ' + state.report.overflow.length +
    ', 주 액션 이상 ' + state.report.primaryActions.length + ', 하드코딩 hex ' + state.report.hardcodedHex);
  return result;
}

/* ------------------------------ 7. runner --------------------------------- */

async function generate() {
  state.report = {
    steps: [], warnings: [], overflow: [], fonts: {},
    unbound: 0, hardcodedHex: 0, primaryActions: []
  };
  log('시작', '3색 작업 지시서 디자인을 문서값 그대로 생성합니다');

  await probeFonts();

  state.pages.system = await ensurePage('01 Design System');
  await buildTokens();
  await buildTextStyles();
  foundationBoards(state.pages.system);
  buildComponents(state.pages.system);

  state.pages.screens = await ensurePage('02 Screens');
  buildScreens(state.pages.screens);

  state.pages.handoff = await ensurePage('03 Handoff');
  buildHandoff(state.pages.handoff);

  const audit = auditScreens(state.pages);

  post('done', {
    report: state.report,
    audit: audit,
    fileUrl: figma.fileKey ? 'https://www.figma.com/file/' + figma.fileKey : null
  });
}

figma.showUI(__html__, { width: 480, height: 660 });

figma.ui.onmessage = async function (msg) {
  if (msg.type === 'generate') {
    try {
      await generate();
    } catch (error) {
      post('error', { text: (error && error.message) || String(error) });
    }
  }
  if (msg.type === 'close') figma.closePlugin();
};
