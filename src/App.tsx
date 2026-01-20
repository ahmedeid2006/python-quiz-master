import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HackerChallenge from "./pages/HackerChallenge";
import Index from "./pages/Index";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* صفحة التحدي هي الصفحة الرئيسية */}
          <Route path="/" element={<HackerChallenge />} />
          {/* صفحة الاختبار */}
          <Route path="/quiz" element={<Index />} />
          {/* صفحة المتصدرين */}
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          {/* صفحة غير موجودة */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
