/**
 * Extract AFW-3091 child summaries from Jira search dump.
 */
import fs from 'fs';

const p =
  'C:/Users/NOLI/.cursor/projects/c-Users-NOLI-Documents-Github-Ignite-Visibility-af-automation-test/agent-tools/1188af65-9fb2-445c-b388-3ffa9cc67e4e.txt';
const text = fs.readFileSync(p, 'utf8');
const issues = [];
const re = /"key": "(AFW-\d+)"[\s\S]*?"summary": "([^"]+)"/g;
let m;
while ((m = re.exec(text))) {
  issues.push(`${m[1]}: ${m[2]}`);
}
console.log(issues.join('\n'));
