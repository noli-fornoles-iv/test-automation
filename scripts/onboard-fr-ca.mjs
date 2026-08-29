/**
 * FR-CA onboarding: Local Config (sheet row EN-FR = French Canada), French translations,
 * AFW-3993 COMMENCER CTA, additive @FR-CA on Coverage YES flows only.
 * Does not remove other locale tags. Invite / Share are Coverage NO — not tagged.
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();

function deepMergeMissing(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return target;
  const out = { ...target };
  for (const [k, v] of Object.entries(source)) {
    if (out[k] === undefined) {
      out[k] = v;
    } else if (v && typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object') {
      out[k] = deepMergeMissing(out[k], v);
    }
  }
  return out;
}

function setPath(obj, dotted, value) {
  const parts = dotted.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// --- test-data from Local Config row EN-FR (French Canada) ---
{
  const data = {
    locations: {
      search: {
        invalid: 'ikkkkkkk',
        noNearby: 'ikkkkkkk',
        noNearbyLocation: 'ikkkkkkk',
        default: 'Winnipeg',
        default1: 'Winnipeg',
      },
      gyms: {
        default: 'Winnipeg',
        default1: 'Winnipeg',
      },
      clubId: '9993995',
      preSaleClubId: '9993995',
      secondaryClubId: '9993995',
      localGym: 'winnipeg-manitoba-9993995',
    },
    zipCodes: {
      valid: {
        default: 'H3Z 2Y7',
        secondary: 'H3Z 2Y7',
      },
      invalid: {
        alpha: 'Z1Z 1Z1',
        short: '1234',
        long: 'H3Z 2Y711',
      },
    },
      phoneNumber: {
        valid: {
          // Local Config 647-212-5551 + Canada dial 1 (sheet "Country Code" cell is area 647)
          default: '16472125551',
          secondary: '16472125551',
          member: 'N/A',
          nonMember: 'N/A',
          localFormat: '6472125551',
        },
        invalid: '0165551234',
        countryCode: '1',
      },
    ownAGym: {
      investmentRange: 'N/A',
      heardAboutUs: 'Website',
      desiredMarket: 'Winnipeg',
      address: 'Winnipeg',
      city: 'Winnipeg',
      state: 'Manitoba',
      country: 'Canada',
      zip: 'H3Z 2Y7',
    },
  };
  fs.writeFileSync(
    path.join(root, 'resources/fr-ca/test-data.json'),
    JSON.stringify(data, null, 2) + '\n',
  );
  console.log('wrote resources/fr-ca/test-data.json');
}

// --- translations: merge missing from en-us, then French + AFW-3993 ---
{
  const us = JSON.parse(fs.readFileSync(path.join(root, 'resources/en-us/translations.json'), 'utf8'));
  let fr = JSON.parse(fs.readFileSync(path.join(root, 'resources/fr-ca/translations.json'), 'utf8'));
  fr = deepMergeMissing(fr, us);

  // AFW-3993 Canada: legal CTA = Commencer (FR) / Get Started (EN)
  setPath(
    fr,
    'texts.consent.privacyNotice',
    'En cliquant sur « Commencer » ci-dessous, je consens à recevoir des textos marketing et d’autres communications qui peuvent être automatisées et/ou placées avec une voix artificielle, placées par ou au nom d’Anytime Fitness Franchisor LLC (« Anytime ») et/ou des franchisés de la marque Anytime, même si mon numéro de téléphone figure sur une liste Do Not Call provinciale ou nationale. Anytime ne partagera pas mes renseignements téléphoniques ou textuels avec d’autres sociétés affiliées. De plus, en cliquant sur « Commencer », j’accepte les Conditions d’utilisation, l’Avis de confidentialité et les Conditions de messagerie texte, et j’atteste que j’ai 18 ans ou plus. Mon consentement à recevoir des communications n’est pas une condition d’achat et je peux le retirer en tout temps. Communications récurrentes. Des frais de messagerie et de données peuvent s’appliquer. Textez ARRÊT pour arrêter. Textez AIDE pour obtenir de l’aide.',
  );
  setPath(fr, 'buttons.userForm.submit', 'ENVOYER');
  setPath(fr, 'buttons.userForm.getStarted', 'COMMENCER');
  setPath(fr, 'labels.locationSearch.searchBoxPlaceholder.cityOrZipCode', 'Recherchez par ville et province ou code postal');
  setPath(fr, 'labels.locationSearch.searchBoxPlaceholder.cityStateOrZipCode', 'Recherchez par ville et province ou code postal');
  setPath(fr, 'labels.userForm.zipCode', 'Code postal');
  setPath(fr, 'labels.userForm.firstName', 'Prénom');
  setPath(fr, 'labels.userForm.lastName', 'Nom');
  setPath(fr, 'labels.userForm.email', 'Courriel');
  setPath(fr, 'labels.userForm.phone', 'Téléphone');
  setPath(fr, 'labels.userForm.termsAndConditions', 'Conditions d’utilisation');
  setPath(fr, 'labels.userForm.privacyNotice', 'Politique de confidentialité');
  setPath(fr, 'labels.userForm.textMessagingTerms', 'Conditions de service SMS et MMS');
  setPath(fr, 'buttons.locationSearch.selectGym', 'SÉLECTIONNER LE GYM');
  setPath(fr, 'buttons.locationSearch.gymDetails', 'DÉTAILS DU GYM');
  setPath(fr, 'buttons.locationSearch.freeTrialPass', 'PASSE D’ESSAI GRATUITE');
  setPath(fr, 'buttons.locationSearch.joinOnline', 'S’INSCRIRE EN LIGNE');
  setPath(fr, 'buttons.locationSearch.claimOffer', 'PROFITER DE L’OFFRE');
  setPath(fr, 'buttons.locationSearch.bookATour', 'RÉSERVER VOTRE VISITE');
  setPath(fr, 'texts.headings.thankYouPage', 'merci');
  setPath(
    fr,
    'texts.bookingConfirmation.thankYouPage',
    'Nous avons bien reçu votre demande. Un membre de notre équipe vous contactera sous peu.',
  );
  setPath(fr, 'texts.headings.locationSearch.tryUsFree.mainHeading', 'ESSAYEZ-NOUS GRATUITEMENT');
  setPath(fr, 'texts.headings.locationSearch.tryUsFree.findGymText', 'TROUVEZ VOTRE GYM');
  setPath(fr, 'texts.headings.locationSearch.tryUsFree.getStartedToday', 'COMMENCEZ AUJOURD’HUI');
  setPath(fr, 'texts.headings.locationSearch.tryUsFree.bannerTitle', 'RÉCLAMEZ VOTRE PASSE D’UNE JOURNÉE GRATUITE.');
  setPath(
    fr,
    'texts.headings.locationSearch.tryUsFree.description',
    'Trouvez le club Anytime Fitness le plus près pour commencer.',
  );
  setPath(fr, 'texts.headings.locationSearch.membershipInquiry.mainHeading', 'DEMANDE D’ADHÉSION');
  setPath(fr, 'texts.headings.locationSearch.membershipInquiry.findGymText', 'TROUVEZ VOTRE GYM');
  setPath(fr, 'texts.headings.locationSearch.bookATourStandalone.bannerTitle', 'RÉSERVER UNE VISITE.');
  setPath(fr, 'texts.headings.locationSearch.bookATourStandalone.findGymText', 'TROUVEZ VOTRE GYM');
  setPath(fr, 'texts.headings.locationSearch.unitOfMeasurement', 'km');

  fs.writeFileSync(
    path.join(root, 'resources/fr-ca/translations.json'),
    JSON.stringify(fr, null, 2) + '\n',
  );
  console.log('wrote resources/fr-ca/translations.json');
}

// --- locationTestStudio ---
{
  const p = path.join(root, 'resources/locationTestStudio.ts');
  let s = fs.readFileSync(p, 'utf8');
  if (/["']FR-CA["']\s*:/.test(s)) {
    s = s.replace(/["']FR-CA["']\s*:\s*["'][^"']*["']/, '"FR-CA":"9993995"');
  } else {
    s = s.replace(/("EN-CA"\s*:\s*"[^"]*")/, '$1,\n  "FR-CA":"9993995"');
  }
  fs.writeFileSync(p, s);
  console.log('updated locationTestStudio FR-CA');
}

console.log('FR-CA resource seed done');
