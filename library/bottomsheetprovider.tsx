// BottomSheetHost.tsx
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

type SheetContent = React.ReactNode;
type BottomSheetContextType = { open: (content: SheetContent) => void; close: () => void };

const BottomSheetContext = createContext<BottomSheetContextType>({ open: () => {}, close: () => {} });

export const useBottomSheet = () => useContext(BottomSheetContext);

export function BottomSheetHost({ children }: { children: React.ReactNode }) {
  const ref = useRef<BottomSheetModal>(null);
  const [content, setContent] = useState<SheetContent>(null);

  const open = useCallback((node: SheetContent) => {
    setContent(node);
    requestAnimationFrame(() => ref.current?.expand());
  }, []);

  const close = useCallback(() => ref.current?.dismiss(), []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetContext.Provider value={{ open, close }}>
        {children}
        <BottomSheetModal ref={ref} snapPoints={['25%', '50%']}>
          {content}
        </BottomSheetModal>
      </BottomSheetContext.Provider>
    </BottomSheetModalProvider>
  );
}