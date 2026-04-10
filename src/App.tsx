import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountConfirmation from "./pages/AccountConfirmation";
import LeaderWelcome from "./pages/LeaderWelcome";

import ProcessIntro from "./pages/ProcessIntro";
import ProcessIntake from "./pages/ProcessIntake";
import ProcessResponsible from "./pages/ProcessResponsible";
import DiagnosticProcessing from "./pages/DiagnosticProcessing";
import DiagnosticHub from "./pages/DiagnosticHub";
import PlanReview from "./pages/PlanReview";
import PlanWaiting from "./pages/PlanWaiting";
import PlanExecution from "./pages/PlanExecution";
import LeaderSurvey from "./pages/LeaderSurvey";
import LeaderDashboard from "./pages/LeaderDashboard";
import LeaderTodo from "./pages/LeaderTodo";
import CulturalDiagnosisPage from "./pages/CulturalDiagnosisPage";
import LeaderActions from "./pages/LeaderActions";
import LeaderInvite from "./pages/LeaderInvite";
import DiagnosticGate from "./pages/DiagnosticGate";
import DiagnosticFinalProcessing from "./pages/DiagnosticFinalProcessing";
import DiagnosticResult from "./pages/DiagnosticResult";
import CollaboratorWelcome from "./pages/CollaboratorWelcome";
import CollaboratorSurvey from "./pages/CollaboratorSurvey";
import CollaboratorThanks from "./pages/CollaboratorThanks";
import CollaboratorDashboard from "./pages/CollaboratorDashboard";
import CollaboratorPulse from "./pages/CollaboratorPulse";
import CollaboratorWeek from "./pages/CollaboratorWeek";
import CollaboratorTaskReview from "./pages/CollaboratorTaskReview";
import CollaboratorActionPlan from "./pages/CollaboratorActionPlan";
import CollaboratorDiagnosticResult from "./pages/CollaboratorDiagnosticResult";
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
          <Route path="/register" element={<Register />} />
          <Route path="/account-confirmation" element={<AccountConfirmation />} />
          {/* Leader flow */}
          <Route path="/leader/welcome" element={<LeaderWelcome />} />
          <Route path="/leader/todo" element={<LeaderTodo />} />
          
          <Route path="/leader/process-intro" element={<ProcessIntro />} />
          <Route path="/leader/process-intake" element={<ProcessIntake />} />
          <Route path="/leader/process-responsible" element={<ProcessResponsible />} />
          <Route path="/leader/diagnostic-processing" element={<DiagnosticProcessing />} />
          <Route path="/leader/diagnostic-hub" element={<DiagnosticHub />} />
          <Route path="/leader/diagnostic-final-processing" element={<DiagnosticFinalProcessing />} />
          <Route path="/leader/plan-review" element={<PlanReview />} />
          <Route path="/leader/plan-waiting" element={<PlanWaiting />} />
          <Route path="/leader/plan-execution" element={<PlanExecution />} />
          <Route path="/leader/cultural-diagnosis" element={<CulturalDiagnosisPage />} />
          <Route path="/leader/survey" element={<LeaderSurvey />} />
          <Route path="/leader/diagnostic-gate" element={<DiagnosticGate />} />
          <Route path="/leader/invite" element={<LeaderInvite />} />
          <Route path="/leader/diagnostic-result" element={<DiagnosticResult />} />
          <Route path="/leader/actions" element={<LeaderActions />} />
          <Route path="/leader" element={<LeaderDashboard />} />
          <Route path="/leader/*" element={<LeaderDashboard />} />
          {/* Collaborator flow */}
          <Route path="/collaborator/welcome" element={<CollaboratorWelcome />} />
          <Route path="/collaborator/survey" element={<CollaboratorSurvey />} />
          <Route path="/collaborator/task-review" element={<CollaboratorTaskReview />} />
          <Route path="/collaborator/pulse" element={<CollaboratorPulse />} />
          <Route path="/collaborator/week" element={<CollaboratorWeek />} />
          <Route path="/collaborator/action-plan" element={<CollaboratorActionPlan />} />
          <Route path="/collaborator/thanks" element={<CollaboratorThanks />} />
          <Route path="/collaborator/diagnostic-result" element={<CollaboratorDiagnosticResult />} />
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
