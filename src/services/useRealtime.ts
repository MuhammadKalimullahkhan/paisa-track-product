import { useEffect } from "react";
import { api } from "./api";

export function useRealtime<T>(
  subscribeFn: (callback: (payload: any) => void) => any,
  setData: React.Dispatch<React.SetStateAction<T[]>>
) {
  useEffect(() => {
    const channel = subscribeFn((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setData((prev) => {
        switch (eventType) {
          case "INSERT":
            return [...prev, newRecord];
          case "UPDATE":
            return prev.map((item: any) => 
              item.id === oldRecord.id ? newRecord : item
            );
          case "DELETE":
            return prev.filter((item: any) => 
              item.id !== oldRecord.id
            );
          default:
            return prev;
        }
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);
}