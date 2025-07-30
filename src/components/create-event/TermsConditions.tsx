import { FileText } from "lucide-react";
import { TermsConditionsContent } from "./TermsConditionsContent";

interface TermsConditionsProps {
  includeQuestionnaire: boolean;
}

export const TermsConditions = ({ includeQuestionnaire }: TermsConditionsProps) => {
  return <TermsConditionsContent />;
};