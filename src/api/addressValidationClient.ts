import { AddressValidationResponse, AddressValidationSummary, SelectedPlace } from '../types/address';
import { buildPayload } from '../utils/buildPayload';

const ENDPOINT = 'https://addressvalidation.googleapis.com/v1:validateAddress';

const ensureKey = (key: string | undefined): string => {
  if (!key) {
    throw new Error('Adicione ?gmapsKey=SEU_TOKEN na URL para usar a Address Validation API.');
  }
  return key;
};

const extractSummary = (raw: AddressValidationResponse): AddressValidationSummary => {
  const postalAddress = raw.result?.address?.postalAddress;
  const formattedAddress = raw.result?.address?.formattedAddress || postalAddress?.addressLines?.[0];

  return {
    formattedAddress,
    regionCode: postalAddress?.regionCode,
    postalCode: postalAddress?.postalCode,
    administrativeArea: postalAddress?.administrativeArea,
    locality: postalAddress?.locality,
    addressLines: postalAddress?.addressLines,
    verdict: raw.result?.verdict,
    raw
  };
};

export const validateAddress = async (
  place: SelectedPlace,
  apiKey: string,
  signal?: AbortSignal
): Promise<AddressValidationSummary> => {
  const key = ensureKey(apiKey);
  const payload = buildPayload(place);

  const response = await fetch(`${ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Falha ao validar endereço (${response.status}): ${text || response.statusText}`
    );
  }

  const json = (await response.json()) as AddressValidationResponse;
  return extractSummary(json);
};
