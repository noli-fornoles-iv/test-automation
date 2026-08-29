/**
 * Patch FR-CA translations for Coverage YES flows from live SIT scrape + Quebec French.
 * Does not invent gym/test data — UI copy only.
 */
import fs from 'fs';

const fp = 'resources/fr-ca/translations.json';
const t = JSON.parse(fs.readFileSync(fp, 'utf8'));

const set = (obj, path, value) => {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
};

const patches = {
  // Contact Us — live SIT /fr-ca/email-club
  'texts.headings.locationSearch.contactUs.mainHeading': "D'ABORD, TROUVEZ VOTRE GYMNASIUM",
  'texts.headings.locationSearch.contactUs.findGymText': 'TROUVER VOTRE GYM',
  'texts.headings.locationSearch.contactUs.letsGetYouToTheRightPlace':
    'NOUS ALLONS VOUS AMENER AU BON ENDROIT.',
  'texts.headings.locationSearch.contactUs.useCurrentLocation': 'Utiliser l’emplacement actuel',
  'texts.headings.locationSearch.contactUs.formHeading': 'ENVOYEZ-NOUS UN MESSAGE',
  'texts.headings.locationSearch.contactUs.listTab': 'LISTE',
  'texts.headings.locationSearch.contactUs.mapTab': 'CARTE',

  // Shared location search patterns used across YES flows
  'texts.headings.locationSearch.membershipInquiry.findGymText': 'TROUVER VOTRE GYM',
  'texts.headings.locationSearch.membershipInquiry.letsGetYouToTheRightPlace':
    'NOUS ALLONS VOUS AMENER AU BON ENDROIT.',
  'texts.headings.locationSearch.membershipInquiry.useCurrentLocation':
    'Utiliser l’emplacement actuel',
  'texts.headings.locationSearch.membershipInquiry.connectWithUs': 'COMMUNIQUEZ AVEC NOUS',
  'texts.headings.locationSearch.membershipInquiry.listTab': 'LISTE',
  'texts.headings.locationSearch.membershipInquiry.mapTab': 'CARTE',

  'texts.headings.locationSearch.tryUsFree.findGymText': 'TROUVER VOTRE GYM',
  'texts.headings.locationSearch.tryUsFree.letsGetYouToTheRightPlace':
    'NOUS ALLONS VOUS AMENER AU BON ENDROIT.',
  'texts.headings.locationSearch.tryUsFree.useCurrentLocation': 'Utiliser l’emplacement actuel',
  'texts.headings.locationSearch.tryUsFree.listTab': 'LISTE',
  'texts.headings.locationSearch.tryUsFree.mapTab': 'CARTE',

  'texts.headings.locationSearch.bookATourStandalone.bannerTitle': 'PLANIFIEZ VOTRE VISITE.',
  'texts.headings.locationSearch.bookATourStandalone.findGymText': 'TROUVER VOTRE GYM',
  'texts.headings.locationSearch.bookATourStandalone.bannerSubTitle':
    'Faites votre premier pas sur notre gazon violet. Nous vous montrerons les équipements, les services et tout ce dont vous avez besoin pour commencer.',

  'texts.headings.locationSearch.appleFitnessOffer.mainHeading': 'ESSAYEZ-NOUS GRATUITEMENT',
  'texts.headings.locationSearch.appleFitnessOffer.description':
    'Trouvez le club Anytime Fitness le plus près pour commencer.',
  'texts.headings.locationSearch.appleFitnessOffer.findGymText': 'TROUVER VOTRE GYM',

  'texts.headings.locationSearch.appleFitnessSubscriber.mainHeading':
    'RÉCLAMEZ VOTRE ACCÈS GRATUIT',
  'texts.headings.locationSearch.appleFitnessSubscriber.description':
    'Trouvez le club Anytime Fitness le plus près pour commencer.',
  'texts.headings.locationSearch.appleFitnessSubscriber.findGymText': 'TROUVER VOTRE GYM',

  'texts.headings.locationSearch.eventsPromo.mainHeading': 'OFFRE À DURÉE LIMITÉE',
  'texts.headings.locationSearch.eventsPromo.description': 'INSCRIVEZ-VOUS POUR 1 $',
  'texts.headings.locationSearch.eventsPromo.findGymText': 'TROUVEZ VOTRE SALLE DE SPORT',
  'texts.headings.locationSearch.eventsPromo.letsGetYouToTheRightPlace':
    'NOUS ALLONS VOUS AMENER AU BON ENDROIT.',
  'texts.headings.locationSearch.eventsPromo.useCurrentLocation':
    'Utiliser l’emplacement actuel',
  'texts.headings.locationSearch.eventsPromo.getStartedNow': 'COMMENCEZ MAINTENANT.',
  'texts.headings.locationSearch.eventsPromo.tellUsAboutYou': 'PARLEZ-NOUS DE VOUS',

  // Book A Tour addon / see you soon
  'texts.bookATour.weGotItHeading': 'C’EST REÇU',
  'texts.bookATour.weGotItBody':
    'Merci! Un membre de l’équipe de ${city} communiquera avec vous sous peu. Planifiez votre première visite pour essayer votre nouveau gym.',
  'texts.bookATour.pickATimeHeading': 'RÉSERVEZ VOTRE VISITE',
  'texts.bookATour.appointmentDetailsLabel': 'VOTRE PLACE EST RÉSERVÉE',
  'texts.bookATour.seeYouSoonBody':
    'Votre visite a été planifiée. Nous avons hâte de vous faire découvrir le gym et de vous aider à atteindre vos objectifs de mise en forme.',

  // Errors — FR-CA uses km (unitOfMeasurement) and Canadian postal wording
  'errors.locationSearch.noGymsNearby': 'AUCUN GYM À PROXIMITÉ.',
  'errors.locationSearch.noGymsNearbyHeading': 'AUCUN GYM À PROXIMITÉ.',
  'errors.locationSearch.noGymsNearbyDescription':
    'Il semble que nous ne soyons pas encore dans cette région. Essayez une autre recherche ci-dessus pour explorer les options dans une ville voisine, ou consultez tous les emplacements.',
  'errors.locationSearch.invalidLocation':
    'Recherche invalide. Veuillez entrer un code postal, une ville, un pays ou une province/état valide. Assurez-vous que votre saisie est correctement formatée et réessayez!',
  'errors.locationSearch.noNearbyLocations':
    'Aucun emplacement trouvé dans un rayon de 80 km de ${location}. Veuillez chercher une autre ville.',
  'errors.locationSearch.noLocation': 'Aucun emplacement trouvé dans',
  'errors.locationSearch.serverSide':
    'Oups! Une erreur s’est produite lors du traitement de votre envoi. Veuillez réessayer dans un instant.',
  'errors.userForm.invalidZipCode': 'Code postal invalide',
  'errors.userForm.invalidPostCode': 'Code postal invalide',
  'errors.userForm.serverSide':
    'Oups! Une erreur s’est produite lors du traitement de votre envoi. Veuillez réessayer dans un instant.',
  'errors.BatAddon.dateRequired': 'Cette valeur est requise.',
  'errors.BatAddon.timeRequired': 'Cette valeur est requise.',
  'errors.BatAddon.noTimeSlots': 'Sélectionnez une date pour voir les plages horaires disponibles.',
  'errors.BatAddon.slotConflict':
    'Oups! Quelqu’un d’autre a pris ce créneau. Veuillez sélectionner une autre heure.',

  'buttons.locationSearch.joinInGym': 'S’INSCRIRE AU GYM',
  'buttons.localGymPage.membershipInquiryBtn': 'DEMANDE D’ADHÉSION',
  'buttons.localGymPage.contactUsBtn': 'NOUS JOINDRE',
  'buttons.seeYouSoonPage.sendTrialPass': 'ENVOYER LA PASSE D’ESSAI',

  'placeholders.userForm.firstName': 'Prénom',
  'placeholders.userForm.lastName': 'Nom de famille',
  'placeholders.userForm.email': 'Courriel',
  'placeholders.userForm.phone': 'Téléphone mobile',
  'placeholders.userForm.zipCode': 'Code postal',
  'placeholders.userForm.message': 'Message',

  'texts.headings.thankYouPage': 'merci',
};

for (const [path, value] of Object.entries(patches)) {
  set(t, path, value);
}

fs.writeFileSync(fp, JSON.stringify(t, null, 2) + '\n');
console.log('patched', Object.keys(patches).length, 'keys');
