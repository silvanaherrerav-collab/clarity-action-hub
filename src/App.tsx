import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LeaderWelcome from "./pages/LeaderWelcome";
import CollaboratorWelcome from "./pages/CollaboratorWelcome";
import LeaderSurvey from "./pages/LeaderSurvey";
import CollaboratorSurvey from "./pages/CollaboratorSurvey";
import DiagnosticGate from "./pages/DiagnosticGate";
import DiagnosticProcessing from "./pages/DiagnosticProcessing";
import ClarityFirst from "./pages/ClarityFirst";
import LeaderInvite from "./pages/LeaderInvite";
import DiagnosticResult from "./pages/DiagnosticResult";
import CollaboratorThanks from "./pages/CollaboratorThanks";
import LeaderDashboard from "./pages/LeaderDashboard";
import CollaboratorDashboard from "./pages/CollaboratorDashboard";
import ProcessIntake from "./pages/ProcessIntake";
import PlanReview from "./pages/PlanReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Leader flow */}
          <Route path="/leader/welcome" element={<LeaderWelcome />} />
          <Route path="/leader/survey" element={<LeaderSurvey />} />
          <Route path="/leader/diagnostic-processing" element={<DiagnosticProcessing />} />
          <Route path="/leader/clarity-first" element={<ClarityFirst />} />
          <Route path="/leader/diagnostic-gate" element={<DiagnosticGate />} />
          <Route path="/leader/invite" element={<LeaderInvite />} />
          <Route path="/leader/diagnostic-result" element={<DiagnosticResult />} />
          <Route path="/leader/process-intake" element={<ProcessIntake />} />
          <Route path="/leader/plan-review" element={<PlanReview />} />
          <Route path="/leader" element={<LeaderDashboard />} />
          <Route path="/leader/*" element={<LeaderDashboard />} />
          {/* Collaborator flow */}
          <Route path="/collaborator/welcome" element={<CollaboratorWelcome />} />
          <Route path="/collaborator/survey" element={<CollaboratorSurvey />} />
          <Route path="/collaborator/thanks" element={<CollaboratorThanks />} />
          <Route path="/collaborator" element={<CollaboratorDashboard />} />
          <Route path="/collaborator/*" element={<CollaboratorDashboard />} />
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
