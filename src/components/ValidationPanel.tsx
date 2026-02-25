import { AddressValidationSummary, SelectedPlace } from '../types/address';
import { StringDiff } from '../utils/diff';

interface Props {
  selected?: SelectedPlace;
  validated?: AddressValidationSummary;
  diff?: StringDiff;
  error?: string;
  isLoading?: boolean;
}

const renderList = (items: string[] | undefined) => {
  if (!items || items.length === 0) return <span className="muted">Nenhum</span>;
  return (
    <div className="chips-row">
      {items.map((item) => (
        <span key={item} className="chip neutral">
          {item}
        </span>
      ))}
    </div>
  );
};

export function ValidationPanel({ selected, validated, diff, error, isLoading }: Props) {
  return (
    <div className="validation-grid">
      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Selecionado</p>
            <h2>Sugestão escolhida</h2>
          </div>
        </div>
        {selected ? (
          <div className="stack">
            <div className="kv">
              <span className="label">place_id</span>
              <span className="value mono">{selected.placeId}</span>
            </div>
            <div className="kv">
              <span className="label">formatted_address</span>
              <span className="value">{selected.formattedAddress}</span>
            </div>
          </div>
        ) : (
          <p className="muted">Selecione um endereço no autocomplete.</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Validado</p>
            <h2>Address Validation API</h2>
          </div>
          {isLoading && <span className="chip">Validando…</span>}
        </div>

        {error && <p className="error-text">{error}</p>}

        {validated ? (
          <div className="stack">
            <div className="kv">
              <span className="label">formattedAddress</span>
              <span className="value">{validated.formattedAddress ?? '—'}</span>
            </div>
            <div className="kv">
              <span className="label">granularity</span>
              <span className="value">
                {validated.verdict?.validationGranularity || validated.verdict?.geocodeGranularity || '—'}
              </span>
            </div>
            <div className="kv">
              <span className="label">unconfirmed</span>
              {renderList(validated.verdict?.unconfirmedComponentTypes)}
            </div>
            <div className="kv">
              <span className="label">missing</span>
              {renderList(validated.verdict?.missingComponentTypes)}
            </div>
          </div>
        ) : (
          <p className="muted">Nenhuma validação ainda.</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Diferenças</p>
            <h2>Selecionado vs Validado</h2>
          </div>
        </div>
        {diff ? (
          diff.areEqual ? (
            <p className="success">Endereços idênticos.</p>
          ) : (
            <div className="diff-block">
              <div className="kv">
                <span className="label">Selecionado</span>
                <span className="value">{diff.left || '—'}</span>
              </div>
              <div className="kv">
                <span className="label">Validado</span>
                <span className="value">{diff.right || '—'}</span>
              </div>
              <div className="kv">
                <span className="label">Faltando no validado</span>
                {renderList(diff.missingInValidated)}
              </div>
              <div className="kv">
                <span className="label">Adicionado no validado</span>
                {renderList(diff.addedInValidated)}
              </div>
            </div>
          )
        ) : (
          <p className="muted">O diff aparece após a primeira validação.</p>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Resposta completa</p>
            <h2>JSON</h2>
          </div>
        </div>
        {validated ? (
          <details open>
            <summary>Exibir JSON</summary>
            <pre>{JSON.stringify(validated.raw, null, 2)}</pre>
          </details>
        ) : (
          <p className="muted">Nenhuma resposta carregada.</p>
        )}
      </div>
    </div>
  );
}
