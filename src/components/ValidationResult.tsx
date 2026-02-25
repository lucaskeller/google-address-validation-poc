import {
  AddressFormValues,
  DifferenceEntry,
  RecommendedAddress,
  ValidateAddressResponse
} from '../types/googleAddressValidation';

interface ValidationResultProps {
  response?: ValidateAddressResponse;
  original: AddressFormValues;
  recommended?: RecommendedAddress;
  differences: DifferenceEntry[];
  error?: string;
  isLoading: boolean;
  onUseRecommended?: (recommended: RecommendedAddress) => void;
}

const SummaryRow = ({ label, value }: { label: string; value?: string | boolean | number }) => (
  <div className="summary-row">
    <span>{label}</span>
    <strong>{value !== undefined && value !== '' ? String(value) : '—'}</strong>
  </div>
);

const renderAddressLines = (recommended?: RecommendedAddress) => {
  if (!recommended) return null;
  return (
    <ul className="address-lines">
      {recommended.addressLines?.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
};

export function ValidationResult({
  response,
  original,
  recommended,
  differences,
  error,
  isLoading,
  onUseRecommended
}: ValidationResultProps) {
  const verdict = response?.result?.verdict;

  return (
    <section className="card results">
      <header className="card-header">
        <div>
          <p className="eyebrow">Resultado</p>
          <h2>Validação</h2>
        </div>
        <div className="status">
          {isLoading && <span className="chip">Validando…</span>}
          {!isLoading && response && <span className="chip success">Concluído</span>}
          {error && <span className="chip error">Erro</span>}
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      {verdict && (
        <div className="summary">
          <SummaryRow label="Granularidade" value={verdict.validationGranularity} />
          <SummaryRow label="Endereço completo" value={verdict.addressComplete} />
          <SummaryRow label="Componentes não confirmados" value={verdict.hasUnconfirmedComponents} />
          <SummaryRow label="Componentes inferidos" value={verdict.hasInferredComponents} />
        </div>
      )}

      {recommended && (
        <div className="recommended">
          <div className="header">
            <h3>Endereço recomendado</h3>
            {onUseRecommended && (
              <button className="ghost" onClick={() => onUseRecommended(recommended)}>
                Usar endereço recomendado
              </button>
            )}
          </div>
          {recommended.formattedAddress && <p className="formatted">{recommended.formattedAddress}</p>}
          {renderAddressLines(recommended)}
          <div className="summary">
            <SummaryRow label="CEP" value={recommended.postalCode} />
            <SummaryRow label="Estado" value={recommended.administrativeArea} />
            <SummaryRow label="Cidade" value={recommended.locality} />
          </div>
        </div>
      )}

      {differences.length > 0 && (
        <div className="diff">
          <h3>Diferenças</h3>
          <table>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Digitado</th>
                <th>Recomendado</th>
              </tr>
            </thead>
            <tbody>
              {differences.map((diff) => (
                <tr key={diff.field} className={diff.changed ? 'changed' : ''}>
                  <td>{diff.field}</td>
                  <td>{diff.original || '—'}</td>
                  <td>{diff.suggested || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {response && (
        <details>
          <summary>Resposta completa</summary>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}
