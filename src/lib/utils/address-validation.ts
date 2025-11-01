import { z } from "zod";

// Address validation schemas
export const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name too long"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long"),
  city: z.string().min(1, "City is required").max(50, "City name too long"),
  state: z
    .string()
    .min(1, "State/Province is required")
    .max(50, "State name too long"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z
    .string()
    .min(2, "Country is required")
    .max(2, "Invalid country code"),
  phone: z.string().optional(),
});

export type AddressData = z.infer<typeof addressSchema>;

// Country-specific postal code patterns
const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/, // 12345 or 12345-6789
  CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, // A1A 1A1 or A1A1A1
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // SW1A 1AA
  AU: /^\d{4}$/, // 1234
  DE: /^\d{5}$/, // 12345
  FR: /^\d{5}$/, // 12345
  IT: /^\d{5}$/, // 12345
  ES: /^\d{5}$/, // 12345
  NL: /^\d{4} ?[A-Z]{2}$/i, // 1234 AB
  BE: /^\d{4}$/, // 1234
  CH: /^\d{4}$/, // 1234
  AT: /^\d{4}$/, // 1234
  SE: /^\d{3} ?\d{2}$/, // 123 45
  NO: /^\d{4}$/, // 1234
  DK: /^\d{4}$/, // 1234
  FI: /^\d{5}$/, // 12345
  JP: /^\d{3}-?\d{4}$/, // 123-4567
  KR: /^\d{5}$/, // 12345
  SG: /^\d{6}$/, // 123456
  HK: /^[A-Z]{2}\d{4}$/i, // AB1234
  NZ: /^\d{4}$/, // 1234
  MX: /^\d{5}$/, // 12345
  BR: /^\d{5}-?\d{3}$/, // 12345-678
  AR: /^[A-Z]?\d{4}[A-Z]{3}$/i, // A1234ABC
  CL: /^\d{7}$/, // 1234567
  CO: /^\d{6}$/, // 123456
  PE: /^\d{5}$/, // 12345
  IN: /^\d{6}$/, // 123456
  CN: /^\d{6}$/, // 123456
  TH: /^\d{5}$/, // 12345
  MY: /^\d{5}$/, // 12345
  ID: /^\d{5}$/, // 12345
  PH: /^\d{4}$/, // 1234
  VN: /^\d{6}$/, // 123456
  ZA: /^\d{4}$/, // 1234
  EG: /^\d{5}$/, // 12345
  MA: /^\d{5}$/, // 12345
  KE: /^\d{5}$/, // 12345
  NG: /^\d{6}$/, // 123456
  GH: /^\d{5}$/, // 12345
};

// Phone number patterns by country
const PHONE_PATTERNS: Record<string, RegExp> = {
  US: /^(\+1)?[\s\-\.]?(\([0-9]{3}\)|[0-9]{3})[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/,
  CA: /^(\+1)?[\s\-\.]?(\([0-9]{3}\)|[0-9]{3})[\s\-\.]?[0-9]{3}[\s\-\.]?[0-9]{4}$/,
  GB: /^(\+44)?[\s\-\.]?[0-9]{10,11}$/,
  AU: /^(\+61)?[\s\-\.]?[0-9]{9,10}$/,
  DE: /^(\+49)?[\s\-\.]?[0-9]{10,12}$/,
  FR: /^(\+33)?[\s\-\.]?[0-9]{9,10}$/,
  // Add more patterns as needed
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface AddressValidationOptions {
  validatePostalCode?: boolean;
  validatePhone?: boolean;
  suggestCorrections?: boolean;
  strictValidation?: boolean;
}

/**
 * Validates an address object
 */

/**
 * Validates postal code format for a specific country
 */
export function validatePostalCode(
  postalCode: string,
  country: string
): boolean {
  const pattern = POSTAL_CODE_PATTERNS[country];
  return pattern ? pattern.test(postalCode) : true; // Default to valid if no pattern
}

/**
 * Formats postal code according to country standards
 */
export function formatPostalCode(postalCode: string, country: string): string {
  const cleaned = postalCode.replace(/\s+/g, "").toUpperCase();

  switch (country) {
    case "CA":
      // Format: A1A 1A1
      if (cleaned.length === 6) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      }
      break;
    case "GB":
      // Format: SW1A 1AA
      if (cleaned.length >= 5) {
        const outward = cleaned.slice(0, -3);
        const inward = cleaned.slice(-3);
        return `${outward} ${inward}`;
      }
      break;
    case "NL":
      // Format: 1234 AB
      if (cleaned.length === 6) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      }
      break;
    case "SE":
      // Format: 123 45
      if (cleaned.length === 5) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      }
      break;
    default:
      return cleaned;
  }

  return postalCode; // Return original if formatting fails
}

