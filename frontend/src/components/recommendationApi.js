export async function getRecommendations(preferences) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(preferences)
  });

  if (!response.ok) {
    throw new Error('Unable to get cereal recommendations.');
  }

  const data = await response.json();

  return data.recommendations;
}