import type {
  ArticleSeed,
  AuthorSeed,
  CategorySeed,
  IndustrySeed,
  ServiceSeed,
} from '@/seed/types'

// --- Services -------------------------------------------------------------
import webDesign from './services/web-design'
import webDevelopment from './services/web-development'
import ecommerce from './services/ecommerce'
import websiteMaintenance from './services/website-maintenance'
import seo from './services/seo'
import localSeo from './services/local-seo'
import googleAds from './services/google-ads'
import metaAds from './services/meta-ads'
import conversionOptimization from './services/conversion-optimization'
import aiAutomation from './services/ai-automation'
import crmSystems from './services/crm-systems'
import branding from './services/branding'

// --- Industries -----------------------------------------------------------
import lawFirms from './industries/law-firms'
import medical from './industries/medical'
import dental from './industries/dental'
import realEstate from './industries/real-estate'
import homeServices from './industries/home-services'
import professionalServices from './industries/professional-services'
import b2b from './industries/b2b'
import ecommerceBrands from './industries/ecommerce-brands'

// --- Articles -------------------------------------------------------------
import businessWebsiteCost from './articles/business-website-cost'
import localSeoChecklist from './articles/local-seo-checklist'
import getCitedByAiSearch from './articles/get-cited-by-ai-search'
import aiLeadQualification from './articles/ai-lead-qualification'
import websiteCostingYouRevenue from './articles/website-costing-you-revenue'
import googleAdsVsSeo from './articles/google-ads-vs-seo'
import coreWebVitalsRevenue from './articles/core-web-vitals-revenue'
import leadToRevenueSystem from './articles/lead-to-revenue-system'

// Editorial batch, converted by scripts/convert-articles.ts.
import completeAiMarketingGuide from './articles/complete-ai-marketing-guide'
import completeB2bMarketingGuide from './articles/complete-b2b-marketing-guide'
import completeContentMarketingGuide from './articles/complete-content-marketing-guide'
import completeConversionRateOptimizationGuide from './articles/complete-conversion-rate-optimization-guide'
import completeDigitalMarketingGuide from './articles/complete-digital-marketing-guide'
import completeGeoGuide from './articles/complete-geo-guide'
import completeLeadGenerationGuide from './articles/complete-lead-generation-guide'
import completeLocalSeoGuide from './articles/complete-local-seo-guide'
import completeMarketingAnalyticsGuide from './articles/complete-marketing-analytics-guide'
import completeMarketingAutomationGuide from './articles/complete-marketing-automation-guide'
import completeMarketingGuideSmallBusiness from './articles/complete-marketing-guide-small-business'
import completeSeoGuide from './articles/complete-seo-guide'
import completeSocialMediaMarketingGuide from './articles/complete-social-media-marketing-guide'
import completeWebsiteStrategyDevelopmentGuide from './articles/complete-website-strategy-development-guide'
import googleAdsVsFacebookAdsVsSeo from './articles/google-ads-vs-facebook-ads-vs-seo'
import howMuchDoesDigitalMarketingCost from './articles/how-much-does-digital-marketing-cost'
import howMuchDoesGoogleAdsCost from './articles/how-much-does-google-ads-cost'
import howToBuildADigitalMarketingStrategy from './articles/how-to-build-a-digital-marketing-strategy'
import optimizeYourBusinessForAiSearch from './articles/optimize-your-business-for-ai-search'
import seoVsGeoVsAeo from './articles/seo-vs-geo-vs-aeo'
import websiteLeadGenerationMachine from './articles/website-lead-generation-machine'

/**
 * Service order is the display order across the site. Grouped by category so
 * the mega menu, service hub and sitemap all read consistently.
 */
export const services: ServiceSeed[] = [
  webDesign,
  webDevelopment,
  ecommerce,
  websiteMaintenance,
  seo,
  localSeo,
  googleAds,
  metaAds,
  conversionOptimization,
  aiAutomation,
  crmSystems,
  branding,
]

export const industries: IndustrySeed[] = [
  lawFirms,
  medical,
  dental,
  realEstate,
  homeServices,
  professionalServices,
  b2b,
  ecommerceBrands,
]

/** Newest first. The seed script does not re-sort, so keep this ordered. */
export const articles: ArticleSeed[] = [
  leadToRevenueSystem,
  aiLeadQualification,
  coreWebVitalsRevenue,
  getCitedByAiSearch,
  googleAdsVsSeo,
  localSeoChecklist,
  businessWebsiteCost,
  websiteCostingYouRevenue,

  // Editorial batch.
  completeAiMarketingGuide,
  completeB2bMarketingGuide,
  completeContentMarketingGuide,
  completeConversionRateOptimizationGuide,
  completeDigitalMarketingGuide,
  completeGeoGuide,
  completeLeadGenerationGuide,
  completeLocalSeoGuide,
  completeMarketingAnalyticsGuide,
  completeMarketingAutomationGuide,
  completeMarketingGuideSmallBusiness,
  completeSeoGuide,
  completeSocialMediaMarketingGuide,
  completeWebsiteStrategyDevelopmentGuide,
  googleAdsVsFacebookAdsVsSeo,
  howMuchDoesDigitalMarketingCost,
  howMuchDoesGoogleAdsCost,
  howToBuildADigitalMarketingStrategy,
  optimizeYourBusinessForAiSearch,
  seoVsGeoVsAeo,
  websiteLeadGenerationMachine,
]

export const categories: CategorySeed[] = [
  {
    slug: 'seo',
    title: 'SEO & AI Search',
    description:
      'Technical SEO, local search, entity architecture and visibility inside AI answer engines.',
  },
  {
    slug: 'ai-automation',
    title: 'AI & Automation',
    description:
      'Practical AI implementation, lead qualification, CRM automation and workflow systems that reduce cost to serve.',
  },
  {
    slug: 'web-design',
    title: 'Web Design & Development',
    description:
      'Design, engineering and performance decisions that determine whether a website earns its budget back.',
  },
  {
    slug: 'paid-media',
    title: 'Paid Media',
    description:
      'Google Ads, Meta Ads, measurement accuracy and the unit economics of buying attention.',
  },
  {
    slug: 'growth',
    title: 'Growth Strategy',
    description:
      'Systems thinking for revenue: how brand, traffic, conversion, CRM and automation compound together.',
  },
]

export const authors: AuthorSeed[] = [
  {
    slug: 'digital-kingz',
    name: 'Digital Kingz',
    role: 'Growth Systems Team',
    bio: 'Digital Kingz builds digital systems that connect brand, website, search, conversion, CRM and automation into a single revenue engine. We work with owners and operators on the commercial architecture behind their digital presence, not just the marketing on top of it.',
  },
]
