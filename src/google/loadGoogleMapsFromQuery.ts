let cachedPromise: Promise<typeof google> | null = null;

export const getGmapsKeyFromQuery = (): string | undefined => {
  const key = new URLSearchParams(window.location.search).get('gmapsKey');
  return key?.trim() || undefined;
};

interface LoadOptions {
  language?: string;
  region?: string;
}

export const loadGoogleMapsFromQuery = (options: LoadOptions = {}): Promise<typeof google> => {
  if (cachedPromise) {
    return cachedPromise;
  }

  const apiKey = getGmapsKeyFromQuery();
  if (!apiKey) {
    return Promise.reject(
      new Error('Adicione ?gmapsKey=SEU_TOKEN na URL para carregar o Maps JavaScript API.')
    );
  }

  const { language = 'pt-BR', region = 'BR' } = options;
  const url = new URL('https://maps.googleapis.com/maps/api/js');
  url.searchParams.set('key', apiKey);
  url.searchParams.set('libraries', 'places');
  if (language) url.searchParams.set('language', language);
  if (region) url.searchParams.set('region', region);

  cachedPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve(window.google);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="true"]'
    );
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.google?.maps?.places) {
          resolve(window.google);
        } else {
          cachedPromise = null;
          reject(new Error('Falha ao inicializar o Google Maps API (places indisponível).'));
        }
      });
      existing.addEventListener('error', () => {
        cachedPromise = null;
        reject(new Error('Não foi possível carregar o script do Google Maps.'));
      });
      return;
    }

    const script = document.createElement('script');
    script.src = url.toString();
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = 'true';

    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
      } else {
        cachedPromise = null;
        reject(new Error('Falha ao inicializar o Google Maps API (places indisponível).'));
      }
    };

    script.onerror = () => {
      cachedPromise = null;
      reject(new Error('Não foi possível carregar o script do Google Maps.'));
    };

    document.head.appendChild(script);
  });

  return cachedPromise;
};
