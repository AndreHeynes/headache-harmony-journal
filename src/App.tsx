
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LogHeadache from "./pages/LogHeadache";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Analysis from "./pages/Analysis";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SupportServices from "./pages/SupportServices";
import Policy from "./pages/Policy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log" element={<LogHeadache />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/support" element={<SupportServices />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
