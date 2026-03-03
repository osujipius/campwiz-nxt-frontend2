export const CampaignType = {
    Categorization: 'categorization',
    COMMONS: 'commons',
    WIKIPEDIA: 'wikipedia',
    WIKIDATA: 'wikidata',
    REFERENCE: 'reference',
} as const;

export type CampaignType = typeof CampaignType[keyof typeof CampaignType];
