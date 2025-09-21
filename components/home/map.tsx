import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject, 
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
 loadingContainer: {
   position: 'absolute',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'rgba(255, 255, 255, 0.8)',
   zIndex: 1,
 },
 loadingText: {
   marginTop: 10,
   fontSize: 16,
   color: '#666',
 },
});

// Default region (San Francisco) as fallback
const DEFAULT_REGION: Region = {
  latitude:  14.771812737924256, 
  longitude: 121.06465829558094,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function GoogleMapShow() {
   const [location, setLocation] = useState<Location.LocationObject | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [pathCoordinates, setPathCoordinates] = useState<Array<{latitude: number, longitude: number}>>([]);
   const [totalDistance, setTotalDistance] = useState(0);

   useEffect(() => { 
      async function getLocation() { 
         try {
            setIsLoading(true);
            setError(null);
            
            const { status } = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') { 
               setError('Permission to access location was denied');
               Alert.alert('Permission to access location was denied');
               return;
            }
            
            const currentLocation = await Location.getCurrentPositionAsync({
               accuracy: Location.Accuracy.High,
               timeInterval: 1000,
               distanceInterval: 5,
            });

           
            setLocation(currentLocation);
            // Initialize path with starting location
            setPathCoordinates([{
               latitude: currentLocation.coords.latitude,
               longitude: currentLocation.coords.longitude
            }]);
         } catch (err) {
            console.error('Error getting location:', err);
            setError('Failed to get location');
         } finally {
            setIsLoading(false);
         }
      }

      getLocation();
   }, []);

   // Simulate movement every 2 seconds
//    useEffect(() => {
//       if (!location) return;

//       const interval = setInterval(() => {
//          setLocation(prevLocation => {
//             if (!prevLocation) return prevLocation;

//             // Simulate walking/running movement
//             // Small random changes in coordinates (roughly 10-50 meters)
//             const latChange = (Math.random() - 0.5) * 0.0005; // ~50m max change
//             const lngChange = (Math.random() - 0.5) * 0.0005; // ~50m max change
            
//             const newLocation = {
//                ...prevLocation,
//                coords: {
//                   ...prevLocation.coords,
//                   latitude: prevLocation.coords.latitude + latChange,
//                   longitude: prevLocation.coords.longitude + lngChange,
//                }
//             };

//             // Add new coordinate to path
//             setPathCoordinates(prevPath => [
//                ...prevPath,
//                {
//                   latitude: newLocation.coords.latitude,
//                   longitude: newLocation.coords.longitude
//                }
//             ]);

//             return newLocation;
//          });
//       }, 2000); // Update every 2 seconds

//       return () => clearInterval(interval);
//    }, [location]);

   console.log('My location', location);

   // Create region from location or use default
   const mapRegion: Region = location ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
   } : DEFAULT_REGION;

  return (
   <SafeAreaView style={styles.container}>
     <MapView
       scrollEnabled={false}
       pitchEnabled={false}
       zoomControlEnabled   
       rotateEnabled={false}
       zoomEnabled={false}
       provider={PROVIDER_GOOGLE}
       showsUserLocation={true}
       showsMyLocationButton={true}
       style={styles.map}
       initialRegion={mapRegion}
       region={mapRegion}
       followsUserLocation={true}
     >
               <Marker coordinate={location ? {
                 latitude: location.coords.latitude,
                 longitude: location.coords.longitude,
               } : DEFAULT_REGION} />
               <Polyline 
                 coordinates={pathCoordinates}
                 strokeColor="#24B437"
                 strokeWidth={3}
               />
     </MapView>
     
     {isLoading && (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#007AFF" />
         <Text style={styles.loadingText}>Getting your location...</Text>
       </View>
     )}

   
     {error && (
       <View style={styles.loadingContainer}>
         <Text style={styles.loadingText}>{error}</Text>
       </View>
     )}
   </SafeAreaView>
  );
}