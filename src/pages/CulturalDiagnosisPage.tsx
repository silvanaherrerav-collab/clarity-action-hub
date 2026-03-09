import { useNavigate } from "react-router-dom";
import CulturalDiagnosisModule from "@/components/CulturalDiagnosisModule";

const CulturalDiagnosisPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <CulturalDiagnosisModule
          onComplete={() => {
            // Results already stored in localStorage by the module
          }}
          onCancel={() => navigate("/leader")}
        />
      </div>
    </div>
  );
};

export default CulturalDiagnosisPage;
