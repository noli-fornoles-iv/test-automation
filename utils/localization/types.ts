/** Types for Contact Us / lead-flow untranslated-text scanning. */

/** Painted UI only — aria-label / title / alt are intentionally excluded. */
export type FlowTextKind = 'visible' | 'placeholder' | 'button' | 'heading';

export interface ExtractedFlowText {
  kind: FlowTextKind;
  text: string;
  selector: string;
  tagName: string;
  /** Step label when collected, e.g. landing | results | form | thank-you */
  stage?: string;
}

export interface LanguageCheckResult {
  text: string;
  expectedLanguage: string;
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  source?: 'deterministic' | 'cld3' | 'lexicon' | 'cursor-ai';
  stage?: string;
  kind?: FlowTextKind;
}

export interface UntranslatedScanIssue {
  type: 'language_mismatch' | 'needs_review';
  text: string;
  expectedLanguage: string;
  detectedLanguage: string;
  confidence: LanguageCheckResult['confidence'];
  source?: LanguageCheckResult['source'];
  stage?: string;
  kind?: FlowTextKind;
  /** High-confidence mismatches fail the test; review items are report-only. */
  failsCi: boolean;
  message: string;
}

export interface UntranslatedScanSummary {
  locale: string;
  expectedLanguage: string;
  scannedAt: string;
  stringsChecked: number;
  uniqueStrings: number;
  issues: UntranslatedScanIssue[];
  failingCount: number;
  reviewCount: number;
}
