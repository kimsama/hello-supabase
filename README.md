# Coolify에서 Supabase 설치 및 Node.js 앱 연동 가이드

## 1. Supabase 키 설명

Supabase를 설치하면 다음과 같은 주요 키들이 생성됩니다:

### API Keys
- `ANON_KEY` (공개 키)
  - 클라이언트 사이드에서 사용
  - 제한된 권한을 가진 공개 액세스용 키
  
- `SERVICE_ROLE_KEY` (서비스 키)
  - 서버 사이드에서 사용
  - 관리자 권한을 가진 비공개 키
  - 절대 공개되어서는 안 됨

### 기타 중요 키
- `JWT_SECRET` / `SERVICE_PASSWORD_JWT`
  - JWT 토큰 생성 및 검증에 사용
  - 인증 서비스에서 사용하는 비밀 키

## 2. Coolify에서 Supabase URL과 Service Key 찾기

### Docker 컨테이너 확인
먼저 실행 중인 Supabase 관련 컨테이너들을 확인합니다:
```bash
docker ps | grep supabase
```

예시 출력:
```
58f0e96b81ba   supabase/storage-api:v1.10.1        "docker-entrypoint.s…"   22 hours ago   Up 22 hours (healthy)   5000/tcp                                    supabase-storage-xxx
3e7df72443fa   kong:2.8.1                          "bash -c 'eval \"echo…"   22 hours ago   Up 22 hours (healthy)   8000-8001/tcp, 8443-8444/tcp               supabase-kong-xxx
e37ff7c117d0   supabase/studio:20240923-2e3e90c    "docker-entrypoint.s…"   22 hours ago   Up 22 hours (healthy)   3000/tcp                                    supabase-studio-xxx
...
```

위 출력에서 다음 컨테이너 ID를 찾습니다:
- Kong 컨테이너 ID (예: 3e7df72443fa)
- Studio 컨테이너 ID (예: e37ff7c117d0)

### Kong 컨테이너에서 확인
```bash
docker inspect [kong-container-id] | grep -A 10 Env
```
예시 출력:
```
"Env": [
  "SUPABASE_ANON_KEY=eyJ0eX...",
  "SERVICE_SUPABASEANON_KEY=eyJ0eX...",
  "COOLIFY_FQDN=supabase.yourdomain.com",
  ...
]
```

### Studio 컨테이너에서 확인
```bash
docker inspect [studio-container-id] | grep -A 10 Env
```
예시 출력:
```
"Env": [
  "SERVICE_SUPABASESERVICE_KEY=eyJ0eX...",
  "SERVICE_SUPABASEANON_KEY=eyJ0eX...",
  ...
]
```

찾아야 할 정보:
1. SUPABASE_URL: `https://supabase.yourdomain.com` 형식
2. SERVICE_SUPABASESERVICE_KEY: `eyJ0eX...` 형식의 긴 문자열

## 3. Node.js 앱 작성하기

### 프로젝트 초기화
```bash
mkdir hello-supabase
cd hello-supabase
npm init -y
npm install @supabase/supabase-js dotenv
```

### 환경 변수 설정
`.env` 파일 생성:
```env
SUPABASE_URL=https://supabase.yourdomain.com
SERVICE_SUPABASESERVICE_KEY=your-service-key
```

### 테이블 생성

#### 방법 1: SQL 사용
Supabase Studio의 SQL 편집기에서 다음 SQL 구문을 실행합니다:
```sql
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);
```

#### 방법 2: Table Editor 사용
Supabase Studio의 Table Editor에서 다음과 같이 테이블을 생성합니다:

1. "Table Editor" 메뉴로 이동
2. "New Table" 버튼 클릭
3. 테이블 이름: "users"
4. 컬럼 추가:
   - id: uuid, primary key, default: gen_random_uuid()
   - name: text, not null
   - email: text, not null, unique
   - created_at: timestamptz, not null, default: now()

두 방법 중 어느 것을 사용해도 동일한 결과를 얻을 수 있습니다.

### Node.js 앱 실행

1. `app.js` 파일과 `.env` 파일을 생성합니다. 
   (`app.js` 예제 코드는 [app.js](app.js) 참조)

2. package.json 설정:
   ```bash
   npm init -y
   ```
   
   package.json에 다음 내용 추가:
   ```json
   {
     "type": "module"
   }
   ```

3. 필요한 패키지 설치:
   ```bash
   npm install @supabase/supabase-js dotenv
   ```

4. 앱 실행:
   ```bash
   npm start
   ```

## 주의사항
1. `.env` 파일을 `.gitignore`에 추가하여 보안 키가 노출되지 않도록 합니다.
2. `SERVICE_ROLE_KEY`는 서버 사이드에서만 사용해야 합니다.
3. 클라이언트 사이드에서는 `ANON_KEY`를 사용해야 합니다.
4. 실제 프로덕션 환경에서는 적절한 보안 설정을 추가해야 합니다.