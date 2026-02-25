export interface SelectedPlace {
  placeId: string;
  formattedAddress: string;
  addressComponents?: google.maps.GeocoderAddressComponent[];
}

export interface ValidateAddressPayload {
  address: {
    regionCode: string;
    addressLines: string[];
    postalCode?: string;
    administrativeArea?: string;
    locality?: string;
  };
  enableUspsCass: boolean;
}

export interface AddressValidationResponse {
  result?: {
    address?: {
      formattedAddress?: string;
      postalAddress?: {
        regionCode?: string;
        postalCode?: string;
        administrativeArea?: string;
        locality?: string;
        addressLines?: string[];
      };
    };
    verdict?: AddressVerdict;
  };
  error?: { message?: string };
}

export interface AddressVerdict {
  inputGranularity?: string;
  validationGranularity?: string;
  geocodeGranularity?: string;
  hasInferredComponents?: boolean;
  hasReplacedComponents?: boolean;
  addressComplete?: boolean;
  unconfirmedComponentTypes?: string[];
  missingComponentTypes?: string[];
}

export interface AddressValidationSummary {
  formattedAddress?: string;
  regionCode?: string;
  postalCode?: string;
  administrativeArea?: string;
  locality?: string;
  addressLines?: string[];
  verdict?: AddressVerdict;
  raw: AddressValidationResponse;
}
