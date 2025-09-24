"use server";

import { apiRequest } from "../api-request";
import { API_ROUTES } from "../routes";
import {
  siteSearchData,
  createStoreItem,
  type SiteSearchItem,
} from "./site-search-data";

// Fuzzy search function
function fuzzySearch(str: string, pattern: string): boolean {
  const string = str.toLowerCase();
  pattern = pattern.toLowerCase();

  let patternIdx = 0;
  let strIdx = 0;

  while (strIdx < string.length && patternIdx < pattern.length) {
    if (string[strIdx] === pattern[patternIdx]) {
      patternIdx++;
    }
    strIdx++;
  }

  return patternIdx === pattern.length;
}

// Calculate relevance score
function calculateRelevance(item: SiteSearchItem, searchTerm: string): number {
  let score = 0;
  const term = searchTerm.toLowerCase();

  // Exact matches in title (highest priority)
  if (item.title.toLowerCase().includes(term)) score += 100;
  if (item.title.toLowerCase() === term) score += 150;

  // Fuzzy matches in title
  if (fuzzySearch(item.title, term)) score += 50;

  // Matches in description
  if (item.description.toLowerCase().includes(term)) score += 30;

  // Matches in keywords
  if (item.keywords.some((keyword) => keyword.toLowerCase().includes(term)))
    score += 20;
  if (item.keywords.some((keyword) => fuzzySearch(keyword, term))) score += 10;

  return score;
}

export async function searchSite(query: string): Promise<SiteSearchItem[]> {
  if (!query) return [createStoreItem];

  const searchTerm = query.toLowerCase();

  // Get matching items with their relevance scores
  const results = siteSearchData
    .map((item) => ({
      item,
      score: calculateRelevance(item, searchTerm),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, 7); // Limit to 7 results to make room for createStoreItem

  // Always include createStoreItem if it's not already in results
  if (!results.find((item) => item.path === createStoreItem.path)) {
    results.unshift(createStoreItem);
  }

  return results;
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  message: string;
}) {
  return apiRequest<void>(API_ROUTES.contact, {
    method: "POST",
    data: formData,
  });
}
