import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SERVICE_SUPABASESERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function manipulateData() {
  try {
    // 테스트 데이터 삽입
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: '홍길동',
          email: 'hong@example.com'
        }
      ])
      .select()

    if (insertError) {
      console.error('데이터 삽입 에러:', insertError)
      return
    }

    console.log('테스트 데이터가 삽입되었습니다:', insertData)

    // 데이터 조회
    const { data: selectData, error: selectError } = await supabase
      .from('users')
      .select('*')

    if (selectError) {
      console.error('데이터 조회 에러:', selectError)
      return
    }

    console.log('조회된 데이터:', selectData)

  } catch (error) {
    console.error('전체 실행 에러:', error)
  } finally {
    process.exit(0)
  }
}

// 실행
manipulateData()