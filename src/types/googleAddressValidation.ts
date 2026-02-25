export interface AddressFormValues {
  countryCode: string;
  postalCode: string;
  administrativeArea: string;
  locality: string;
  sublocality?: string;
  route: string;
  streetNumber: string;
  complement?: string;
}

export interface PostalAddress {
  regionCode?: string;
  postalCode?: string;
  administrativeArea?: string;
  locality?: string;
  addressLines?: string[];
}

export interface AddressComponent {
  componentType?: string;
  componentName?: string;
  confirmationLevel?: string;
  inferred?: boolean;
  spellCorrected?: boolean;
  replaced?: boolean;
  unexpected?: boolean;
  unconfirmed?: boolean;
}

export interface ValidatedAddress {
  formattedAddress?: string;
  postalAddress?: PostalAddress;
  addressComponents?: AddressComponent[];
}

export interface ValidationVerdict {
  inputGranularity?: string;
  validationGranularity?: string;
  geocodeGranularity?: string;
  addressComplete?: boolean;
  hasUnconfirmedComponents?: boolean;
  hasInferredComponents?: boolean;
  hasReplacedComponents?: boolean;
  missingComponentTypes?: string[];
  unconfirmedComponentTypes?: string[];
  unresolvedTokens?: string[];
}

export interface ValidateAddressResult {
  verdict?: ValidationVerdict;
  address?: ValidatedAddress;
  geocode?: {
    placeId?: string;
    plusCode?: {
      globalCode?: string;
      compoundCode?: string;
    };
    location?: {
      latitude?: number;
      longitude?: number;
    };
    placeTypes?: string[];
  };
  metadata?: {
    business?: boolean;
    poBox?: boolean;
    residential?: boolean;
  };
  uspsData?: unknown;
}

export interface ValidateAddressResponse {
  responseId?: string;
  result?: ValidateAddressResult;
  validationMetadata?: Record<string, unknown>;
}

export interface RecommendedAddress {
  formattedAddress?: string;
  regionCode?: string;
  postalCode?: string;
  administrativeArea?: string;
  locality?: string;
  sublocality?: string;
  route?: string;
  streetNumber?: string;
  complement?: string;
  addressLines?: string[];
}

export interface DifferenceEntry {
  field: string;
  original?: string;
  suggested?: string;
  changed: boolean;
}
