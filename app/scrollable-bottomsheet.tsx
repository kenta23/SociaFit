import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';




export default function ScrollableBottomSheet() {

       // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    []
  );

  const handleCollapsePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);


  return (
    <GestureHandlerRootView style={styles.container}>
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Collapse" onPress={() => handleCollapsePress()} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
} 



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 200,
    },
    contentContainer: {
      backgroundColor: "white",
    },
    itemContainer: {
      padding: 6,
      margin: 6,
      backgroundColor: "#eee",
    },
  });
  