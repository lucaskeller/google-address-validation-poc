import { useMemo, useState } from 'react';
import { AddressAutocomplete } from './components/AddressAutocomplete';
import { ValidationPanel } from './components/ValidationPanel';
import { validateAddress } from './api/addressValidationClient';
import { diffStrings, StringDiff } from './utils/diff';
import { getGmapsKeyFromQuery } from './google/loadGoogleMapsFromQuery';
import { AddressValidationSummary, SelectedPlace } from './types/address';
import './App.css';

function App() {
  const [selected, setSelected] = useState<SelectedPlace>();
  const [validated, setValidated] = useState<AddressValidationSummary>();
  const [diff, setDiff] = useState<StringDiff>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = useMemo(() => getGmapsKeyFromQuery(), []);

  const handlePlaceSelected = async (place: SelectedPlace) => {
    setSelected(place);
    setError(undefined);
    setValidated(undefined);
    setDiff(undefined);

    if (!apiKey) {
      setError('Adicione ?gmapsKey=SEU_TOKEN na URL para usar o autocomplete e validar.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await validateAddress(place, apiKey);
      setValidated(result);
      setDiff(diffStrings(place.formattedAddress, result.formattedAddress ?? ''));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro inesperado ao validar endereço.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (message: string) => {
    setError(message);
  };

  return (
    <main className="page">
      <header className="hero card">
        <div>
          <p className="eyebrow">Google Address Validation API</p>
          <h1>POC com Autocomplete + Validação</h1>
          <p className="hint">
            A chave deve vir na query string: <strong>?gmapsKey=SEU_TOKEN</strong>. Exemplo:
            http://localhost:5173/?gmapsKey=MINHA_CHAVE
          </p>
          <p className="hint">
            A chave fica exposta no navegador. Restrinja por HTTP referrer e limite as APIs no
            Google Cloud Console.
          </p>
        </div>
        {!apiKey && <span className="chip error">Falta ?gmapsKey=...</span>}
      </header>

      <AddressAutocomplete
        onPlaceSelected={handlePlaceSelected}
        onError={handleError}
        disabled={!apiKey || isLoading}
      />

      <ValidationPanel
        selected={selected}
        validated={validated}
        diff={diff}
        error={error}
        isLoading={isLoading}
      />
    </main>
  );
}

export default App;
