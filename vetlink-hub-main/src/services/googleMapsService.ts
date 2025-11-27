import { ExternalClinic } from '@/types/clinic.types';

/**
 * Waits for Google Maps API to be loaded
 */
function waitForGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max

        const checkInterval = setInterval(() => {
            attempts++;

            if (typeof google !== 'undefined' && google.maps && google.maps.places) {
                clearInterval(checkInterval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error('Google Maps API não carregou'));
            }
        }, 100);
    });
}

/**
 * Searches for veterinary clinics near the specified location using Google Places API
 */
export async function searchNearbyVeterinaryClinics(
    latitude: number,
    longitude: number,
    radius: number = 5000
): Promise<ExternalClinic[]> {
    try {
        await waitForGoogleMaps();

        return new Promise((resolve) => {
            // Create a temporary map element (required by PlacesService)
            const map = new google.maps.Map(document.createElement('div'));
            const service = new google.maps.places.PlacesService(map);

            const request: google.maps.places.PlaceSearchRequest = {
                location: new google.maps.LatLng(latitude, longitude),
                radius: radius,
                type: 'veterinary_care'
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const clinics = results.map(place => ({
                        id: place.place_id!,
                        name: place.name!,
                        address: place.vicinity!,
                        latitude: place.geometry!.location!.lat(),
                        longitude: place.geometry!.location!.lng(),
                        rating: place.rating,
                        totalReviews: place.user_ratings_total,
                        isRegistered: false as const,
                        placeId: place.place_id!,
                        googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                        photoUrl: place.photos?.[0]
                            ? place.photos[0].getUrl({ maxWidth: 400 })
                            : undefined,
                        openNow: place.opening_hours?.open_now,
                    }));
                    resolve(clinics);
                } else {
                    console.warn('Google Places search returned status:', status);
                    resolve([]); // Return empty array instead of failing
                }
            });
        });
    } catch (error) {
        console.error('Error fetching from Google Places:', error);
        return []; // Return empty array on error
    }
}

/**
 * Gets the user's current location using the Geolocation API
 */
export async function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalização não é suportada pelo seu navegador'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let message = 'Erro ao obter localização';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Permissão de localização negada';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Localização indisponível';
                        break;
                    case error.TIMEOUT:
                        message = 'Timeout ao obter localização';
                        break;
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}

/**
 * Calculates the distance in km between two points using the Haversine formula
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Gets coordinates from a CEP using ViaCEP + Google Maps Geocoding (Frontend)
 * This is more reliable than geocoding the CEP number directly
 */
export const getCoordinatesFromCep = async (cep: string): Promise<{ latitude: number; longitude: number; address: string } | null> => {
    try {
        // 1. Try to get address details from ViaCEP first
        const cleanCep = cep.replace(/\D/g, '');
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const viaCepData = await viaCepResponse.json();

        let searchAddress = cep;

        if (!viaCepData.erro) {
            // Build a complete address string which is much easier for Google to geocode
            searchAddress = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade} - ${viaCepData.uf}, Brasil`;
        }

        // 2. Use Google Geocoder with the best address we have
        await waitForGoogleMaps();

        return new Promise((resolve) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: searchAddress, componentRestrictions: { country: 'BR' } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({
                        latitude: location.lat(),
                        longitude: location.lng(),
                        address: results[0].formatted_address
                    });
                } else {
                    console.error('Geocoding failed for address:', searchAddress, 'Status:', status);
                    resolve(null);
                }
            });
        });
    } catch (error) {
        console.error('Error in CEP search:', error);
        return null;
    }
};
