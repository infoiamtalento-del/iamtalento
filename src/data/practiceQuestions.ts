export interface PracticeQuestion {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type PracticeMode = "demo" | "practice" | "mock";

export const MODE_CONFIG: Record<
  PracticeMode,
  { label: string; count: number; minutes: number | null; feedback: "instant" | "end"; text: string }
> = {
  demo: {
    label: "Demo test",
    count: 3,
    minutes: null,
    feedback: "instant",
    text: "Try the question format with no timer and instant answers.",
  },
  practice: {
    label: "Practice test",
    count: 5,
    minutes: null,
    feedback: "instant",
    text: "Untimed questions with an explanation after every answer.",
  },
  mock: {
    label: "Mock test",
    count: 5,
    minutes: 8,
    feedback: "end",
    text: "Timed exam conditions. Review every answer when you finish.",
  },
};

const q = (prompt: string, options: string[], answer: number, explanation: string): PracticeQuestion => ({
  prompt,
  options,
  answer,
  explanation,
});

/** Practice bank keyed by sub-domain id (see subDomains.ts). */
export const PRACTICE_BANK: Record<string, PracticeQuestion[]> = {
  seo: [
    q("Which file tells search engine crawlers which parts of a site they may crawl?", ["sitemap.xml", "robots.txt", ".htaccess", "manifest.json"], 1, "robots.txt sets crawl rules. A sitemap only lists URLs you want discovered."),
    q("A page has duplicate content under two URLs. What is the best signal to consolidate ranking?", ["noindex both", "rel=canonical to the preferred URL", "Add more keywords", "Block with robots.txt"], 1, "A canonical tag tells search engines which version to index and rank."),
    q("Which metric in Search Console shows how often your page appeared in results?", ["Clicks", "Impressions", "Position", "CTR"], 1, "Impressions count appearances in search results, whether or not users click."),
    q("Which is the strongest off-page ranking signal?", ["Number of social likes", "Relevant editorial backlinks", "Meta keywords tag", "Page word count"], 1, "Relevant links from authoritative sites remain a core ranking signal."),
    q("A page loads slowly because of large hero images. Which fix helps Largest Contentful Paint most?", ["Compress and serve modern formats", "Add more JavaScript", "Increase font size", "Remove alt text"], 0, "Optimised, appropriately sized images reduce LCP directly."),
  ],
  "google-ads": [
    q("Which bid strategy optimises for conversions at a target cost per action?", ["Manual CPC", "Target CPA", "Maximise clicks", "Target impression share"], 1, "Target CPA uses conversion data to hit an average cost per acquisition."),
    q("Which match type shows ads for searches that include the exact meaning of the keyword, in any order?", ["Broad match", "Phrase match", "Exact match", "Negative match"], 1, "Phrase match reaches queries that contain the keyword meaning, with extra words allowed."),
    q("Quality Score is NOT based on which factor?", ["Expected CTR", "Ad relevance", "Landing page experience", "Account age"], 3, "Quality Score uses expected CTR, ad relevance and landing page experience."),
    q("What is the main purpose of negative keywords?", ["Increase bids", "Prevent irrelevant searches triggering ads", "Add new audiences", "Boost Quality Score directly"], 1, "Negative keywords stop spend on irrelevant queries."),
    q("Which conversion setup is needed to measure purchases accurately?", ["Page view tag only", "Conversion tracking with value", "Remarketing list", "Call extension"], 1, "Conversion tracking with values lets bidding optimise for revenue."),
  ],
  "meta-ads": [
    q("Which tool shares website events with Meta to improve attribution after iOS privacy changes?", ["Conversions API", "Audience Network", "Boosted posts", "Page Insights"], 0, "Conversions API sends events server-side and complements the Pixel."),
    q("Which audience type is built from people who already engaged with you?", ["Lookalike", "Custom Audience", "Broad targeting", "Interest targeting"], 1, "Custom Audiences use your own data or engagement."),
    q("An ad set stays in the learning phase. What usually helps exit it?", ["Edit it daily", "Get about 50 optimisation events per week", "Add many ad sets", "Lower the budget to zero"], 1, "Meta typically needs around 50 events per week to stabilise delivery."),
    q("Best way to test two creatives fairly?", ["Run them in separate campaigns with different budgets", "Use an A/B test with one variable changed", "Change audience and creative together", "Pick based on likes only"], 1, "Change one variable at a time to learn what drove the difference."),
    q("Which metric best shows creative fatigue?", ["Rising frequency with falling CTR", "Rising reach", "Falling CPM", "More impressions"], 0, "High frequency with declining CTR signals people are tired of the ad."),
  ],
  analytics: [
    q("In GA4, what is the basic unit of data collection?", ["Session", "Pageview", "Event", "Hit"], 2, "GA4 is event-based; sessions and pageviews are events or derived from them."),
    q("Which attribution model gives all credit to the last touchpoint?", ["Linear", "Last click", "Time decay", "Position based"], 1, "Last click credits the final interaction before conversion."),
    q("Which report shows where users drop off between steps?", ["Funnel exploration", "Realtime", "Demographics", "Tech overview"], 0, "Funnel exploration visualises step-by-step drop-off."),
    q("What does a high bounce rate in GA4 (engagement rate low) most likely indicate?", ["Users engaged for 10+ seconds", "Users left without meaningful engagement", "Users purchased", "Tracking is off"], 1, "Bounce rate is the inverse of engagement rate."),
    q("Which UTM parameter identifies the traffic medium such as email or cpc?", ["utm_source", "utm_medium", "utm_campaign", "utm_term"], 1, "utm_medium describes the marketing channel type."),
  ],
  content: [
    q("What is the primary purpose of an editorial calendar?", ["Track budget only", "Plan and schedule content consistently", "Replace SEO", "Store images"], 1, "It coordinates topics, owners and dates."),
    q("Which content best serves a prospect in the consideration stage?", ["Brand story video", "Comparison guide or case study", "Job posting", "Press release"], 1, "Consideration content helps evaluate options."),
    q("Which metric best shows content is attracting qualified readers?", ["Raw page views", "Engaged time and conversions", "Word count", "Number of posts"], 1, "Engagement and conversion reflect quality, not volume."),
    q("What does repurposing content mean?", ["Deleting old posts", "Adapting one asset into multiple formats", "Copying competitors", "Buying backlinks"], 1, "One webinar can become clips, a blog and a checklist."),
    q("A strong headline mainly should do what?", ["Include every keyword", "Promise a clear, relevant benefit", "Be as long as possible", "Avoid numbers"], 1, "Clear benefit and relevance drive clicks."),
  ],
  email: [
    q("Which practice most improves deliverability?", ["Buying lists", "Authenticating with SPF, DKIM and DMARC", "All-caps subject lines", "Sending daily to everyone"], 1, "Authentication builds sender reputation."),
    q("What is segmentation?", ["Sending to everyone", "Grouping subscribers by behaviour or attributes", "Removing images", "Using one template"], 1, "Segments allow relevant, targeted messaging."),
    q("Which metric is least reliable after Apple Mail Privacy Protection?", ["Click rate", "Open rate", "Conversion rate", "Unsubscribe rate"], 1, "Apple pre-loads images, inflating opens."),
    q("What is a welcome flow?", ["A one-off newsletter", "Automated emails triggered by sign-up", "A spam filter", "A pop-up"], 1, "It introduces the brand right after subscription."),
    q("When running an A/B test on subject lines, you should:", ["Change subject and offer together", "Test one variable on a random split", "Send variant A to VIPs only", "Stop after 10 sends"], 1, "Random split and one variable gives a valid result."),
  ],
  smm: [
    q("Which metric best measures how many unique people saw a post?", ["Impressions", "Reach", "Engagement", "Clicks"], 1, "Reach counts unique accounts; impressions count total views."),
    q("What is the best use of a content pillar?", ["Reduce posting", "Give consistent themes aligned to goals", "Increase hashtags", "Avoid video"], 1, "Pillars keep content focused and recognisable."),
    q("A brand wants B2B thought leadership. Which platform is most suitable?", ["LinkedIn", "Snapchat", "Pinterest", "Twitch"], 0, "LinkedIn reaches professional decision makers."),
    q("What is user-generated content mainly good for?", ["Social proof and authenticity", "Replacing analytics", "Reducing ad spend to zero", "SEO schema"], 0, "UGC builds trust through real customers."),
    q("A post gets many likes but no clicks. What should you review first?", ["Call to action and link placement", "Profile photo", "Posting time only", "Competitor followers"], 0, "Engagement without clicks often means a weak or hidden CTA."),
  ],
  cro: [
    q("What should a valid A/B test have before declaring a winner?", ["One visitor per variant", "Statistical significance and enough sample", "A longer headline", "Only mobile users"], 1, "Reliable results need adequate sample and significance."),
    q("Which tool best reveals where users click and scroll?", ["Heatmaps", "Sitemaps", "Robots files", "CDN logs"], 0, "Heatmaps show attention and interaction patterns."),
    q("Which change most directly reduces form friction?", ["More fields", "Fewer, clearer fields", "Smaller button", "Remove labels"], 1, "Each extra field typically lowers completion."),
    q("What is a hypothesis in CRO?", ["A random idea", "A testable statement linking a change to an expected outcome", "A final report", "A traffic goal"], 1, "Good tests state the change, the reason and the metric."),
    q("Conversion rate is calculated as:", ["Visitors / conversions", "Conversions / visitors", "Clicks / impressions", "Revenue / sessions"], 1, "Conversion rate = conversions divided by visitors."),
  ],
};

/** Fallback so every sub-domain in the catalogue opens something useful. */
export const FALLBACK_QUESTIONS: PracticeQuestion[] = [
  q("What is the first step before building a plan for a new project?", ["Start executing", "Define the goal and success metric", "Hire more people", "Pick tools"], 1, "A clear goal and metric guide every later decision."),
  q("A key metric drops suddenly. What should you do first?", ["Ignore it", "Verify data quality, then segment the change", "Change strategy immediately", "Blame the tool"], 1, "Rule out tracking issues, then find where the change occurred."),
  q("Which best describes prioritisation?", ["Doing the easiest task", "Ordering work by impact and effort", "Doing tasks alphabetically", "Delegating everything"], 1, "Impact versus effort is a standard prioritisation lens."),
  q("How do you communicate results to a non-technical stakeholder?", ["Share raw data", "Lead with the insight and recommended action", "Use jargon", "Send a long thread"], 1, "Insight first, detail on request."),
  q("What does iteration mean?", ["Repeating without change", "Improving through repeated test and learn cycles", "Stopping after launch", "Copying others"], 1, "Each cycle uses results to improve the next one."),
];

export const getPracticeQuestions = (subDomainId: string, mode: PracticeMode): PracticeQuestion[] => {
  const bank = PRACTICE_BANK[subDomainId] ?? FALLBACK_QUESTIONS;
  return bank.slice(0, MODE_CONFIG[mode].count);
};

/** Payment handoff between the detail page and the post-payment pages. */
export const cartKey = (assessmentId: string) => `tq_paid_${assessmentId}`;

export interface PaidOrder {
  orderId: string;
  subDomainIds: string[];
  total: number;
  paidAt: number;
}

export const savePaidOrder = (assessmentId: string, order: PaidOrder) =>
  sessionStorage.setItem(cartKey(assessmentId), JSON.stringify(order));

export const loadPaidOrder = (assessmentId: string): PaidOrder | null => {
  try {
    const raw = sessionStorage.getItem(cartKey(assessmentId));
    return raw ? (JSON.parse(raw) as PaidOrder) : null;
  } catch {
    return null;
  }
};
