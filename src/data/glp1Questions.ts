import { steerProgrammeDescription } from './scientificContent';
import type { HealthQuestion, HealthTopicId } from '../types/healthQuestion';

const educationCaveat = 'Educational only. This experience cannot assess health or determine treatment suitability.';
const medicineCaveat = 'Benefits, risks and approved uses vary by medicine and jurisdiction. These references include US information; they do not establish an approval or eligibility in India.';
type QuestionInput = Omit<HealthQuestion, 'id' | 'reviewStatus' | 'sourceVerification' | 'sourceIds' | 'caveats'> & { caveats?: string[] };
function topic(input: QuestionInput): HealthQuestion {
  return { ...input, id: `glp1-${input.slug}-v1`, reviewStatus: 'pending', sourceVerification: 'verified', sourceIds: [...new Set(input.sourceNotes.map(note => note.sourceId))], caveats: [educationCaveat, ...(input.caveats ?? [])] };
}

export const glp1Questions: HealthQuestion[] = [
  topic({
    slug: 'works', title: 'How GLP-1 works', category: 'THE BIOLOGY',
    question: 'GLP-1 is a naturally occurring hormone. Myth or fact?', choices: ['Myth', 'Fact'], correctIndex: 1, answerLabel: 'Fact. It starts with a natural messenger.',
    shortExplanation: 'GLP-1 is a hormone, a chemical messenger, made by gut cells especially after eating. It contributes to blood-glucose regulation and appetite signalling.',
    detailedExplanation: 'A receptor is a structure that responds to a particular signal. Some prescription medicines activate GLP-1 receptors and act longer than the natural hormone. Their effects and clinical use are distinct from the body’s brief GLP-1 signals.',
    keyTakeaway: 'GLP-1 is one messenger in a wider system. Natural GLP-1 and prescription treatments acting on its pathway are related, but different.',
    visual: 'organs', visualPrompt: 'Tap a structure to follow one connection.',
    nodes: [
      { label: 'Gut', explanation: 'Specialised gut cells release GLP-1, particularly in response to food.' },
      { label: 'Pancreas', explanation: 'GLP-1 can enhance insulin release when blood glucose is elevated. Insulin is a hormone involved in regulating blood glucose.' },
      { label: 'Brain', explanation: 'GLP-1 participates in appetite-related pathways alongside other signals. It does not control all hunger.' },
    ],
    caveats: ['Selected relationships in a simplified illustration, not exclusive pathways or a physiological simulation.'],
    sourceNotes: [
      { sourceId: 'glp1', supports: 'Gut-derived GLP-1, glucose-dependent insulin release and the distinction between natural hormone and longer-acting medicines.', limitation: 'A research history, not prescribing guidance or an exhaustive map of appetite.' },
      { sourceId: 'appetite', supports: 'Appetite-related signalling forms part of a broader gut–brain system.', limitation: 'A workshop summary does not predict an individual response.' },
    ],
    shareTitle: 'GLP-1 basics', shareText: 'GLP-1 is a natural gut hormone involved in glucose and appetite signalling. It is one part of a wider system.',
  }),
  topic({
    slug: 'safety', title: 'Safety and side effects', category: 'BENEFITS & RISKS',
    question: 'Can GLP-1-based prescription treatments have side effects?', choices: ['Yes', 'No'], correctIndex: 0, answerLabel: 'Yes. The specific medicine matters.',
    shortExplanation: 'Some medicines can cause nausea, vomiting, constipation or diarrhoea. Serious risks and precautions depend on the medicine and individual circumstances.',
    detailedExplanation: 'A clinician weighs potential benefits against risks, checks other medicines and plans monitoring. Complete safety information comes from the specific medicine’s current approved information and a qualified clinician or pharmacist.',
    keyTakeaway: 'An online challenge cannot establish safety. Medicine-specific information and clinical assessment matter.',
    visual: 'safety', visualPrompt: 'Open a card to see what a safety discussion includes.',
    nodes: [
      { label: 'Common side effects', explanation: 'Digestive effects can occur with some treatments. Their frequency and severity differ; this is not a complete side-effect list.' },
      { label: 'Important precautions', explanation: 'Relevant conditions, other medicines, allergies and pregnancy plans may affect prescribing. Contraindications are circumstances where a particular medicine should not be used; they are medicine-specific.' },
      { label: 'Why medical assessment matters', explanation: 'A qualified clinician considers medical history, benefits, risks, contraindications and follow-up. These cards do not evaluate anyone’s personal risk.' },
    ],
    caveats: [medicineCaveat, 'This general overview is not a full medicine safety guide or advice to start, change or stop treatment.'],
    sourceNotes: [
      { sourceId: 'medicineSafety', supports: 'Examples of digestive side effects, medicine-specific warnings and clinician review.', limitation: 'Semaglutide injection is one example, not a safety profile for every GLP-1-related medicine. No medicine is recommended here.' },
      { sourceId: 'treatmentOverview', supports: 'Benefits, harms, other medicines and health history are part of prescribing decisions.', limitation: 'A US overview; locally applicable medicine information must be checked.' },
    ],
    shareTitle: 'Safety needs context', shareText: 'Prescription medicines have benefits, risks and medicine-specific precautions. Individual clinical assessment matters.',
  }),
  topic({
    slug: 'muscle', title: 'Muscle and physical health', category: 'STRENGTH & FUNCTION',
    question: 'Can losing weight also involve losing some lean tissue?', choices: ['Yes', 'No'], correctIndex: 0, answerLabel: 'Yes. Health includes strength and function.',
    shortExplanation: 'Weight reduction can include changes in lean tissue, which includes muscle and other non-fat tissues. The amount varies between people.',
    detailedExplanation: 'Nutrition and activity support should be adapted to someone’s health, capacity and preferences. Lean-mass measurements do not directly measure strength or function. No one nutrition or activity plan guarantees muscle preservation.',
    keyTakeaway: 'Care considers strength, function and nourishment alongside weight. Individual support can matter.',
    visual: 'strength', visualPrompt: 'Tap a part of care to see how it can support physical health.',
    nodes: [
      { label: 'Nutrition', explanation: 'Adequate nourishment, including protein, can help support lean tissue. A qualified professional can adapt nutrition to individual needs.' },
      { label: 'Physical activity', explanation: 'Appropriate strength-building activity can support muscle and physical function. Activities should suit the person’s abilities and circumstances.' },
      { label: 'Clinical follow-up', explanation: 'Follow-up can review nourishment, strength and function as needs change. It considers more than body weight.' },
    ],
    caveats: ['These are general care concepts, not a protein target, exercise prescription or prediction of body composition.'],
    sourceNotes: [{ sourceId: 'nutritionAdvisory', supports: 'Lean-tissue changes, nutrition, strength-building activity and assessment of physical function during GLP-1 therapy.', limitation: 'A joint professional advisory, largely in a US context. Evidence and individual needs vary; it does not guarantee preservation of muscle.' }],
    shareTitle: 'Health includes strength', shareText: 'Physical health involves nourishment, strength and function. Individual nutrition, activity and professional support can matter.',
  }),
  topic({
    slug: 'stopping', title: 'What happens after stopping treatment', category: 'LONG-TERM CARE',
    question: 'Does stopping weight-management treatment always mean its effects will remain unchanged?', choices: ['Yes', 'No'], correctIndex: 1, answerLabel: 'No. A plan for ongoing care matters.',
    shortExplanation: 'Weight regain can follow withdrawal of some weight-management medicines. Responses differ, so longer-term care deserves discussion.',
    detailedExplanation: 'In the STEP 1 extension, a subgroup was followed after semaglutide and structured lifestyle support stopped. Weight regain was observed. This finding cannot predict one person’s outcome or the effect of stopping every medicine.',
    keyTakeaway: 'Discuss treatment changes and longer-term support with a clinician. Neither path shown here guarantees a weight outcome.',
    visual: 'paths', visualPrompt: 'Compare what each planning approach includes.',
    nodes: [
      { label: 'Without a follow-up plan', explanation: 'This leaves no planned opportunity to review changes or discuss support. The illustration makes no prediction about weight.' },
      { label: 'With ongoing clinical review', explanation: 'A long-term plan creates opportunities to review needs and discuss options. Ongoing review does not guarantee maintenance of treatment effects.' },
    ],
    caveats: ['The two paths illustrate planning, not trial groups, comparative evidence or predicted outcomes. Do not change a prescribed treatment based on this game.'],
    sourceNotes: [{ sourceId: 'withdrawalStudy', supports: 'Weight regain observed after withdrawal in the STEP 1 extension.', limitation: 'Exploratory follow-up of a trial subgroup; both medicine and structured lifestyle support stopped. Industry funded. No result is generalised to every medicine or person.' }],
    shareTitle: 'Think beyond a single step', shareText: 'Long-term metabolic care can involve ongoing review and planning. Treatment changes deserve a discussion with a qualified clinician.',
  }),
  topic({
    slug: 'beyond-diabetes', title: 'GLP-1 beyond diabetes', category: 'BIOLOGY & TREATMENTS',
    question: 'Are all GLP-1-related prescription treatments used exclusively for diabetes?', choices: ['Yes', 'No'], correctIndex: 1, answerLabel: 'No. Approved uses differ.',
    shortExplanation: 'Some GLP-1-related medicines have approved uses beyond type 2 diabetes. The use depends on the specific product and jurisdiction.',
    detailedExplanation: 'A hormone’s biological role is different from a prescription medicine’s approved indication, meaning its authorised use. Not every GLP-1-related product is approved for weight management. A clinician must check current local approvals and individual circumstances.',
    keyTakeaway: 'Related biology does not mean interchangeable prescriptions. Treatment fit requires a specific medicine and a clinical assessment.',
    visual: 'distinction', visualPrompt: 'Turn over each idea to separate biology from prescribing.',
    nodes: [
      { label: 'Natural GLP-1 hormone', explanation: 'A chemical messenger produced in the body. Its biological role is not a prescription or a treatment indication.' },
      { label: 'Prescription treatments', explanation: 'Medicines acting on GLP-1 pathways have product-specific approved uses. Suitability depends on local approval, medical history and clinical assessment.' },
    ],
    caveats: [medicineCaveat],
    sourceNotes: [
      { sourceId: 'treatmentOverview', supports: 'Some GLP-1-related medicines have weight-management indications in the US, while products and indications differ.', limitation: 'Not an Indian approval register. No claim of local availability or eligibility is made.' },
      { sourceId: 'glp1', supports: 'The relationship between hormone research and prescription receptor agonists.', limitation: 'Historical research context, not a current list of approved uses.' },
    ],
    shareTitle: 'Biology and medicines: a distinction', shareText: 'Natural GLP-1 and prescription treatments are related but different. Approved uses and suitability depend on the medicine, jurisdiction and clinical assessment.',
  }),
  topic({
    slug: 'assessment', title: 'Who decides whether treatment fits', category: 'INDIVIDUAL CARE',
    question: 'Can a short online quiz determine whether GLP-1 treatment is right for someone?', choices: ['Yes', 'No'], correctIndex: 1, answerLabel: 'No. That needs a clinical conversation.',
    shortExplanation: 'A qualified doctor considers health history, possible benefits and harms, alternatives and personal priorities before making a treatment plan together.',
    detailedExplanation: 'Assessment and follow-up can change the plan over time. There is no universal treatment fit, and choosing an educational topic does not indicate a condition or a need for medication.',
    keyTakeaway: 'Someone considering treatment can have an informed discussion with a qualified clinician. This game cannot establish eligibility.',
    visual: 'care', visualPrompt: 'Tap the stages of an individual care conversation.',
    nodes: [
      { label: 'Medical history', explanation: 'A clinician discusses relevant history and current medicines privately. No medical information is requested here.' },
      { label: 'Clinical assessment', explanation: 'The clinician reviews relevant health information, benefits, risks and alternatives.' },
      { label: 'Individual care plan', explanation: 'Decisions consider the person’s goals and circumstances, including options beyond medicines.' },
      { label: 'Follow-up', explanation: 'Ongoing review can assess response, tolerability and changing needs.' },
    ],
    caveats: ['This sequence describes care in general. It is not an assessment, eligibility checklist or instruction to seek a particular prescription.'],
    sourceNotes: [{ sourceId: 'treatmentOverview', supports: 'Individual prescribing decisions consider benefits, side effects, health history and ongoing response.', limitation: 'General US health information. The sequence is illustrative, not a clinical protocol or an Indian eligibility rule.' }],
    shareTitle: 'Care starts with a conversation', shareText: 'A short quiz cannot determine treatment fit. Qualified clinical assessment considers individual needs, benefits, risks and alternatives.',
  }),
];

export function getHealthQuestion(value: string | null): HealthQuestion | undefined { return glp1Questions.find(question => question.slug === value); }
export function glp1Path(topicId?: HealthTopicId, view?: 'library' | 'share') {
  const params = new URLSearchParams();
  if (view) params.set('view', view);
  if (topicId) params.set('topic', topicId);
  return `/learn/glp1${params.size ? `?${params}` : ''}`;
}
export const glp1Copy = {
  adStatement: 'GLP-1 is a naturally occurring hormone.',
  intro: steerProgrammeDescription,
  scope: 'General education for adults. No diagnosis, treatment eligibility or health score.',
  illustration: 'Simplified educational illustration. Selected concepts, not a clinical simulation.',
};
