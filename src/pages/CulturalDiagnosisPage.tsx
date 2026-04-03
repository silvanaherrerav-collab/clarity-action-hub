import { useNavigate } from "react-router-dom";
import CulturalDiagnosisModule from "@/components/CulturalDiagnosisModule";
import { Sidebar } from "@/components/layout/Sidebar";

const CulturalDiagnosisPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />
      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden bg-background">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <CulturalDiagnosisModule
            onComplete={() => {}}
            onCancel={() => navigate("/leader")}
          />
        </div>
      </main>
    </div>
  );
};

export default CulturalDiagnosisPage;
