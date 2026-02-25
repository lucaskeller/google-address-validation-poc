import { describe, expect, it } from 'vitest';
import { buildPayload } from './buildPayload';
import { SelectedPlace } from '../types/address';

const sampleComponents: google.maps.GeocoderAddressComponent[] = [
  { long_name: 'Brasil', short_name: 'BR', types: ['country', 'political'] },
  { long_name: '01310-100', short_name: '01310-100', types: ['postal_code'] },
  { long_name: 'São Paulo', short_name: 'SP', types: ['administrative_area_level_1', 'political'] },
  { long_name: 'São Paulo', short_name: 'São Paulo', types: ['locality', 'political'] }
];

describe('buildPayload', () => {
  it('monta payload usando formattedAddress e componentes', () => {
    const selected: SelectedPlace = {
      placeId: 'place-123',
      formattedAddress: 'Av. Paulista, 1000 - São Paulo',
      addressComponents: sampleComponents
    };

    const payload = buildPayload(selected);

    expect(payload.address.addressLines).toEqual(['Av. Paulista, 1000 - São Paulo']);
    expect(payload.address.regionCode).toBe('BR');
    expect(payload.address.postalCode).toBe('01310-100');
    expect(payload.address.administrativeArea).toBe('SP');
    expect(payload.address.locality).toBe('São Paulo');
    expect(payload.enableUspsCass).toBe(false);
  });

  it('usa defaults quando não há componentes', () => {
    const selected: SelectedPlace = {
      placeId: 'place-456',
      formattedAddress: 'Rua Sem Nome, 42',
      addressComponents: []
    };

    const payload = buildPayload(selected);
    expect(payload.address.regionCode).toBe('BR');
    expect(payload.address.locality).toBeUndefined();
    expect(payload.address.addressLines).toEqual(['Rua Sem Nome, 42']);
  });
});
