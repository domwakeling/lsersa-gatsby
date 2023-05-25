import { fetch } from 'undici'; 
import { slopes } from '../../lib/slope-data.js';

export default async function handler(req, res) {

    // get uri to query
    const postcode = req.params.postcode;
    const uri = `https://api.postcodes.io/postcodes/${postcode}`.replace(/\s/g, "%20");

    // get data from end
    const result = await fetch(uri);
    const data = await result.json();

    if (data.status != 200) {
        res.status(data.status).json({error: data.error});
        return;
    }

    // get distance between postcode and slopes; object with required data; nearest 2
    const distances = slopes
        .map(slope => {
            const R = 6371e3; // metres
            const φ1 = slope.coordinates.lat * Math.PI / 180; // φ, λ in radians
            const φ2 = data.result.latitude * Math.PI / 180;
            const Δφ = (data.result.latitude - slope.coordinates.lat) * Math.PI / 180;
            const Δλ = (data.result.longitude - slope.coordinates.long) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const d = R * c / 1609; // in meters => miles

            const dist = d.toFixed(1);

            return {
                name: slope.name,
                url: slope.url,
                target: slope.target,
                distance: dist
            }
        })
        .sort((a,b) => a.distance - b.distance)
        .filter((_, idx) => idx < 2);

    res.status(200).json(distances);
}