// Checked against steerclub.com on 18 October 2026. Public-site alignment is not brand approval.
export const steerProgrammeDescription = "Steer is a doctor-led metabolic-health programme for adults in India that combines medical assessment, personalised lifestyle guidance and ongoing support.";

export const scientificContent = {
  title: 'Some of the most important signals are invisible.',
  takeaway: 'Your gut and brain communicate through nerves and hormones that help regulate hunger and fullness.',
  detail: 'As you eat, your digestive system sends signals that help your brain respond to food. Appetite is shaped by biology as well as sleep, routines and your environment.',
  analogy: 'The missing object is a visual analogy. This puzzle does not measure or diagnose your metabolic health.',
  reviewStatus: 'Educational content · Pending clinical review',
  source: { title: 'NIDDK · Your Digestive System & How It Works', url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works' },
  steer: steerProgrammeDescription,
};

// Sources support educational statements; citations do not mean clinical approval.
export const scienceSources = {
  heart: { title: 'NHLBI · How the heart works', url: 'https://www.nhlbi.nih.gov/health/heart' },
  cells: { title: 'MedlinePlus Genetics · What is a cell?', url: 'https://medlineplus.gov/genetics/understanding/basics/cell/' },
  steerProgramme: { title: 'Steer · Public programme information (brand approval pending)', url: 'https://steerclub.com/' },
  treatmentOverview: {
    title: 'NIDDK · Prescription medications to treat overweight and obesity',
    url: 'https://www.niddk.nih.gov/health-information/weight-management/prescription-medications-treat-overweight-obesity',
  },
  medicineSafety: {
    title: 'MedlinePlus / ASHP · Semaglutide injection: medicine-specific information',
    url: 'https://medlineplus.gov/druginfo/meds/a618008.html',
  },
  nutritionAdvisory: {
    title: 'Obesity · Joint advisory on nutrition, physical function and GLP-1 therapy (2025)',
    url: 'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/oby.24336',
  },
  withdrawalStudy: {
    title: 'Diabetes, Obesity and Metabolism · STEP 1 trial extension (2022)',
    url: 'https://dom-pubs.onlinelibrary.wiley.com/doi/10.1111/dom.14725',
  },
  metabolism: {
    title: 'MedlinePlus · Metabolism',
    url: 'https://medlineplus.gov/ency/article/002257.htm',
  },
  glucose: {
    title: 'NIDDK · Blood glucose and insulin (What Is Diabetes?)',
    url: 'https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes',
  },
  assessment: {
    title: 'NHLBI · Metabolic syndrome: Diagnosis',
    url: 'https://www.nhlbi.nih.gov/health/metabolic-syndrome/diagnosis',
  },
  digestion: scientificContent.source,
  glp1: {
    title: 'NIDDK · Hormone research and GLP-1',
    url: 'https://www.niddk.nih.gov/news/archive/2021/story-discovery-medications-diabetes-obesity-emerged-research-pancreatic-hormone',
  },
  appetite: {
    title: 'NIDDK · Gut Feelings workshop (2024, PDF)',
    url: 'https://www.niddk.nih.gov/-/media/Files/News/Meetings/NIDDK-April-2024-Gut-Feelings-Executive-Summary-508.pdf',
  },
  sleep: {
    title: 'NHLBI · Sleep and your health',
    url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects',
  },
};
export type ScienceSourceId = keyof typeof scienceSources;

export const quizScienceContent = {
  reviewStatus: 'pending' as const,
  heading: 'Here’s something worth knowing.',
  takeaway: 'Your body’s appetite signals are more complex than they may seem. Hormones, daily routines and other factors all contribute.',
  glp1Explanation: 'GLP-1 is a hormone released by the gut that participates in blood-glucose regulation and appetite signalling. Some prescription treatments act on related pathways; suitability requires individual clinical assessment.',
  caveat: 'This quiz is educational. Your answers do not assess your health or determine whether any treatment is suitable for you. Medical decisions belong with qualified clinicians.',
  steer: steerProgrammeDescription,
  bridgeExplanations: {
    food: 'Food composition and signals between the gut and brain can both influence fullness. Responses vary between people and meals; a food quiz cannot assess your health.',
    gaming: 'Nerves and hormones carry biological signals that help regulate appetite. Game performance and reaction speed do not measure these processes or metabolic health.',
    entertainment: 'Appetite has several influences, including hormones, routines and environment. There is no single explanation for everyone’s hunger, and a story cannot diagnose it.',
    lifestyle: 'Sleep, meals, routines and biological signals can influence hunger. Individual experiences vary; a daily-life example cannot diagnose a health condition.',
    science: 'The gut and brain communicate through nerves and hormones that help regulate appetite. GLP-1 is one hormone involved in appetite and blood-glucose regulation.',
  },
};
