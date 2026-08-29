import fs from 'fs';

const fp = 'features/localOffer/local-offer.feature';
let c = fs.readFileSync(fp, 'utf8');

c = c.replace(/^([ \t]*)@EN-CA @FR-CA[ \t]*$/gm, '$1@EN-CA');
c = c.replace(/^([ \t]*)@AFW-3198 @EN-CA @FR-CA[ \t]*$/gm, '$1@AFW-3198 @EN-CA');
c = c.replace(/^([ \t]*)@AFW-3213 @EN-CA @FR-CA[ \t]*$/gm, '$1@AFW-3213 @EN-CA');
c = c.replace(/^([ \t]*)@AFW-3215 @EN-CA @FR-CA[ \t]*$/gm, '$1@AFW-3215 @EN-CA');

fs.writeFileSync(fp, c);

const enFr = (c.match(/@EN-CA @FR-CA/g) || []).length;
const frBlocks = (c.match(/^\s*@FR-CA\s*$/gm) || []).length;
const join = (c.match(/join_1_dollar_fall_membership/g) || []).length;
console.log({ enFr, frBlocks, join });
