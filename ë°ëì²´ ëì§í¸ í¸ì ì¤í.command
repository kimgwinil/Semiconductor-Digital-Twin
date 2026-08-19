#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
APP_URL="http://127.0.0.1:4174/"
RUNTIME_DIR="$PROJECT_DIR/.runtime"
LOG_FILE="$RUNTIME_DIR/semiconductor-digital-twin.log"
PID_FILE="$RUNTIME_DIR/semiconductor-digital-twin.pid"

mkdir -p "$RUNTIME_DIR"
cd "$PROJECT_DIR" || exit 1

if [[ ! -d node_modules ]]; then
  echo "처음 실행을 위한 필수 파일을 설치합니다..."
  npm install || {
    echo "설치에 실패했습니다. 인터넷 연결과 Node.js 설치 상태를 확인하세요."
    read -k 1 "?아무 키나 누르면 닫힙니다."
    exit 1
  }
fi

if curl -fsS "$APP_URL" >/dev/null 2>&1; then
  echo "이미 실행 중인 반도체 디지털 트윈을 엽니다: $APP_URL"
  open "$APP_URL"
  exit 0
fi

echo $$ >"$PID_FILE"
echo "반도체 디지털 트윈 서버를 시작합니다..."
echo "브라우저가 자동으로 열립니다. 종료하려면 이 터미널 창을 닫으세요."

(
  for attempt in {1..80}; do
    if curl -fsS "$APP_URL" >/dev/null 2>&1; then
      open "$APP_URL"
      exit 0
    fi
    sleep 0.25
  done
  echo "서버 시작 시간이 초과되었습니다. 로그를 확인하세요: $LOG_FILE"
) &

exec ./node_modules/.bin/vite --host 127.0.0.1 --port 4174 2>&1 | tee "$LOG_FILE"
