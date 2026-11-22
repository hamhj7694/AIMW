export type CommandResult = {
  route: string
  params: Record<string, string>
  actionLabel: string
  reply: string
}

function secondsToTimecode(value: number) {
  const safe = Math.max(0, Math.round(value * 1000) / 1000)
  const minutes = Math.floor(safe / 60)
  const seconds = Math.floor(safe % 60)
  const millis = Math.round((safe % 1) * 1000)
  const pad = (n: number, width = 2) => String(n).padStart(width, '0')
  return `00:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
}

function pickSeconds(text: string) {
  const matches = [...text.matchAll(/(\d+(?:\.\d+)?)\s*초/g)].map((m) => Number(m[1]))
  if (matches.length >= 2) return { start: matches[0], end: matches[1] }
  if (matches.length === 1) return { start: Math.max(0, matches[0] - 2), end: matches[0] + 2 }
  return { start: 2, end: 4 }
}

function pickShot(text: string) {
  const match = text.match(/SH[-\s]?(\d+)/i)
  if (!match) return null
  return `SH-${match[1].padStart(2, '0')}`
}

function makeReply(actionLabel: string) {
  return `${actionLabel} 화면으로 이동하고 요청 내용만 미리 채웠어요. 실제 생성·집행은 없으며 사용자가 확인한 뒤 진행합니다.`
}

export function parseCommand(raw: string): CommandResult {
  const text = raw.trim()

  if (!text) {
    return {
      route: '/s0',
      params: {},
      actionLabel: '수집함',
      reply: '요청을 입력해 주세요. 아래 예시를 눌러도 시작할 수 있어요.',
    }
  }

  if (/영상|숏폼|콘티|샷|타임코드|자막|게이트|렌더/.test(text)) {
    const { start, end } = pickSeconds(text)
    const shot = pickShot(text)
    const scope = /전체 영상|전체\b/.test(text) ? 'whole' : /콘티|프레임|이미지|샷/.test(text) ? 'frame' : 'segment'
    const params: Record<string, string> = {
      tab: 'revision',
      scope,
      start: String(start),
      end: String(end),
      request: text,
    }
    if (shot) params.shot = shot
    return {
      route: '/s8',
      params,
      actionLabel: scope === 'whole' ? '영상 전체 검토' : scope === 'frame' ? '프레임·콘티 지정' : '영상 구간 지정',
      reply: `${scope === 'whole' ? '전체 영상' : `${secondsToTimecode(start)} ~ ${secondsToTimecode(end)} 구간`}을 선택한 상태로 영상 워크벤치를 열었어요. ${makeReply('영상 수정')}`,
    }
  }

  if (/글|문장|문단|카피|브리프|블로그|맞춤법|다시 써|수정해/.test(text)) {
    const selection = /첫 문단|도입부|처음/.test(text)
      ? '첫 문단'
      : /마지막|마무리/.test(text)
        ? '마지막 문단'
        : '선택 구간'
    return {
      route: '/s2',
      params: { tab: 'F4', selection, request: text },
      actionLabel: '글 부분 수정',
      reply: `${selection}을 선택한 상태로 글쓰기 데스크를 열었어요. 원고에서 드래그하거나 아래 셀을 눌러 범위를 바꿀 수 있어요. ${makeReply('글 수정')}`,
    }
  }

  if (/발행|예약|게시|드라이런|dry.?run/i.test(text)) {
    return { route: '/s3', params: {}, actionLabel: '발행 스케줄러', reply: makeReply('발행') }
  }
  if (/수집|자료|키워드 등록|공개 범위/.test(text)) {
    return { route: '/s0', params: {}, actionLabel: '공개 자료 수집함', reply: makeReply('수집') }
  }
  if (/검색|seo|키워드 갭|예산|시뮬레이션|순위/i.test(text)) {
    return { route: '/s9', params: { tab: /예산|시뮬레이션/.test(text) ? 'budget' : 'diagnosis', request: text }, actionLabel: '검색 성장 콘솔', reply: makeReply('검색·예산') }
  }
  if (/콘텐츠|자산|이미지 생성|라이브러리/.test(text)) {
    return { route: '/s5', params: {}, actionLabel: '콘텐츠 라이브러리', reply: makeReply('콘텐츠') }
  }
  if (/세그먼트|오디언스|관심군/.test(text)) {
    return { route: '/s7', params: {}, actionLabel: '세그먼트 빌더', reply: makeReply('세그먼트') }
  }
  if (/예측|성과|신뢰도/.test(text)) {
    return { route: '/s6', params: {}, actionLabel: '예측 대시보드', reply: makeReply('예측') }
  }
  if (/레퍼런스|경쟁사|유사도/.test(text)) {
    return { route: '/s1', params: {}, actionLabel: '레퍼런스 보드', reply: makeReply('레퍼런스') }
  }
  if (/리포트|지표|개선안/.test(text)) {
    return { route: '/s4', params: {}, actionLabel: '성과 리포트', reply: makeReply('리포트') }
  }

  return {
    route: '/s0',
    params: { request: text },
    actionLabel: '수집함',
    reply: '어떤 작업인지 바로 판단하지 못했어요. 수집함으로 이동했으니 아래 예시 문장을 눌러 다시 요청해 주세요.',
  }
}
