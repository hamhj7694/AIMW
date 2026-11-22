import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseCommand } from '../app/command'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  actionLabel?: string
  route?: string
  search?: string
}

const moduleContext: Record<string, { label: string; examples: string[] }> = {
  '/s0': { label: '공개 자료 수집', examples: ['공개 범위 자료 모아줘', '영상 광고 레퍼런스 수집해줘', '블로그 콘텐츠 후보 찾아줘'] },
  '/s1': { label: '레퍼런스 탐색', examples: ['비슷한 레퍼런스 정리해줘', '경쟁사 콘텐츠 비교해줘'] },
  '/s2': { label: '글쓰기 데스크', examples: ['블로그 첫 문단 다시 써줘', '마지막 문단 맞춤법 봐줘', '카피 변형 후보 보여줘'] },
  '/s3': { label: '발행 스케줄러', examples: ['이 콘텐츠 드라이런 예약해줘', '다음 주 발행 슬롯 보여줘'] },
  '/s4': { label: '성과 리포트', examples: ['지표 요약과 개선안 보여줘'] },
  '/s5': { label: '콘텐츠 라이브러리', examples: ['우리 자산 라이브러리 열어줘'] },
  '/s6': { label: '예측 대시보드', examples: ['이동평균 예측 보여줘'] },
  '/s7': { label: '세그먼트 빌더', examples: ['관심군 세그먼트 만들어줘'] },
  '/s8': { label: '영상 워크벤치', examples: ['영상 2초부터 4초까지 자막 고쳐줘', 'SH-02 프레임 콘티 수정 요청', '전체 영상 검토 요청'] },
  '/s9': { label: '검색 성장 콘솔', examples: ['예산 10만원 시뮬레이션', '서비스 비용 비교 키워드 갭 보여줘'] },
}

const defaultContext = {
  label: '전체 작업',
  examples: ['영상 2초부터 4초까지 자막 고쳐줘', 'SH-02 프레임 콘티 수정 요청', '블로그 첫 문단 다시 써줘', '예산 10만원 시뮬레이션'],
}

export function CommandDock() {
  const navigate = useNavigate()
  const location = useLocation()
  const context = moduleContext[location.pathname] ?? defaultContext
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: '하고 싶은 작업을 문장으로 말해 주세요. 이동할 화면과 선택 값을 미리 준비해 드려요. 예시를 누르면 입력창에만 채워지며, 요청하기를 누르기 전에는 아무 일도 일어나지 않습니다.',
    },
  ])

  function send(raw: string) {
    const text = raw.trim()
    if (!text) return
    const result = parseCommand(text)
    const search = new URLSearchParams(result.params).toString()
    const base = Date.now()

    setMessages((previous) => [
      ...previous,
      { id: base, role: 'user', text },
      {
        id: base + 1,
        role: 'assistant',
        text: result.reply,
        actionLabel: result.actionLabel,
        route: result.route,
        search,
      },
    ])
    setValue('')
    setOpen(true)
    navigate({ pathname: result.route, search })
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send(value)
  }

  return (
    <>
      <div className="command-dock">
        <div className="command-dock__lead">
          <strong>무엇을 도와드릴까요?</strong>
          <span>{context.label} / 규칙 기반 안내 / 외부 전송 없음</span>
        </div>
        <form className="command-dock__form" onSubmit={submit}>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={`예: ${context.examples[0]}`}
            aria-label="자연어 작업 요청"
          />
          <button type="submit" className="button button--primary" disabled={!value.trim()}>요청하기</button>
        </form>
        <div className="command-dock__examples">
          {context.examples.map((example) => (
            <button key={example} type="button" onClick={() => setValue(example)} title="입력창에 채우기">
              {example}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <section className="chat-drawer" aria-label="자연어 작업 도우미">
          <div className="chat-drawer__head">
            <div>
              <strong>작업 도우미</strong>
              <span>{context.label} 문맥 / 화면 이동과 선택 값 준비</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="도우미 닫기">닫기</button>
          </div>
          <div className="chat-drawer__log">
            {messages.map((message) => (
              <div key={message.id} className={`chat-msg chat-msg--${message.role}`}>
                <span className="chat-msg__who">{message.role === 'user' ? '나' : '도우미'}</span>
                <p>{message.text}</p>
                {message.actionLabel && message.route && (
                  <button
                    type="button"
                    className="chat-msg__action"
                    onClick={() => navigate({ pathname: message.route!, search: message.search })}
                  >
                    {message.actionLabel} 다시 열기
                  </button>
                )}
              </div>
            ))}
          </div>
          <form className="chat-drawer__form" onSubmit={submit}>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="문장으로 요청해 주세요"
              aria-label="도우미 대화 입력"
            />
            <button type="submit" className="button button--primary" disabled={!value.trim()}>보내기</button>
          </form>
          <p className="chat-drawer__foot">예시는 입력창에만 채워집니다. 요청하기를 눌러야 화면이 열립니다. 대화는 저장되지 않습니다.</p>
        </section>
      )}
    </>
  )
}
