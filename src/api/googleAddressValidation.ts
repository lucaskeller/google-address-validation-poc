import {
  AddressFormValues,
  DifferenceEntry,
  RecommendedAddress,
  ValidateAddressResponse
} from '../types/googleAddressValidation';

interface ValidateOptions {
  useProxy?: boolean;
  apiKey?: string;
}

const GOOGLE_ENDPOINT = 'https://addressvalidation.googleapis.com/v1:validateAddress';

const trimOrEmpty = (value?: string) => value?.trim() ?? '';

export const buildAddressLines = (values: AddressFormValues): string[] => {
  const lineParts: string[] = [];
  const primaryLine = [trimOrEmpty(values.route), trimOrEmpty(values.streetNumber)]
    .filter(Boolean)
    .join(' ');

  if (primaryLine) {
    const withComplement = values.complement?.trim()
      ? `${primaryLine} - ${values.complement.trim()}`
      : primaryLine;
    lineParts.push(withComplement);
  }

  if (values.sublocality?.trim()) {
    lineParts.push(values.sublocality.trim());
  }

  if (lineParts.length > 0) {
    return lineParts;
  }

  const fallbackRoute = trimOrEmpty(values.route);
  return fallbackRoute ? [fallbackRoute] : [];
};

export const buildAddressPayload = (values: AddressFormValues) => ({
  address: {
    regionCode: trimOrEmpty(values.countryCode) || 'BR',
    postalCode: trimOrEmpty(values.postalCode),
    administrativeArea: trimOrEmpty(values.administrativeArea),
    locality: trimOrEmpty(values.locality),
    addressLines: buildAddressLines(values)
  },
  enableUspsCass: false
});

export const extractRecommendedAddress = (
  response: ValidateAddressResponse
): RecommendedAddress | undefined => {
  const postal = response.result?.address?.postalAddress;
  const formatted = response.result?.address?.formattedAddress;
  if (!postal && !formatted) {
    return undefined;
  }

  const line0 = postal?.addressLines?.[0];
  let route: string | undefined;
  let streetNumber: string | undefined;

  if (line0) {
    const match = line0.match(/^(.*?)(?:\s+(\d+[\w-]*))?(?:\s*-\s*(.*))?$/);
    route = match?.[1]?.trim() || undefined;
    streetNumber = match?.[2]?.trim() || undefined;
  }

  return {
    formattedAddress: formatted,
    regionCode: postal?.regionCode,
    postalCode: postal?.postalCode,
    administrativeArea: postal?.administrativeArea,
    locality: postal?.locality,
    route: route || postal?.addressLines?.[0],
    streetNumber,
    addressLines: postal?.addressLines
  };
};

export const diffAddresses = (
  original: AddressFormValues,
  recommended?: RecommendedAddress
): DifferenceEntry[] => {
  const pairs: Array<[keyof AddressFormValues, keyof RecommendedAddress]> = [
    ['countryCode', 'regionCode'],
    ['postalCode', 'postalCode'],
    ['administrativeArea', 'administrativeArea'],
    ['locality', 'locality'],
    ['sublocality', 'sublocality'],
    ['route', 'route'],
    ['streetNumber', 'streetNumber']
  ];

  return pairs.map(([origKey, recKey]) => {
    const originalValue = trimOrEmpty(original[origKey]);
    const suggestedValue = trimOrEmpty(recommended?.[recKey]);
    return {
      field: origKey,
      original: originalValue || undefined,
      suggested: suggestedValue || undefined,
      changed: !!suggestedValue && suggestedValue !== originalValue
    };
  });
};

const ensureApiKey = (apiKey?: string) => {
  if (!apiKey) {
    throw new Error('A Google API key is required when bypassing the proxy.');
  }
  return apiKey;
};

export const validateAddress = async (
  values: AddressFormValues,
  options: ValidateOptions = { useProxy: true }
): Promise<ValidateAddressResponse> => {
  const payload = buildAddressPayload(values);
  const useProxy = options.useProxy ?? true;

  const url = useProxy
    ? '/api/validate-address'
    : `${GOOGLE_ENDPOINT}?key=${ensureApiKey(options.apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Address validation failed (${response.status}): ${message}`);
  }

  const json = (await response.json()) as ValidateAddressResponse;
  if (import.meta.env.DEV) {
    console.debug('Address validation response', json);
  }
  return json;
};
