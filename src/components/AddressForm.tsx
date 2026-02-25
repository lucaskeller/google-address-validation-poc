import { FormEvent } from 'react';
import { AddressFormValues } from '../types/googleAddressValidation';

interface AddressFormProps {
  values: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
  onSubmit: () => void;
  isLoading: boolean;
  useProxy: boolean;
  onToggleProxy: (useProxy: boolean) => void;
}

const field = (label: string, name: keyof AddressFormValues, type = 'text', placeholder = '') => (
  { values, onChange }: Pick<AddressFormProps, 'values' | 'onChange'>
) => (
  <label className="field">
    <span>{label}</span>
    <input
      type={type}
      name={name}
      value={values[name] ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange({ ...values, [name]: e.target.value })}
      autoComplete="off"
    />
  </label>
);

const CountryField = field('País (regionCode)', 'countryCode', 'text', 'BR');
const PostalCodeField = field('CEP / Postal Code', 'postalCode', 'text', '01310-000');
const AdministrativeField = field('Estado (UF)', 'administrativeArea', 'text', 'SP');
const LocalityField = field('Cidade', 'locality', 'text', 'São Paulo');
const SublocalityField = field('Bairro (opcional)', 'sublocality', 'text', 'Bela Vista');
const RouteField = field('Rua / Avenida', 'route', 'text', 'Av. Paulista');
const NumberField = field('Número', 'streetNumber', 'text', '1000');
const ComplementField = field('Complemento (opcional)', 'complement', 'text', 'Apto 101');

export function AddressForm({
  values,
  onChange,
  onSubmit,
  isLoading,
  useProxy,
  onToggleProxy
}: AddressFormProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <header className="card-header">
        <div>
          <p className="eyebrow">Google Address Validation</p>
          <h1>Validador de Endereço</h1>
        </div>
        <div className="option">
          <label className="toggle">
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => onToggleProxy(e.target.checked)}
            />
            <span>Usar proxy local (recomendado)</span>
          </label>
          {!useProxy && (
            <p className="hint">
              Lembre-se de definir VITE_GOOGLE_MAPS_API_KEY em .env.local (exposto no browser; restrinja por
              referrer).
            </p>
          )}
        </div>
      </header>

      <div className="grid">
        <CountryField values={values} onChange={onChange} />
        <PostalCodeField values={values} onChange={onChange} />
        <AdministrativeField values={values} onChange={onChange} />
        <LocalityField values={values} onChange={onChange} />
        <SublocalityField values={values} onChange={onChange} />
        <RouteField values={values} onChange={onChange} />
        <NumberField values={values} onChange={onChange} />
        <ComplementField values={values} onChange={onChange} />
      </div>

      <div className="actions">
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Validando…' : 'Validar endereço'}
        </button>
      </div>
    </form>
  );
}
