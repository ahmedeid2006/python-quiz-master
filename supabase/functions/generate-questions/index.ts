import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Question {
  id: number;
  question: string;
  type: "mcq" | "complete" | "truefalse";
  choices: string[];
  correctAnswer: number;
  explanation: string;
  code?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { count = 5, difficulty = "mixed" } = await req.json();
    
    console.log(`Generating ${count} questions with difficulty: ${difficulty}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `أنت مدرس Python متخصص. أنشئ أسئلة اختبار Python دقيقة وصحيحة علمياً.

قواعد صارمة:
1. كل سؤال يجب أن يكون صحيحاً علمياً 100%
2. الإجابة الصحيحة يجب أن تكون واضحة وغير قابلة للجدل
3. الأكواد يجب أن تكون صالحة للتشغيل
4. الشروحات يجب أن تكون مختصرة ومفيدة
5. استخدم العربية للأسئلة والإنجليزية للأكواد

أنواع الأسئلة:
- mcq: اختيار من متعدد
- complete: أكمل الفراغ
- truefalse: صح أو خطأ

المواضيع المسموحة:
- المتغيرات والأنواع
- الحلقات (for, while)
- الشروط (if, elif, else)
- الدوال والـ lambda
- القوائم والـ tuples والـ dictionaries والـ sets
- الاستثناءات (try, except)
- OOP (classes, objects, inheritance)
- الملفات
- المكتبات الأساسية

أعد JSON array فقط بدون أي نص إضافي.`;

    const userPrompt = `أنشئ ${count} سؤال Python بصعوبة ${difficulty === "easy" ? "سهلة" : difficulty === "hard" ? "صعبة" : "متنوعة"}.

الصيغة المطلوبة (JSON array):
[
  {
    "id": 1,
    "question": "نص السؤال بالعربية",
    "type": "mcq",
    "choices": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
    "correctAnswer": 0,
    "explanation": "شرح مختصر للإجابة",
    "code": "# كود Python اختياري"
  }
]

ملاحظات:
- correctAnswer هو index الإجابة الصحيحة (0-3)
- code اختياري ويستخدم فقط عند الحاجة
- تنويع في أنواع الأسئلة (mcq, complete, truefalse)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول مرة أخرى لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إعادة شحن الرصيد" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // استخراج JSON من الرد
    let questions: Question[];
    try {
      // محاولة استخراج JSON من النص
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON in AI response");
    }

    // التحقق من صحة الأسئلة
    const validatedQuestions = questions.map((q, index) => ({
      id: index + 1,
      question: q.question || "سؤال غير صالح",
      type: ["mcq", "complete", "truefalse"].includes(q.type) ? q.type : "mcq",
      choices: Array.isArray(q.choices) && q.choices.length >= 2 ? q.choices : ["خيار 1", "خيار 2"],
      correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
      explanation: q.explanation || "لا يوجد شرح",
      code: q.code || undefined,
    }));

    console.log(`Successfully generated ${validatedQuestions.length} questions`);

    return new Response(
      JSON.stringify({ questions: validatedQuestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "خطأ في توليد الأسئلة",
        questions: [] 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
