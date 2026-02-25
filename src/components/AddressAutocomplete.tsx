import { useEffect, useRef, useState } from 'react';
import { SelectedPlace } from '../types/address';
import { loadGoogleMapsFromQuery } from '../google/loadGoogleMapsFromQuery';

interface Props {
  onPlaceSelected: (place: SelectedPlace) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

export function AddressAutocomplete({ onPlaceSelected, onError, disabled }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const legacyInputRef = useRef<HTMLInputElement | null>(null);
  const legacyAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState('');
  const [loadingMaps, setLoadingMaps] = useState(false);

  useEffect(() => {
    let canceled = false;
    let cleanup: (() => void) | undefined;

    const setupAutocomplete = async () => {
      if (!containerRef.current) return;
      setLoadingMaps(true);
      try {
        const google = await loadGoogleMapsFromQuery({ language: 'pt-BR', region: 'BR' });
        if (canceled) return;

        const setupLegacy = () => {
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Ex: Av. Paulista, 1000 - São Paulo';
          input.disabled = !!disabled;
          input.className = 'legacy-autocomplete-input';
          legacyInputRef.current = input;

          const auto = new google.maps.places.Autocomplete(input, {
            types: ['address'],
            fields: ['place_id', 'formatted_address', 'address_components']
          });
          legacyAutocompleteRef.current = auto;

          auto.addListener('place_changed', () => {
            const place = auto.getPlace();
            if (!place?.place_id || !place.formatted_address) {
              onError?.('Não foi possível obter o endereço selecionado.');
              return;
            }
            setValue(place.formatted_address || input.value);
            onPlaceSelected({
              placeId: place.place_id,
              formattedAddress: place.formatted_address,
              addressComponents: place.address_components ?? []
            });
          });

          containerRef.current!.innerHTML = '';
          containerRef.current!.appendChild(input);

          cleanup = () => {
            auto.unbindAll();
            legacyAutocompleteRef.current = null;
            input.remove();
          };
        };
        setupLegacy();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao carregar o Maps API.';
        onError?.(message);
      } finally {
        setLoadingMaps(false);
      }
    };

    setupAutocomplete();

    return () => {
      canceled = true;
      cleanup?.();
    };
  }, [onPlaceSelected, onError, disabled]);

  useEffect(() => {
    if (legacyInputRef.current) {
      legacyInputRef.current.disabled = !!disabled || loadingMaps;
    }
  }, [disabled, loadingMaps]);

  return (
    <div className="autocomplete-card card">
      <div className="card-header">
        <div>
          <p className="eyebrow">Endereço</p>
          <h2>Autocomplete (Places)</h2>
          <p className="hint">Digite um endereço e selecione uma sugestão.</p>
        </div>
        {loadingMaps && <span className="chip">Carregando Maps…</span>}
      </div>
      <div className="field">
        <label htmlFor="gmp-autocomplete">Endereço</label>
        <div ref={containerRef} data-testid="autocomplete-container" />
        {value && <p className="hint">Selecionado: {value}</p>}
      </div>
    </div>
  );
}
