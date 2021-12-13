const API_URL = 'https://kanap-back.herokuapp.com/api';

// Fetch API with error handling
export default async (endpoint, options) => {
  try {
    const response = await fetch(API_URL + endpoint, {
      method: options?.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options?.body),
    });

    if (!response.ok) throw response;

    return response.json();
  } catch (e) {
    throw Error(e.status ? `${e.status} ${e.statusText}` : 'Le serveur ne répond pas');
  }
};
