import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/data/quizQuestions";
import { toast } from "sonner";

interface UseAIQuestionsReturn {
  generateQuestions: (count?: number, difficulty?: "easy" | "mixed" | "hard") => Promise<Question[]>;
  isGenerating: boolean;
  error: string | null;
}

/**
 * Hook لتوليد أسئلة Python باستخدام AI
 * يستخدم Lovable AI لإنشاء أسئلة جديدة ومتنوعة
 */
export const useAIQuestions = (): UseAIQuestionsReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = useCallback(
    async (count = 5, difficulty: "easy" | "mixed" | "hard" = "mixed"): Promise<Question[]> => {
      setIsGenerating(true);
      setError(null);

      try {
        console.log(`Requesting ${count} AI-generated questions...`);

        const { data, error: invokeError } = await supabase.functions.invoke("generate-questions", {
          body: { count, difficulty },
        });

        if (invokeError) {
          console.error("Edge function error:", invokeError);
          throw new Error(invokeError.message || "فشل في توليد الأسئلة");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (!data?.questions || data.questions.length === 0) {
          throw new Error("لم يتم توليد أي أسئلة");
        }

        console.log(`Successfully generated ${data.questions.length} questions`);
        toast.success(`تم توليد ${data.questions.length} سؤال جديد! 🎉`);

        // تأكد من أن الأسئلة تطابق النوع المطلوب
        return data.questions.map((q: Question, index: number) => ({
          ...q,
          id: Date.now() + index, // ID فريد
          type: q.type || "mcq",
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "خطأ غير متوقع";
        setError(errorMessage);
        console.error("Error generating questions:", err);
        toast.error(`فشل في توليد الأسئلة: ${errorMessage}`);
        return [];
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generateQuestions, isGenerating, error };
};
