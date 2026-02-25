import { SelectedPlace, ValidateAddressPayload } from '../types/address';

const findComponent = (
  components: google.maps.GeocoderAddressComponent[] | undefined,
  type: string,
  useShort = false
): string | undefined => {
  if (!components) return undefined;
  const match = components.find((component) => component.types.includes(type));
  if (!match) return undefined;
  return useShort ? match.short_name : match.long_name;
};

export const buildPayload = (place: SelectedPlace): ValidateAddressPayload => {
  const regionCode = findComponent(place.addressComponents, 'country', true) || 'BR';
  const postalCode = findComponent(place.addressComponents, 'postal_code');
  const administrativeArea = findComponent(place.addressComponents, 'administrative_area_level_1', true);
  const locality =
    findComponent(place.addressComponents, 'locality') ||
    findComponent(place.addressComponents, 'administrative_area_level_2');

  const formatted = place.formattedAddress.trim();
  const addressLines = formatted ? [formatted] : [];

  return {
    address: {
      regionCode,
      addressLines,
      postalCode: postalCode || undefined,
      administrativeArea: administrativeArea || undefined,
      locality: locality || undefined
    },
    enableUspsCass: false
  };
};
