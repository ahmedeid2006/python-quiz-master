import React from "react";
import { Link } from "react-router-dom";
import { Shield, Code, Lock, Skull, ArrowLeft, Zap, Database, Eye, Terminal } from "lucide-react";

const HackerChallenge: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Matrix-like effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-background" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-primary/30 font-mono text-xs animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.5 ? "01" : "10"}
            </div>
          ))}
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Warning Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/20 mb-6 animate-pulse">
            <Skull className="w-12 h-12 text-destructive" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-cairo">
            ⚠️ تحذير للهاكرز ⚠️
          </h1>
          
          <p className="text-xl text-muted-foreground font-cairo max-w-2xl mx-auto">
            إذا كنت تعتقد أنك قادر على اختراق هذا الموقع... 
            <span className="text-destructive font-bold"> يلا جرب! 🔥</span>
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="quiz-card p-6 border-2 border-primary/30 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold text-foreground font-cairo">حماية متعددة الطبقات</h3>
            </div>
            <p className="text-muted-foreground font-cairo">
              النظام محمي بطبقات أمان متعددة. كل محاولة اختراق سيتم تسجيلها وتتبعها.
            </p>
          </div>

          <div className="quiz-card p-6 border-2 border-primary/30 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-success" />
              <h3 className="text-xl font-bold text-foreground font-cairo">تشفير قوي</h3>
            </div>
            <p className="text-muted-foreground font-cairo">
              جميع البيانات مشفرة ومحمية بسياسات Row Level Security صارمة.
            </p>
          </div>

          <div className="quiz-card p-6 border-2 border-primary/30 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-secondary-foreground" />
              <h3 className="text-xl font-bold text-foreground font-cairo">Rate Limiting</h3>
            </div>
            <p className="text-muted-foreground font-cairo">
              نظام تحديد المعدل يمنع أي محاولات تلاعب متكررة أو هجمات برمجية.
            </p>
          </div>

          <div className="quiz-card p-6 border-2 border-primary/30 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-destructive" />
              <h3 className="text-xl font-bold text-foreground font-cairo">مراقبة نشطة</h3>
            </div>
            <p className="text-muted-foreground font-cairo">
              كل نشاط مشبوه يتم تتبعه. بصمة جهازك محفوظة عندنا 👀
            </p>
          </div>
        </div>

        {/* Security Features List */}
        <div className="quiz-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 font-cairo flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" />
            ماذا حاولنا نمنع؟
          </h2>
          
          <ul className="space-y-4 text-muted-foreground font-cairo" dir="rtl">
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                <strong className="text-foreground">SQL Injection:</strong> جميع الاستعلامات محمية ولا يمكن حقنها
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                <strong className="text-foreground">التلاعب بالنتائج:</strong> يتم التحقق من منطقية النتيجة قبل حفظها
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Spam Attacks:</strong> 3 محاولات فقط كل 5 دقائق لكل جهاز
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                <strong className="text-foreground">أسماء وهمية:</strong> يجب اسم ثلاثي حقيقي للمشاركة
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Device Fingerprinting:</strong> نتتبع بصمة كل جهاز
              </span>
            </li>
          </ul>
        </div>

        {/* Challenge Message */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary/20 via-destructive/20 to-primary/20 p-8 rounded-2xl">
            <Code className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground font-cairo mb-2">
              لو شاطر... اختبر نفسك في الـ Quiz!
            </p>
            <p className="text-muted-foreground font-cairo">
              الهاكر الحقيقي بيثبت نفسه بالعلم مش بالتخريب 💻
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/quiz"
            className="python-button inline-flex items-center gap-3 text-lg px-8 py-4 font-cairo"
          >
            <ArrowLeft className="w-5 h-5" />
            ابدأ الاختبار
          </Link>
        </div>

        {/* Footer Message */}
        <p className="text-center text-sm text-muted-foreground mt-8 font-cairo">
          💡 نصيحة: بدل ما تضيع وقتك في محاولة الاختراق، تعلم Python وكن مبرمج محترم!
        </p>
      </div>
    </div>
  );
};

export default HackerChallenge;
