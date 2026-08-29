/**
 * Match-only function-word lexicon (never emits mismatches).
 */

export interface LexiconVerdict {
  detectedLanguage: string;
  matches: boolean;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

const STOPWORDS: Record<string, Set<string>> = {
  English: new Set([
    'the', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'at', 'with', 'your', 'our',
    'my', 'this', 'that', 'is', 'are', 'be', 'from', 'by', 'more', 'back', 'next',
    'home', 'close', 'open', 'search', 'menu', 'page', 'view', 'see', 'go', 'sign',
    'help', 'click', 'here', 'us', 'how', 'what', 'find', 'gym', 'submit', 'send',
    'first', 'last', 'name', 'email', 'phone', 'message', 'required', 'invalid',
  ]),
  German: new Set([
    'der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'und', 'oder', 'zu', 'für',
    'mit', 'auf', 'in', 'im', 'von', 'an', 'ihr', 'ihre', 'unser', 'mehr', 'schließen',
    'suchen', 'menü', 'seite', 'weiter', 'zurück', 'alle', 'neu', 'hier', 'hilfe',
    'anmelden', 'öffnen', 'wie', 'was', 'wir', 'senden', 'nachricht', 'name',
    // Common AF lead-flow CTAs / empty-state copy (ALL CAPS often confuses CLD3)
    'lass', 'uns', 'dich', 'richtigen', 'ort', 'bringen', 'wähle', 'waehle',
    'finde', 'dein', 'deine', 'studio', 'standort', 'standorte', 'nähe', 'nahe',
    'club', 'af', 'fitnessstudio', 'zuerst', 'ihr',
    'vorname', 'nachname', 'telefon', 'absenden',
  ]),
  Italian: new Set([
    'il', 'lo', 'la', 'gli', 'le', 'un', 'uno', 'una', 'di', 'del', 'della', 'con',
    'per', 'in', 'nel', 'tuo', 'tua', 'nostro', 'più', 'chiudere', 'cerca', 'cercare',
    'menu', 'pagina', 'successivo', 'precedente', 'tutto', 'nuovo', 'qui', 'aiuto',
    'accedi', 'aprire', 'come', 'invia', 'messaggio', 'nome', 'cognome', 'email',
  ]),
  French: new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'au', 'aux', 'en',
    'avec', 'pour', 'par', 'votre', 'vos', 'notre', 'plus', 'fermer', 'rechercher',
    'menu', 'page', 'voir', 'suivant', 'précédent', 'tout', 'nouveau', 'ici', 'aide',
    'envoyer', 'message', 'nom', 'prénom',
  ]),
  Arabic: new Set([]),
  Thai: new Set([]),
};

export function isLexiconDisabled(): boolean {
  const raw = process.env.DISABLE_LEXICON_FILTER?.trim().toLowerCase();
  return raw === '1' || raw === 'true' || raw === 'yes';
}

function tokenize(text: string): string[] {
  const matched = text.toLowerCase().match(/[\p{L}][\p{L}'’-]*/gu);
  return (matched ?? []).filter(t => t.length >= 2);
}

function confirmWithLexicon(text: string, expectedLanguage: string): LexiconVerdict | null {
  if (!STOPWORDS[expectedLanguage] || STOPWORDS[expectedLanguage].size === 0) return null;

  const tokens = tokenize(text);
  if (tokens.length === 0) return null;

  const langs = Object.keys(STOPWORDS).filter(l => STOPWORDS[l].size > 0);
  const scores: Record<string, number> = {};
  for (const lang of langs) scores[lang] = 0;

  let expectedStrongWord = false;
  for (const tok of tokens) {
    for (const lang of langs) {
      if (STOPWORDS[lang].has(tok)) {
        scores[lang] += 1;
        if (lang === expectedLanguage && tok.length >= 4) expectedStrongWord = true;
      }
    }
  }

  const expectedScore = scores[expectedLanguage] ?? 0;
  let maxOther = 0;
  for (const lang of langs) {
    if (lang === expectedLanguage) continue;
    if ((scores[lang] ?? 0) > maxOther) maxOther = scores[lang];
  }

  const dominant = expectedScore >= 2 && expectedScore > maxOther;
  const soleEvidence = expectedScore >= 1 && maxOther === 0 && expectedStrongWord;
  if (!dominant && !soleEvidence) return null;

  return {
    detectedLanguage: expectedLanguage,
    matches: true,
    confidence: 'high',
    reason: `[lexicon] ${expectedLanguage} function words dominate (score ${expectedScore})`,
  };
}

export function classifyWithLexicon(
  items: { id: string; text: string }[],
  expectedLanguage: string,
): Map<string, LexiconVerdict> {
  const resolved = new Map<string, LexiconVerdict>();
  if (items.length === 0) return resolved;
  for (const item of items) {
    const verdict = confirmWithLexicon(item.text, expectedLanguage);
    if (verdict) resolved.set(item.id, verdict);
  }
  return resolved;
}