/**
 * Validates phone number format
 */
export function validatePhoneNumber(phone: string, country: string): boolean {
  const pattern = PHONE_PATTERNS[country];
  return pattern ? pattern.test(phone) : true;
}

/**
 * Formats phone number according to country standards
 */
export function formatPhoneNumber(phone: string, country: string): string {
  const cleaned = phone.replace(/\D/g, "");

  switch (country) {
    case "US":
    case "CA":
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
          6
        )}`;
      } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(
          4,
          7
        )}-${cleaned.slice(7)}`;
      }
      break;
    case "GB":
      if (cleaned.length === 11 && cleaned.startsWith("44")) {
        return `+44 ${cleaned.slice(2, 5)} ${cleaned.slice(
          5,
          8
        )} ${cleaned.slice(8)}`;
      } else if (cleaned.length === 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
          7
        )}`;
      }
      break;
    // Add more country-specific formatting as needed
  }

  return phone; // Return original if formatting fails
}

/**
 * Validates address format and suggests improvements
 */
function validateAddressFormat(address: string): ValidationResult {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for common issues
  if (address.length < 10) {
    warnings.push("Address seems too short");
    suggestions.push(
      "Include street number, street name, and any apartment/unit number"
    );
  }

  if (!/\d/.test(address)) {
    warnings.push("Address should include a street number");
  }

  if (
    address.toLowerCase().includes("po box") ||
    address.toLowerCase().includes("p.o. box")
  ) {
    warnings.push(
      "PO Box addresses may not be suitable for all shipping methods"
    );
  }

  // Check for apartment/unit indicators
  const apartmentIndicators = ["apt", "apartment", "unit", "suite", "ste", "#"];
  const hasApartmentIndicator = apartmentIndicators.some((indicator) =>
    address.toLowerCase().includes(indicator)
  );

  if (
    hasApartmentIndicator &&
    !/\d+\s*(apt|apartment|unit|suite|ste|#)/i.test(address)
  ) {
    suggestions.push(
      "Consider including the apartment/unit number after the indicator"
    );
  }

  return {
    isValid: warnings.length === 0,
    errors: [],
    warnings,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validates name format
 */
function validateName(name: string): ValidationResult {
  const warnings: string[] = [];

  if (name.length < 2) {
    warnings.push("Name seems too short");
  }

  if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    warnings.push("Name contains unusual characters");
  }

  if (name.split(" ").length < 2) {
    warnings.push("Consider including both first and last name");
  }

  return {
    isValid: warnings.length === 0,
    errors: [],
    warnings,
  };
}

/**
 * Gets postal code format suggestion for a country
 */
function getPostalCodeSuggestion(country: string): string {
  const suggestions: Record<string, string> = {
    US: "Use format: 12345 or 12345-6789",
    CA: "Use format: A1A 1A1",
    GB: "Use format: SW1A 1AA",
    AU: "Use format: 1234",
    DE: "Use format: 12345",
    FR: "Use format: 12345",
    NL: "Use format: 1234 AB",
    JP: "Use format: 123-4567",
    // Add more suggestions as needed
  };

  return (
    suggestions[country] ||
    "Check the correct postal code format for your country"
  );
}

/**
 * Normalizes address data for consistent storage
 */
export function normalizeAddress(address: AddressData): AddressData {
  return {
    ...address,
    fullName: address.fullName.trim(),
    address: address.address.trim(),
    city: address.city.trim(),
    state: address.state.trim().toUpperCase(),
    postalCode: formatPostalCode(address.postalCode, address.country),
    country: address.country.toUpperCase(),
    phone: address.phone
      ? formatPhoneNumber(address.phone, address.country)
      : undefined,
  };
}

/**
 * Checks if two addresses are similar (for duplicate detection)
 */
export function areAddressesSimilar(
  addr1: AddressData,
  addr2: AddressData
): boolean {
  const normalize = (str: string) => str.toLowerCase().replace(/[^\w]/g, "");

  return (
    normalize(addr1.address) === normalize(addr2.address) &&
    normalize(addr1.city) === normalize(addr2.city) &&
    normalize(addr1.state) === normalize(addr2.state) &&
    normalize(addr1.postalCode) === normalize(addr2.postalCode) &&
    addr1.country === addr2.country
  );
}
