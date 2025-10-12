import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';



const DEFAULT_REGION: Region = {
    latitude:  14.771812737924256, 
    longitude: 121.06465829558094,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  

export default function DisplayMapContent({ coordinates }: { coordinates: { latitude: number; longitude: number }[] }) {
  const [region, setRegion] = useState<Region>({...coordinates[0], latitudeDelta: 0.01, longitudeDelta: 0.01});


  useEffect(() => {
    if (coordinates.length > 0) {
      setRegion({...coordinates[0], latitudeDelta: 0.01, longitudeDelta: 0.01});
    }
  }, [coordinates]);
 
  
    return ( 
      <View style={styles.container}>
           <MapView 
              style={styles.map}
              region={region ?? DEFAULT_REGION}
              scrollEnabled={false}
              pitchEnabled={false}
              zoomControlEnabled={false}   
              rotateEnabled={false}
              zoomEnabled={false}
              scrollDuringRotateOrZoomEnabled={false}
              provider={PROVIDER_GOOGLE}
              
             >
              <Marker coordinate={coordinates[0]} />
              <Polyline 
                 coordinates={coordinates}   
                 strokeColor="#24B437"
                 strokeWidth={3}/>
           </MapView>
      </View>
  )
  
}

const styles = StyleSheet.create({ 
     container: { 
         width: "100%",
         minWidth: 110,
         height: 160,
         flex: 1,
        //  height: 'auto',
         borderWidth: 1,
         borderColor: '#F3E266',
         borderRadius: 8,
         overflow: "hidden",
         justifyContent: "center",
         alignItems: "center",
         flexDirection: "column",
     },
     map: { 
        ...StyleSheet.absoluteFillObject,
     },
     
})