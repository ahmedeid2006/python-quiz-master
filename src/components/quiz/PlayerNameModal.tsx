import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, AlertCircle, RefreshCw } from "lucide-react";
import { usePlayerNameStorage } from "@/hooks/useDeviceFingerprint";

interface PlayerNameModalProps {
  onSubmit: (name: string) => void;
}

const PlayerNameModal: React.FC<PlayerNameModalProps> = ({ onSubmit }) => {
  const { getSavedName, saveName } = usePlayerNameStorage();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [hasSavedName, setHasSavedName] = useState(false);

  // تحقق من وجود اسم محفوظ
  useEffect(() => {
    const savedName = getSavedName();
    if (savedName) {
      setName(savedName);
      setHasSavedName(true);
    }
  }, [getSavedName]);

  const validateFullName = (fullName: string): boolean => {
    const parts = fullName.trim().split(/\s+/);
    return parts.length >= 3 && parts.every(part => part.length >= 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("يرجى إدخال اسمك");
      return;
    }
    
    if (!validateFullName(name)) {
      setError("يرجى إدخال الاسم الثلاثي كاملاً (الاسم الأول + اسم الأب + اسم العائلة)");
      return;
    }
    
    setError("");
    // حفظ الاسم للمرات القادمة
    saveName(name.trim());
    onSubmit(name.trim());
  };

  const handleChangeName = () => {
    setName("");
    setHasSavedName(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full" dir="rtl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {hasSavedName ? "مرحباً بعودتك!" : "مرحباً بك!"}
          </h2>
          <p className="text-muted-foreground mt-2 text-center">
            {hasSavedName 
              ? "وجدنا اسمك المحفوظ. اضغط للاستمرار أو غيّر الاسم."
              : "أدخل اسمك الثلاثي للبدء في الاختبار والظهور في لوحة المتصدرين"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="الاسم الأول + اسم الأب + اسم العائلة"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="text-right text-lg py-6"
              autoFocus={!hasSavedName}
              disabled={hasSavedName}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          {!hasSavedName && (
            <p className="text-xs text-muted-foreground text-center">
              مثال: أحمد محمد علي
            </p>
          )}

          {hasSavedName && (
            <Button 
              type="button"
              variant="outline"
              onClick={handleChangeName}
              className="w-full py-4 text-sm"
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              تغيير الاسم
            </Button>
          )}

          <Button 
            type="submit" 
            className="w-full py-6 text-lg"
          >
            {hasSavedName ? "استمر بهذا الاسم" : "ابدأ الاختبار"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          ⚠️ الاسم سيظهر في لوحة المتصدرين العامة
        </p>
      </div>
    </div>
  );
};

export default PlayerNameModal;
