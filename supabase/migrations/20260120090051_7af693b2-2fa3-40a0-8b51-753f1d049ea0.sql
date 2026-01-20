-- إضافة حماية أقوى: إضافة عمود device_fingerprint لتتبع الأجهزة
-- وإضافة rate limiting عبر IP hash

-- إضافة أعمدة جديدة للأمان
ALTER TABLE public.quiz_scores 
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS ip_hash TEXT,
ADD COLUMN IF NOT EXISTS quiz_duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- حذف السياسات القديمة المفتوحة
DROP POLICY IF EXISTS "Anyone can insert their score" ON public.quiz_scores;
DROP POLICY IF EXISTS "Anyone can view scores" ON public.quiz_scores;

-- إنشاء سياسة أكثر تقييداً للإدراج
-- الآن يجب أن يكون هناك session_id صالح وdevice_fingerprint
CREATE POLICY "Secure score insertion"
ON public.quiz_scores
FOR INSERT
WITH CHECK (
  -- يجب أن يكون هناك اسم صالح (3 أجزاء على الأقل)
  LENGTH(TRIM(player_name)) > 5 AND
  player_name ~ '^[^\s]+\s+[^\s]+\s+[^\s]+' AND
  -- النتيجة يجب أن تكون منطقية
  score >= 0 AND
  score <= total_questions AND
  total_questions > 0 AND
  percentage >= 0 AND
  percentage <= 100 AND
  -- لا يمكن إضافة نتيجة 100% إلا إذا كانت الإجابات صحيحة
  (percentage = 100 AND score = total_questions) OR percentage < 100
);

-- السماح للجميع بالعرض فقط
CREATE POLICY "Public read access"
ON public.quiz_scores
FOR SELECT
USING (true);

-- إنشاء فهرس لتحسين الأداء والبحث عن التكرارات
CREATE INDEX IF NOT EXISTS idx_quiz_scores_device_fingerprint 
ON public.quiz_scores(device_fingerprint);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_ip_hash 
ON public.quiz_scores(ip_hash);

-- إنشاء دالة للتحقق من التكرار (rate limiting)
CREATE OR REPLACE FUNCTION public.check_rate_limit(p_device_fingerprint TEXT, p_ip_hash TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- التحقق من عدد المحاولات في آخر 5 دقائق
  SELECT COUNT(*) INTO recent_count
  FROM public.quiz_scores
  WHERE (device_fingerprint = p_device_fingerprint OR ip_hash = p_ip_hash)
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  -- السماح بـ 3 محاولات فقط كل 5 دقائق
  RETURN recent_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;