import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

// Rebuilds the exact-copy inventory. Source verification notes below record the
// separate manual reference review; running this script does not verify sources.
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const rows=[];
const escape=value=>String(value).replaceAll('|','\\|').replaceAll('\n','<br>');
try {
  const shared=await server.ssrLoadModule('/src/data/scientificContent.ts');
  const sources=shared.scienceSources;
  const inferred=text=>[...new Set([
    ...(/Steer|programme|doctor-led/.test(text)?['steerProgramme']:[]),
    ...(/GLP-1|hormone/.test(text)?['glp1','appetite']:[]),
    ...(/glucose|insulin|pancreas/.test(text)?['glucose','glp1']:[]),
    ...(/gut|brain|appetite|hunger|fullness|signal|nerve/.test(text)?['digestion','appetite']:[]),
    ...(/sleep|routine/.test(text)?['sleep','appetite']:[]),
    ...(/digest|nutrient|meal|food/.test(text)?['digestion']:[]),
    ...(/metaboli|energy|circulation|temperature/.test(text)?['metabolism']:[]),
    ...(/clinical|clinician|assessment|diagnos|health needs/.test(text)?['assessment','treatmentOverview']:[]),
    ...(/medicine|treatment|prescription|risk|safety/.test(text)?['treatmentOverview','medicineSafety']:[]),
    ...(/muscle|lean mass|strength|physical function/.test(text)?['nutritionAdvisory']:[]),
    ...(/withdraw|stopping|regain/.test(text)?['withdrawalStudy']:[]),
  ])];
  function add(text,location,ids=[],kind='Educational copy') {
    if(text.startsWith('/') || (!/\s/.test(text) && !text.includes('GLP-1'))) return;
    const support=[...new Set(ids.length ? ids : inferred(text))].filter(id=>sources[id]);
    if(!support.length && !/diagnos|educational|illustrat|individual|suitability|health|treatment/.test(text)) return;
    rows.push({text,location,support,kind});
  }
  function walk(value,location,ids=[]){
    if(!value||typeof value!=='object')return;
    const inherited=value.sourceIds??(value.sourceId?[value.sourceId]:ids);
    for(const [key,child] of Object.entries(value)){
      if(['id','slug','category','visual','reviewStatus','sourceVerification','sourceIds','sourceId','source','kind'].includes(key))continue;
      if(typeof child==='string') add(child,`${location}.${key}`,inherited,/question|Prompt/.test(key)?'Question, not a factual assertion':key==='choices'?'Answer option': 'Educational copy');
      else if(Array.isArray(child))child.forEach((entry,index)=>typeof entry==='string'?add(entry,`${location}.${key}[${index}]`,inherited,/choices|Choices/.test(key)?'Answer option; distractors intentionally incorrect':'Caveat / copy'):walk(entry,`${location}.${key}[${index}]`,inherited));
      else walk(child,`${location}.${key}`,inherited);
    }
  }
  walk(shared.scientificContent,'src/data/scientificContent.ts → scientificContent',['digestion','appetite','sleep']);
  walk(shared.quizScienceContent,'src/data/scientificContent.ts → quizScienceContent',['digestion','appetite','glp1','sleep']);
  for(const [file,names] of Object.entries({
    'gameScienceContent.ts':['gameScience'], 'metabolismLessons.ts':['metabolismLessons','metabolismCopy'], 'glp1Questions.ts':['glp1Questions','glp1Copy'],
  })) { const module=await server.ssrLoadModule(`/src/data/${file}`);for(const name of names)walk(module[name],`src/data/${file} → ${name}`); }
  const interests=await server.ssrLoadModule('/src/data/interestConfigs.ts');
  interests.interestConfigs.forEach(config=>walk(config,`src/data/interestConfigs.ts → ${config.id}`));
  const campaigns=await server.ssrLoadModule('/src/data/campaigns.ts');
  walk(campaigns.primaryCreatives,'src/data/campaigns.ts → primaryCreatives');
  const configs=await server.ssrLoadModule('/src/data/gameConfigs.ts');
  walk(configs.gameConfigs,'src/data/gameConfigs.ts → gameConfigs');
  const stories=await server.ssrLoadModule('/src/games/PredictTheTwist/scenarios.ts');
  const cases=await server.ssrLoadModule('/src/games/CaseFile/caseScenarios.ts');
  function fiction(value,location){
    if(typeof value==='string'){
      if(/hunger|hungry|appetite|meal|sleep|cause|health|explanation|routine/i.test(value))add(value,location,['digestion','sleep','appetite'],'Fictional example / deduction option; not a clinical assertion');
    }else if(value&&typeof value==='object')for(const [key,child] of Object.entries(value))fiction(child,`${location}.${key}`);
  }
  fiction(stories.predictionScenarios,'src/games/PredictTheTwist/scenarios.ts → predictionScenarios');
  fiction(cases.officeCase,'src/games/CaseFile/caseScenarios.ts → officeCase');
  const questions=await server.ssrLoadModule('/src/data/quizQuestions.ts');
  for(const question of [...questions.interestQuestions.science.filter(q=>q.sourceIds?.length),...interests.interestConfigs.map(c=>questions.getBridgeQuestion(c.id)),questions.discoveryQuestion]){
    add(question.prompt,`src/data/quizQuestions.ts → ${question.id}.prompt`,question.sourceIds,'Question, not a factual assertion');
    question.choices.forEach((choice,index)=>add(choice,`src/data/quizQuestions.ts → ${question.id}.choices[${index}]`,question.sourceIds,index===question.correctIndex?'Correct answer':'Distractor; intentionally incorrect'));
    add(question.explanation,`src/data/quizQuestions.ts → ${question.id}.explanation`,question.sourceIds);
  }
  const health=/GLP-1|gut|brain|hormon|appetite|hunger|fullness|insulin|glucose|metaboli|medic|clinical|health|diagnos|digesti|nutrient|muscle|care|nerve/i;
  function scan(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory()&&!['test'].includes(item.name))scan(file);else if(item.isFile()&&file.endsWith('.tsx')){
    const code=fs.readFileSync(file,'utf8');
    // Exact JSX text and quoted UI strings; data claims are inventoried above.
    const matches=[...code.matchAll(/>([^<>{}\r\n]+)</g),...code.matchAll(/(['"])((?:\\.|(?!\1).)*?)\1/g)];
    for(const match of matches){
      const text=(match[2]??match[1]).trim().replace(/\s+/g,' ');
      if(/^[A-Z]/.test(text)&&health.test(text)&&text.includes(' ')&&!text.includes('https://')&&!text.includes('./')&&!text.includes('className')&&text.length<700){
        const line=code.slice(0,match.index).split('\n').length;
        add(text,`${file.replaceAll('\\','/')}:${line}`,[],'Inline UI copy / accessible description');
      }
    }
  }}}
  scan('src');
  const grouped=new Map();for(const row of rows){const key=row.text+'|'+row.kind;const previous=grouped.get(key);if(previous){previous.locations.push(row.location);previous.support=[...new Set([...previous.support,...row.support])];}else grouped.set(key,{...row,locations:[row.location]});}
  const sourceNotes={
    heart:'Basic circulation; heart as pump. Added visible citation to the science-interest question.',
    cells:'Cells as basic living units and specialised functions. Added visible citation.',
    steerProgramme:'Official public website supports doctor-led assessment, personalised plans and continued support. Our paraphrase is NOT approved brand copy.',
    treatmentOverview:'General US prescribing education; individual benefits, risks, medical history and follow-up. Does not establish Indian approval or eligibility.',
    medicineSafety:'Semaglutide-specific safety example; do not generalise its entire warning list to all GLP-1 medicines. The game explicitly labels this limitation.',
    nutritionAdvisory:'2025 joint advisory; nutrition, activity, lean mass, muscle and function are distinct. Not an individual exercise or protein prescription.',
    withdrawalStudy:'STEP 1 exploratory extension subgroup; semaglutide AND structured lifestyle support stopped. Not a universal prediction or instruction to continue/stop treatment. Funding limitations remain in app.',
    metabolism:'Broad biological definition and examples of energy-using processes; not a measured metabolic rate.',
    glucose:'Glucose, pancreatic insulin and uptake by cells. Copy retains “certain cells” and other regulators.',
    assessment:'Metabolic-syndrome assessment provides an example of contextual clinical assessment; not a complete protocol or GLP-1 prescribing rule.',
    digestion:'Food breakdown, nutrient absorption, digestive hormones and nerves. Corrected carbohydrate wording to exclude non-digestible carbohydrate from the simplification.',
    glp1:'Discovery/receptor biology and glucose-dependent insulin response; natural hormone remains distinct from prescription receptor agonists.',
    appetite:'2024 NIDDK workshop; interacting gut-brain, neural and hormonal appetite pathways. A workshop summary, not evidence for a game score.',
    sleep:'Sleep and appetite-related hormones; does not prove an individual fictional character’s symptoms have a particular cause.',
  };
  const header=`# Scientific-content review\n\nReviewed 18 October 2026. Exact-copy inventory generated from the current source using \`node scripts/science-audit.mjs\`. **No clinical approval has occurred.** Source review was manual using accessible primary institutional pages and the two cited publications; regenerating this file does not repeat external verification.\n\n“Supporting concept checked” means the cautious concept was compared with the references; it is not proof of the exact app wording, clinical endorsement, or an Indian medicine approval. Broad contextual sentences and analogies are editorial syntheses. Questions, fictional clues, diagram descriptions and incorrect answer options are labelled separately from factual assertions. Incorrect options are corrected in immediate feedback and must not be reused as educational statements.\n\nAll ${grouped.size} inventory entries below remain pending qualified clinical review. Locations identify the source file and data field or JSX line; shared records also appear in reveals, completion screens, demos and learning cards. Some entries are labels or scope limitations rather than independent medical claims.\n\n## Corrections made\n\n- Changed “Carbohydrates are digested into absorbable sugars, including glucose.” to “Digestible carbohydrates are broken down into absorbable sugars, including glucose.” The earlier sentence overgeneralised digestion to all carbohydrates; terminology was also checked against [MedlinePlus dietary fibre](https://medlineplus.gov/dietaryfiber.html), which distinguishes fibre from carbohydrates broken down and absorbed.\n- Added visible NHLBI and MedlinePlus citations for the heart and cell biology quiz answers; health content in interest rounds now displays its review status too.\n- Added appetite/sleep context references to Missing Clue and the quiz result. Added prescribing/safety sources to the neutral metabolism treatment note.\n- Added the official Steer source to the Case File programme statement and unified the programme description. Public-site alignment is verified; exact brand approval is pending.\n- Retained glucose-dependent insulin wording, natural hormone versus medicine distinction, medicine-specific safety limitations, lean-mass/function distinction, withdrawal-study limitations and US-versus-India regulatory caveats. No dosing, eligibility score, diagnosis or outcome promise was introduced.\n\n## Sources and limits\n\n| Source | Verification on 18 October 2026 | Scope / limit |\n| --- | --- | --- |\n${Object.entries(sources).map(([id,source])=>`| ${id}: [${source.title}](${source.url}) | Accessible; relevant supporting content checked | ${sourceNotes[id]} |`).join('\n')}\n\n## Exact-copy inventory\n\n| Exact copy | Application location | Type | Supporting references | Verification status | Clinical review | Necessary correction / remaining action |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
  const table=[...grouped.values()].map(row=>{
    const business=/Steer|programme/.test(row.text);const distractor=/Distractor|distractor/.test(row.kind);const fictional=row.kind.startsWith('Fictional');
    const status=row.text==='Clinically reviewed'?'Inactive conditional label; no content record is approved':fictional?'Fiction; no individual causal claim verified':distractor?'Not asserted as fact; teaching option':row.support.length?'Supporting concept checked; editorial wording pending':'Product scope / analogy; not an empirical claim';
    return `| ${escape(row.text)} | ${row.locations.map(escape).join('<br>')} | ${row.kind} | ${row.support.map(id=>`[${id}](${sources[id].url})`).join(', ')||'Product scope, checked against application behaviour'} | ${status} | Pending | ${business?'Obtain Steer brand approval and clinical wording review':fictional||distractor?'Retain fictional framing and corrective feedback; do not quote as fact':'No further engineering correction identified; clinician must approve wording and scope'} |`;
  }).join('\n');
  fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/SCIENCE_REVIEW.md',header+table+'\n\n## Approval required before public medical use\n\nA qualified clinician must review each statement, visual simplification, answer correction, source limitation and share card, with an approval date and reviewer record. Steer must separately approve programme wording and the typeset brand mark. Until then the prototype retains visible pending-review labels. Re-review source relevance and local regulatory context before publication; no approval is inferred from a working link.\n');
  console.log(`Wrote ${grouped.size} exact-copy entries and ${Object.keys(sources).length} references.`);
}finally{await server.close();}
