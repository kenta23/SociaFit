import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Leaflet Map</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      #map { height: 100%; width: 100%; }
      html, body { margin: 0; height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const map = L.map('map', { 
          zoomControl: false,     // hides zoom UI
          dragging: false,        // disables dragging/panning
          scrollWheelZoom: false, // disables scroll wheel
          doubleClickZoom: false, // disables double click zoom
          boxZoom: false,         // disables box selection zoom
          touchZoom: false   
        }).setView([40.757998, -73.972649], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 40,  
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let polyline = L.polyline([], { color: 'green' }).addTo(map);
        let distanceTravelled = 0;

        window.document.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            const { latitude, longitude } = data;
            const newLatLng = L.latLng(latitude, longitude);
            const latlngs = polyline.getLatLngs();

            if (latlngs.length > 0) {
              const lastLatLng = latlngs[latlngs.length - 1];
              distanceTravelled += newLatLng.distanceTo(lastLatLng);
            }

            polyline.addLatLng(newLatLng);
            map.setView(newLatLng);

            window.ReactNativeWebView.postMessage(JSON.stringify({ distance: distanceTravelled }));
          } catch (e) {
            console.error('Invalid location data:', e);
          }
        });
      });
    </script>
  </body>
</html>
`;

export default function OpenStreetMapView() {
  const webviewRef = useRef<WebView | null>(null);
  const [distance, setDistance] = useState(0);
  const [tick, setTick] = useState(0);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
} | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const locationCallback = (loc: Location.LocationObject) => {
    const newCoord = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(newCoord);
  }

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const subscription = await Location.watchPositionAsync({ 
        accuracy: Location.Accuracy.High,
        distanceInterval: 5, //5 meters
        timeInterval: 1000,
      }, locationCallback);

       if (location) { 
         webviewRef.current?.postMessage(JSON.stringify({ latitude: location.latitude, longitude: location.longitude }));
       }

       return () => subscription.remove();
    }

    getCurrentLocation();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          source={{ html }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.distance !== undefined) {
              setDistance(data.distance);
            }
          }}
          style={styles.webview}
        />
      </View>

      <View style={styles.distanceContainer}>
           <View style={styles.distanceWrapper}>
              <Text style={styles.distance}>{`Distance: `}</Text>
             <Text style={styles.km}>{distance} km</Text>
           </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  distance: {
    fontFamily: "Inter-Regular"
    },
   km: {
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    },
  distanceWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: 'auto'
    },
   distanceContainer: {
    backgroundColor: "#eedb73",
    width: "100%",
    height: 70,
   },
  webview: {
    width: "100%",
    height: "100%",
  },
  mapWrapper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  container: {
    borderWidth: 1,
    borderColor: "#54ee69",
    borderRadius: 24,
    width: 341,
    height: 358,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
});
