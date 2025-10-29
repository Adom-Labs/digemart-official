// Address autocomplete and suggestion utilities

export interface AddressSuggestion {
  id: string;
  displayText: string;
  fullAddress: string;
  components: {
    streetNumber?: string;
    streetName?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  confidence: number; // 0-1 score
}

export interface AutocompleteOptions {
  country?: string;
  maxResults?: number;
  includePostalCode?: boolean;
  types?: ("address" | "establishment" | "geocode")[];
}

/**
 * Mock address autocomplete service
 * In production, this would integrate with Google Places API, Mapbox, or similar
 */
export class AddressAutocompleteService {
  private static instance: AddressAutocompleteService;
  private cache = new Map<string, AddressSuggestion[]>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): AddressAutocompleteService {
    if (!AddressAutocompleteService.instance) {
      AddressAutocompleteService.instance = new AddressAutocompleteService();
    }
    return AddressAutocompleteService.instance;
  }

  /**
   * Get address suggestions based on input text
   */
  async getSuggestions(
    input: string,
    options: AutocompleteOptions = {}
  ): Promise<AddressSuggestion[]> {
    const {
      country = "US",
      maxResults = 5,
      includePostalCode = true,
      types = ["address"],
    } = options;

    if (input.length < 3) {
      return [];
    }

    const cacheKey = `${input}-${country}-${maxResults}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Mock suggestions based on input
      const suggestions = this.generateMockSuggestions(
        input,
        country,
        maxResults
      );

      // Cache results
      this.cache.set(cacheKey, suggestions);
      setTimeout(() => this.cache.delete(cacheKey), this.CACHE_DURATION);

      return suggestions;
    } catch (error) {
      console.error("Address autocomplete error:", error);
      return [];
    }
  }

  /**
   * Get detailed address information for a suggestion
   */
  async getAddressDetails(
    suggestionId: string
  ): Promise<AddressSuggestion | null> {
    // In production, this would make a detailed API call
    // For now, return mock data
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      id: suggestionId,
      displayText: "123 Main Street, New York, NY 10001",
      fullAddress: "123 Main Street, New York, NY 10001, USA",
      components: {
        streetNumber: "123",
        streetName: "Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "US",
      },
      confidence: 0.95,
    };
  }

  /**
   * Validate and geocode an address
   */
  async validateAddress(
    address: string,
    country: string = "US"
  ): Promise<{
    isValid: boolean;
    suggestion?: AddressSuggestion;
    corrections?: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock validation logic
    const isValid = address.length > 10 && /\d/.test(address);

    if (!isValid) {
      return {
        isValid: false,
        corrections: [
          "Address should include a street number",
          "Address seems incomplete",
        ],
      };
    }

    return {
      isValid: true,
      suggestion: {
        id: "validated-" + Date.now(),
        displayText: address,
        fullAddress: address + `, ${country}`,
        components: this.parseAddress(address, country),
        confidence: 0.85,
      },
    };
  }

  /**
   * Generate mock suggestions for development/testing
   */
  private generateMockSuggestions(
    input: string,
    country: string,
    maxResults: number
  ): AddressSuggestion[] {
    const mockData = this.getMockAddressData(country);
    const inputLower = input.toLowerCase();

    const matches = mockData
      .filter(
        (addr) =>
          addr.displayText.toLowerCase().includes(inputLower) ||
          addr.components.streetName?.toLowerCase().includes(inputLower) ||
          addr.components.city.toLowerCase().includes(inputLower)
      )
      .slice(0, maxResults)
      .map((addr) => ({
        ...addr,
        confidence: this.calculateConfidence(input, addr.displayText),
      }))
      .sort((a, b) => b.confidence - a.confidence);

    return matches;
  }

  /**
   * Calculate confidence score for a suggestion
   */
  private calculateConfidence(input: string, suggestion: string): number {
    const inputLower = input.toLowerCase();
    const suggestionLower = suggestion.toLowerCase();

    if (suggestionLower.startsWith(inputLower)) {
      return 0.9;
    } else if (suggestionLower.includes(inputLower)) {
      return 0.7;
    } else {
      // Calculate Levenshtein distance for fuzzy matching
      const distance = this.levenshteinDistance(inputLower, suggestionLower);
      const maxLength = Math.max(inputLower.length, suggestionLower.length);
      return Math.max(0, 1 - distance / maxLength);
    }
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Parse address string into components
   */
  private parseAddress(
    address: string,
    country: string
  ): AddressSuggestion["components"] {
    // Simple parsing logic - in production, use a proper address parser
    const parts = address.split(",").map((part) => part.trim());

    return {
      streetName: parts[0] || "",
      city: parts[1] || "",
      state: parts[2] || "",
      postalCode: parts[3] || "",
      country: country,
    };
  }

  /**
   * Get mock address data for different countries
   */
  private getMockAddressData(country: string): AddressSuggestion[] {
    const mockAddresses: Record<string, AddressSuggestion[]> = {
      US: [
        {
          id: "1",
          displayText: "123 Main Street, New York, NY 10001",
          fullAddress: "123 Main Street, New York, NY 10001, USA",
          components: {
            streetNumber: "123",
            streetName: "Main Street",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "US",
          },
          confidence: 0.9,
        },
        {
          id: "2",
          displayText: "456 Oak Avenue, Los Angeles, CA 90210",
          fullAddress: "456 Oak Avenue, Los Angeles, CA 90210, USA",
          components: {
            streetNumber: "456",
            streetName: "Oak Avenue",
            city: "Los Angeles",
            state: "CA",
            postalCode: "90210",
            country: "US",
          },
          confidence: 0.9,
        },
        {
          id: "3",
          displayText: "789 Pine Road, Chicago, IL 60601",
          fullAddress: "789 Pine Road, Chicago, IL 60601, USA",
          components: {
            streetNumber: "789",
            streetName: "Pine Road",
            city: "Chicago",
            state: "IL",
            postalCode: "60601",
            country: "US",
          },
          confidence: 0.9,
        },
        {
          id: "4",
          displayText: "321 Elm Street, Houston, TX 77001",
          fullAddress: "321 Elm Street, Houston, TX 77001, USA",
          components: {
            streetNumber: "321",
            streetName: "Elm Street",
            city: "Houston",
            state: "TX",
            postalCode: "77001",
            country: "US",
          },
          confidence: 0.9,
        },
        {
          id: "5",
          displayText: "654 Maple Drive, Phoenix, AZ 85001",
          fullAddress: "654 Maple Drive, Phoenix, AZ 85001, USA",
          components: {
            streetNumber: "654",
            streetName: "Maple Drive",
            city: "Phoenix",
            state: "AZ",
            postalCode: "85001",
            country: "US",
          },
          confidence: 0.9,
        },
      ],
      CA: [
        {
          id: "ca1",
          displayText: "123 Queen Street, Toronto, ON M5H 2M9",
          fullAddress: "123 Queen Street, Toronto, ON M5H 2M9, Canada",
          components: {
            streetNumber: "123",
            streetName: "Queen Street",
            city: "Toronto",
            state: "ON",
            postalCode: "M5H 2M9",
            country: "CA",
          },
          confidence: 0.9,
        },
        {
          id: "ca2",
          displayText: "456 Granville Street, Vancouver, BC V6C 1V5",
          fullAddress: "456 Granville Street, Vancouver, BC V6C 1V5, Canada",
          components: {
            streetNumber: "456",
            streetName: "Granville Street",
            city: "Vancouver",
            state: "BC",
            postalCode: "V6C 1V5",
            country: "CA",
          },
          confidence: 0.9,
        },
      ],
      GB: [
        {
          id: "gb1",
          displayText: "10 Downing Street, London SW1A 2AA",
          fullAddress: "10 Downing Street, London SW1A 2AA, United Kingdom",
          components: {
            streetNumber: "10",
            streetName: "Downing Street",
            city: "London",
            state: "England",
            postalCode: "SW1A 2AA",
            country: "GB",
          },
          confidence: 0.9,
        },
      ],
    };

    return mockAddresses[country] || mockAddresses.US;
  }
}

/**
 * Hook for using address autocomplete in React components
 */
export function useAddressAutocomplete() {
  const service = AddressAutocompleteService.getInstance();

  const getSuggestions = async (
    input: string,
    options?: AutocompleteOptions
  ): Promise<AddressSuggestion[]> => {
    return service.getSuggestions(input, options);
  };

  const validateAddress = async (address: string, country?: string) => {
    return service.validateAddress(address, country);
  };

  const getAddressDetails = async (suggestionId: string) => {
    return service.getAddressDetails(suggestionId);
  };

  return {
    getSuggestions,
    validateAddress,
    getAddressDetails,
  };
}

/**
 * Utility function to format address for display
 */
export function formatAddressDisplay(suggestion: AddressSuggestion): string {
  const { components } = suggestion;
  const parts = [];

  if (components.streetNumber && components.streetName) {
    parts.push(`${components.streetNumber} ${components.streetName}`);
  } else if (components.streetName) {
    parts.push(components.streetName);
  }

  if (components.city) {
    parts.push(components.city);
  }

  if (components.state) {
    parts.push(components.state);
  }

  if (components.postalCode) {
    parts.push(components.postalCode);
  }

  return parts.join(", ");
}

/**
 * Extract components from a formatted address string
 */
export function parseAddressString(
  addressString: string
): Partial<AddressSuggestion["components"]> {
  // Simple parsing - in production, use a more sophisticated parser
  const parts = addressString.split(",").map((part) => part.trim());

  const components: Partial<AddressSuggestion["components"]> = {};

  if (parts.length >= 1) {
    const streetPart = parts[0];
    const streetMatch = streetPart.match(/^(\d+)\s+(.+)$/);
    if (streetMatch) {
      components.streetNumber = streetMatch[1];
      components.streetName = streetMatch[2];
    } else {
      components.streetName = streetPart;
    }
  }

  if (parts.length >= 2) {
    components.city = parts[1];
  }

  if (parts.length >= 3) {
    const statePostalPart = parts[2];
    const statePostalMatch = statePostalPart.match(/^([A-Z]{2})\s+(.+)$/);
    if (statePostalMatch) {
      components.state = statePostalMatch[1];
      components.postalCode = statePostalMatch[2];
    } else {
      components.state = statePostalPart;
    }
  }

  if (parts.length >= 4) {
    components.postalCode = parts[3];
  }

  return components;
}
