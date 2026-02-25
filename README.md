# Google Address Validation POC (Vite + React)

POC 100% client-side em React + Vite + TypeScript que:
- Usa apenas **um campo de endereço** com **Google Places Autocomplete**.
- Ao selecionar a sugestão, chama a **Google Address Validation API**.
- Exibe selecionado, validado/padronizado, resumo de verdict/granularity, diff simples e JSON bruto.

## Pré-requisitos
- Node.js 18+
- Projeto no Google Cloud com billing
- APIs habilitadas: **Maps JavaScript API**, **Places API**, **Address Validation API**

### Como habilitar no Google Cloud
1) Crie/abra um projeto com billing ativo.
2) Em “APIs e serviços” habilite: Maps JavaScript API, Places API, Address Validation API.
3) Crie uma API Key e **restrinja por HTTP referrer**; limite às APIs acima e defina quotas.

## Como rodar
```bash
npm install
npm run dev
```
Abra no navegador com a chave na query string:

- `http://localhost:5173/?gmapsKey=MINHA_CHAVE`

> A chave fica exposta no browser/URL. Mitigue com restrição por referrer e limitações de API/quotas.

## Uso
1) Digite o endereço no único campo (autocomplete do Places).
2) Selecione uma sugestão; a POC chama `validateAddress` com a mesma key da query.
3) Veja:
   - place_id e formatted_address selecionados
   - formattedAddress validado
   - verdict/granularity/unconfirmed/missing (quando presentes)
   - Diff simples entre selecionado vs validado
   - `<details>` com o JSON completo

## Estrutura de pastas
- `src/google/loadGoogleMapsFromQuery.ts` — injeta o script do Maps JS lendo `?gmapsKey=`.
- `src/api/addressValidationClient.ts` — chama Address Validation via fetch.
- `src/utils/buildPayload.ts` — monta payload (place -> validateAddress body).
- `src/utils/diff.ts` — diff simples de strings.
- `src/components/AddressAutocomplete.tsx` — input único com Places Autocomplete.
- `src/components/ValidationPanel.tsx` — exibe selecionado, validado, diff e JSON.
- `src/App.tsx`, `src/main.tsx` — orquestração e entrada.

## Teste
```bash
npm test
```
- Teste mínimo cobre `buildPayload`.

## Exemplo de endereço (BR) para testar
- `Av. Paulista, 1000 - São Paulo`

## Observação de segurança
- A chave não fica oculta. Restrinja por HTTP referrer e limite APIs/quotas no Google Cloud Console.
