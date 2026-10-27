import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { createElement } from 'react';
const riskLabels = {
  low: { th: 'ความเสี่ยงต่ำ', en: 'Low risk' },
  medium: { th: 'ความเสี่ยงปานกลาง', en: 'Moderate risk' },
  high: { th: 'ต้องติดตามใกล้ชิด', en: 'Needs attention' },
};

export const BilingualHeading = ({ th, en, as: Tag = 'h2', className = '' }) => (
  <div className={`bilingual-heading ${className}`}>
    {createElement(Tag, null, th)}
    {en && <span>{en}</span>}
  </div>
);

export const RiskBadge = ({ risk }) => {
  const label = riskLabels[risk] || { th: 'ยังไม่มีผล', en: 'Not recorded' };
  return <span className={`risk-badge risk-${risk}`}>{label.th}<small>{label.en}</small></span>;
};

export const DemoNotice = ({ compact = false }) => (
  <div className={`demo-notice ${compact ? 'demo-notice-compact' : ''}`}>
    <Info size={16} aria-hidden="true" />
    <span>ข้อมูลตัวอย่างสำหรับสาธิตเท่านั้น / Demonstration data only</span>
  </div>
);

export const ResultCallout = ({ risk, children }) => {
  const icon = risk === 'high' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />;
  return <div className={`result-callout result-${risk}`}>{icon}<div>{children}</div></div>;
};
