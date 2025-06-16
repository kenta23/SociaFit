import * as Loc from 'expo-location';
import { getDistance } from 'geolib';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';


const mockCoord = {
    latitude: 40.575908,
    longitude: -73.972649,
  };

  
  
export default function Location() {
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [route, setRoute] = useState<{
        latitude: number;
        longitude: number;
    }[]>([]); // Array of {latitude, longitude}
   const [distance, setDistance] = useState<number>(0);
   const mapRef = useRef<MapView | null>(null);
  

 const locationCallback = (loc: Loc.LocationObject) => {
    const newCoord = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    setLocation(newCoord);

    setRoute((prev) => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1]; //get the last coordinate
        const newDistance = getDistance(last, newCoord); //calculate the distance between the last coordinate and the new coordinate
        setDistance((d) => d + newDistance);
      }
      return [...prev, newCoord];
    });

    // auto center map
    mapRef.current?.animateCamera({ center: newCoord }, { duration: 500 });
  }
 async function getCurrentLocation() {
    const { status } = await Loc.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const subscription = await Loc.watchPositionAsync({
        accuracy: Loc.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 5, // meters
      },
      locationCallback
    );

    return () => subscription.remove();
  }

   useEffect(() => {
    const interval = setInterval(() => {
        // Simulate movement by slightly changing the location
        setLocation((prev) => {
          const newCoord = {
            latitude: (prev?.latitude || mockCoord.latitude) + 0.0001,
            longitude: (prev?.longitude || mockCoord.longitude) + 0.0001,
          };
    
          setRoute((prevRoute) => {
            if (prevRoute.length > 0) {
              const last = prevRoute[prevRoute.length - 1];
              const newDistance = getDistance(last, newCoord);
              setDistance((d) => d + newDistance);
            }
            return [...prevRoute, newCoord];
          });
    
          mapRef.current?.animateCamera({ center: newCoord }, { duration: 500 });
          return newCoord;
        });
      }, 2000); // every 2 seconds
    
      return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={styles.container}>
     {location && (
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          ...location,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker coordinate={location} />
       
        <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
      </MapView>
    )}
    <View style={styles.infoBox}>
      <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
    </View>
  </View>
  )
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    infoBox: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 12,
      elevation: 4,
    },
 });