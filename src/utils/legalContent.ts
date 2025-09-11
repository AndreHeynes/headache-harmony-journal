/**
 * Legal Disclaimer Content Management
 * Centralized legal disclaimers for AI-generated content and reports
 */

export interface DisclaimerContent {
  id: string;
  version: string;
  title: string;
  content: string;
  lastUpdated: string;
  category: 'ai-report' | 'export' | 'analysis' | 'general';
}

export const DISCLAIMER_VERSIONS = {
  AI_REPORT: "1.0.0",
  EXPORT: "1.0.0", 
  ANALYSIS: "1.0.0"
} as const;

export const LEGAL_DISCLAIMERS: DisclaimerContent[] = [
  {
    id: "ai-premium-report",
    version: DISCLAIMER_VERSIONS.AI_REPORT,
    title: "AI-Generated Report Legal Disclaimer",
    category: "ai-report",
    lastUpdated: "2024-01-15",
    content: `
**IMPORTANT LEGAL DISCLAIMER - AI-GENERATED CONTENT**

This AI-generated report is NOT a medical report, diagnosis, or professional medical advice. This information is provided solely for informational and educational purposes to help you organize and present your headache tracking data to healthcare professionals.

**PURPOSE AND LIMITATIONS:**
• This report summarizes the headache information you have entered during your subscription period
• The AI analysis provides general patterns and observations based on your logged data only
• All content is derived from your personal input and general headache knowledge databases
• This system cannot diagnose medical conditions or provide treatment recommendations

**NOT A SUBSTITUTE FOR MEDICAL CARE:**
• Always consult qualified healthcare professionals for medical advice, diagnosis, and treatment
• Do not use this report to self-diagnose or make medical decisions
• Seek immediate medical attention for severe, sudden, or concerning symptoms
• Your healthcare provider should evaluate all information independently

**DATA ACCURACY:**
• Report accuracy depends entirely on the completeness and accuracy of your input data
• AI analysis may not capture all relevant factors or individual variations
• Patterns identified are observational and may not indicate causal relationships

**INTENDED USE:**
• This report is designed to facilitate communication with your healthcare provider
• It helps organize your headache experience data for medical discussions  
• Your doctor will evaluate this information alongside clinical examination and medical history
• All medical decisions should be made by qualified healthcare professionals

**PRIVACY AND SHARING:**
• Handle this report as confidential personal health information
• Share only with trusted healthcare providers and authorized individuals
• Be aware of privacy implications when storing or transmitting this data

By accessing this AI-generated report, you acknowledge that you understand these limitations and will use this information appropriately in consultation with qualified healthcare professionals.

Last Updated: ${new Date().toLocaleDateString()}
Report Version: ${DISCLAIMER_VERSIONS.AI_REPORT}
    `.trim()
  },
  {
    id: "export-disclaimer",
    version: DISCLAIMER_VERSIONS.EXPORT,
    title: "Data Export Disclaimer",
    category: "export",
    lastUpdated: "2024-01-15", 
    content: `
**DATA EXPORT DISCLAIMER**

This export contains your personal headache tracking data and is intended for sharing with healthcare professionals. 

• This data represents your subjective experiences and self-reported information
• Exported information is not a medical diagnosis or professional assessment
• Healthcare providers should evaluate this data within the context of proper medical examination
• Handle as confidential personal health information

This export is generated for informational purposes only and does not constitute medical advice.
    `.trim()
  },
  {
    id: "ai-analysis-disclaimer", 
    version: DISCLAIMER_VERSIONS.ANALYSIS,
    title: "AI Analysis Disclaimer",
    category: "analysis",
    lastUpdated: "2024-01-15",
    content: `
**AI ANALYSIS DISCLAIMER**

This AI-powered analysis provides general observations based on your headache data patterns. It is not medical advice or diagnosis.

• Analysis is based solely on the information you have provided
• Patterns identified are observational and educational in nature
• Always consult healthcare professionals for medical interpretation
• This analysis cannot replace professional medical evaluation

Use this information to facilitate discussions with your healthcare provider.
    `.trim()
  }
];

export const getDisclaimer = (id: string): DisclaimerContent | null => {
  return LEGAL_DISCLAIMERS.find(d => d.id === id) || null;
};

export const getDisclaimerByCategory = (category: DisclaimerContent['category']): DisclaimerContent[] => {
  return LEGAL_DISCLAIMERS.filter(d => d.category === category);
};

export const getCurrentDisclaimerVersion = (id: string): string => {
  const disclaimer = getDisclaimer(id);
  return disclaimer?.version || "1.0.0";
};