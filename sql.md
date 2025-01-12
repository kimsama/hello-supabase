
## Create Table

1) Supabase의 SQL 편집기를 통해 테이블을 생성한 후, Node.js에서는 데이터 조작만 한다. 
2) 먼저, SQL로 다음의 테이블을 생성. 

```sql
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, now()) NOT NULL
);
```



