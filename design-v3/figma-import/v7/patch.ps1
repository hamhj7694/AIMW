$ErrorActionPreference = 'Stop'
$src = 'C:\Users\Administrator\Documents\Craft Anything\AIMW\design-v3\figma-import\v6\index.html'
$dst = 'C:\Users\Administrator\Documents\Craft Anything\AIMW\design-v3\figma-import\v7\index.html'
New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
$t = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)

$pairs = @(
  @('--faint:#6B7484;', '--faint:#838D9F;'),
  @('.top{height:64px;flex:0 0 64px;background:var(--paper);color:var(--ink);display:flex;align-items:center;padding:0 32px;gap:18px}', '.top{height:64px;flex:0 0 64px;background:var(--paper);color:var(--ink);display:flex;align-items:center;padding:0 32px;gap:16px}'),
  @('.context{height:38px;padding:0 14px;min-width:168px;border:1px solid var(--paperline);background:transparent;color:var(--ink);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:12px}', '.context{height:40px;padding:0 16px;min-width:168px;border:1px solid var(--paperline);background:transparent;color:var(--ink);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:8px}'),
  @('.context i{font-style:normal;color:#6B7280;font-size:11px}', '.context i{font-style:normal;color:#616875;font-size:12px}'),
  @('.railcap{font-size:12px;color:var(--faint);padding:0 10px 12px}', '.railcap{font-size:12px;color:var(--faint);padding:0 12px 16px}'),
  @('.nav{height:40px;display:flex;align-items:center;gap:10px;padding:0 10px;', '.nav{height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;'),
  @('.railnote{margin-top:auto;padding:14px 10px 0;border-top:1px solid var(--line);font-size:11px;line-height:18px;color:var(--faint)}', '.railnote{margin-top:auto;padding:16px 12px 0;border-top:1px solid var(--line);font-size:12px;line-height:20px;color:var(--faint)}'),
  @('.work{flex:1;min-width:0;padding:28px 34px;overflow:hidden}', '.work{flex:1;min-width:0;padding:32px;overflow:hidden}'),
  @('.side{width:276px;flex:0 0 276px;border-left:1px solid var(--line);background:#0E1219;padding:28px 22px}', '.side{width:276px;flex:0 0 276px;border-left:1px solid var(--line);background:#0E1219;padding:32px 24px}'),
  @('.eyebrow{font-size:11px;color:var(--accent);font-weight:800;letter-spacing:2px;margin-bottom:8px}', '.eyebrow{font-size:12px;color:var(--accent);font-weight:800;letter-spacing:1px;margin-bottom:8px}'),
  @('.btnrow{display:flex;gap:10px;margin-top:18px;align-items:center}', '.btnrow{display:flex;gap:8px;margin-top:16px;align-items:center}'),
  @('.btn{height:42px;padding:0 18px;', '.btn{height:42px;padding:0 16px;'),
  @('.linkline{margin-top:22px;border-top:1px solid var(--line)}', '.linkline{margin-top:24px;border-top:1px solid var(--line)}'),
  @('align-items:center;min-height:58px;border-bottom:1px solid var(--line);font-size:13px}', 'align-items:center;min-height:56px;border-bottom:1px solid var(--line);font-size:13px}'),
  @('.tr.head{min-height:38px;color:var(--faint);font-size:11px}', '.tr.head{min-height:40px;color:var(--faint);font-size:12px}'),
  @('.band{margin-top:22px;border:1px solid var(--line);border-left:3px solid var(--accent);background:var(--panel);padding:18px 22px;display:flex;align-items:center;gap:18px}', '.band{margin-top:24px;border:1px solid var(--line);background:var(--panel);padding:16px 24px;display:flex;align-items:center;gap:16px}'),
  @('.band .label{font-size:11px;', '.band .label{font-size:12px;'),
  @('.band .bt{font-size:19px;', '.band .bt{font-size:20px;'),
  @('.band .bd{font-size:12px;', '.band .bd{font-size:13px;'),
  @('.notice{margin-top:18px;border-left:2px solid var(--accent);padding-left:12px;font-size:12px;line-height:19px;color:var(--muted)}', '.notice{margin-top:16px;border-top:1px solid var(--line);padding-top:12px;font-size:13px;line-height:20px;color:var(--muted)}'),
  @('.steps{display:grid;grid-template-columns:repeat(4,1fr);margin-top:20px;', '.steps{display:grid;grid-template-columns:repeat(4,1fr);margin-top:24px;'),
  @('.step{padding:14px 12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);font-size:12px;', '.step{padding:16px 12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);font-size:13px;'),
  @('.step b{display:block;font-size:11px;', '.step b{display:block;font-size:12px;'),
  @('.tabs{display:flex;gap:26px;margin-top:18px;', '.tabs{display:flex;gap:24px;margin-top:24px;'),
  @('.tab{padding:0 0 12px;font-size:13px;', '.tab{padding:0 0 12px;font-size:14px;'),
  @('.field{display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line);font-size:13px}', '.field{display:flex;align-items:center;gap:12px;min-height:56px;border-bottom:1px solid var(--line);font-size:14px}'),
  @('.field label{width:110px;color:var(--muted);font-size:12px}', '.field label{width:110px;color:var(--muted);font-size:13px}'),
  @('height:42px;padding:0 12px;font-size:13px;outline:none}', 'height:42px;padding:0 12px;font-size:14px;outline:none}'),
  @('.textarea{width:100%;height:86px;padding:11px 12px;', '.textarea{width:100%;height:86px;padding:12px;'),
  @('.ev{margin-top:18px;display:flex;gap:24px;font-size:12px;', '.ev{margin-top:16px;display:flex;gap:24px;font-size:13px;'),
  @('grid-template-columns:1.75fr .8fr;min-height:318px}', 'grid-template-columns:1.75fr .8fr;min-height:300px}'),
  @('.heroL{padding:34px 38px}', '.heroL{padding:32px 40px}'),
  @('letter-spacing:-4px;margin-top:14px}', 'letter-spacing:-4px;margin-top:16px}'),
  @('.heroDesc{font-size:15px;color:#B7C0CD;margin-top:14px;', '.heroDesc{font-size:16px;color:#B7C0CD;margin-top:16px;'),
  @('.ai{margin-top:24px;border-top:1px solid var(--line);padding-top:18px}', '.ai{margin-top:24px;border-top:1px solid var(--line);padding-top:16px}'),
  @('.aiRow{display:flex;gap:10px;', '.aiRow{display:flex;gap:8px;'),
  @('.aiNote{margin-top:8px;font-size:11px;', '.aiNote{margin-top:8px;font-size:12px;'),
  @('.heroR{border-left:1px solid var(--line);padding:26px;', '.heroR{border-left:1px solid var(--line);padding:24px;'),
  @('justify-content:space-between;gap:10px;padding:13px 0;border-bottom:1px solid var(--line);font-size:12px;', 'justify-content:space-between;gap:8px;padding:12px 0;border-bottom:1px solid var(--line);font-size:13px;'),
  @('.sideLabel{font-size:11px;', '.sideLabel{font-size:12px;'),
  @('.sideSection{margin-top:28px;padding-top:20px;', '.sideSection{margin-top:24px;padding-top:24px;'),
  @('gap:10px;padding:9px 0;border-bottom:1px solid #202734;font-size:12px;', 'gap:8px;padding:8px 0;border-bottom:1px solid #202734;font-size:13px;'),
  @('justify-content:space-between;padding:0 28px;font-size:11px;', 'justify-content:space-between;padding:0 32px;font-size:12px;'),
  @(':focus-visible{outline:2px solid var(--accent);outline-offset:2px}', ":focus-visible{outline:3px solid var(--accent);outline-offset:2px}`n::placeholder{color:var(--faint);opacity:1}`n.inputlabel{font-size:12px;color:var(--muted);font-weight:700;margin-bottom:8px}"),
  @("<div class=`"ai`">`n              <div class=`"aiRow`">", "<div class=`"ai`">`n              <div class=`"inputlabel`">모델과 요청</div>`n              <div class=`"aiRow`">"),
  @("<div class=`"btnrow`" style=`"margin-top:18px`"><textarea class=`"textarea`"", "<div class=`"inputlabel`">요청 문장</div>`n        <div class=`"btnrow`" style=`"margin-top:8px`"><textarea class=`"textarea`""),
  @("<div class=`"btnrow`"><input class=`"input`" aria-label=`"키워드 또는 도메인`"", "<div class=`"inputlabel`">찾을 내용</div>`n        <div class=`"btnrow`" style=`"margin-top:0`"><input class=`"input`" aria-label=`"키워드 또는 도메인`""),
  @("`n        <div class=`"band`">`n          <div><div class=`"label`">다음 작업</div><div class=`"bt`">수집 결과 확인</div><div class=`"bd`">검토가 끝나면 결과 화면에서 확인할 수 있어요.</div></div>`n          <div class=`"grow`"></div><div class=`"quiet`">작업 열기</div>`n        </div>", "")
)

foreach ($p in $pairs) {
  if (-not $t.Contains($p[0])) { throw "대상 문자열을 찾지 못했습니다: $($p[0])" }
  $t = $t.Replace($p[0], $p[1])
}
[System.IO.File]::WriteAllText($dst, $t, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "wrote $dst"
