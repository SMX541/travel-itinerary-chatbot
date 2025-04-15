// Google Places API integration

export async function searchPlaces(query: string, type?: string) {
  try {
    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn("No Google Places API key provided, returning empty results");
      return { results: [] };
    }
    
    // Construct the Google Places API URL
    const baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    
    let url = `${baseUrl}?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    // Add type parameter if provided
    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("Google Places API error:", error);
    return { results: [] };
  }
}

// Get place details for more information
export async function getPlaceDetails(placeId: string) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.warn("No Google Places API key provided, returning empty details");
      return null;
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,opening_hours,website,price_level,photos&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.result;
  } catch (error) {
    console.error("Google Places API error:", error);
    return null;
  }
}

// Get map URL for a location
export function getGoogleMapEmbedUrl(location: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY || "";
  
  // Generate a Google Maps embed URL
  const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}&zoom=12`;
  
  return url;
}
