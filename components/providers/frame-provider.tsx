"use client";

import frameSDK from "@farcaster/frame-sdk";
import type { FrameContext } from "@farcaster/frame-core/dist/context";
import { createContext, useContext, useEffect, useState } from "react";
import { Connector } from "wagmi";
import { config } from "./providers";
// import { setUserNotificationDetails } from "@/lib/notifications/db";

interface FrameContextValue {
  context: FrameContext | undefined;
  isLoaded: boolean;
  connector: Connector;
  isMiniApp: boolean | undefined;
}

const FrameSDKContext = createContext<FrameContextValue | undefined>(undefined);

export function FrameSDKProvider({ children }: { children: React.ReactNode }) {
  const [isFrameSDKLoaded, setIsFrameSDKLoaded] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [localConnector, setLocalConnector] = useState<Connector>(
    config.connectors[0]
  );

  useEffect(() => {
    const load = async () => {
      const frameContext = await frameSDK.context;
      setContext(frameContext);
      const isMiniApp = await frameSDK.isInMiniApp();
      console.log("isMiniApp", isMiniApp);
      setIsMiniApp(isMiniApp);
      if (isMiniApp) {
        setLocalConnector(config.connectors[0]);
        console.log("******** frameContext", frameContext);
        if (!frameContext.client.added) {
          console.log("$$$$$$$ trigger add app");
          // frameSDK.actions.addMiniApp();
        }
        if (frameContext.client.notificationDetails) {
          console.log("setting notificationDetails");
          // setUserNotificationDetails(
          //   frameContext.user.fid,
          //   frameContext.client.notificationDetails
          // );
        }
      }
      frameSDK.actions.ready({});
    };
    if (frameSDK && !isFrameSDKLoaded) {
      setIsFrameSDKLoaded(true);
      load();
    }
  }, [isFrameSDKLoaded]);

  return (
    <FrameSDKContext.Provider
      value={{
        context,
        isLoaded: isFrameSDKLoaded,
        connector: localConnector,
        isMiniApp,
      }}
    >
      {children}
    </FrameSDKContext.Provider>
  );
}

export const useFrameSDK = () => {
  const frameContext = useContext(FrameSDKContext);

  return {
    context: frameContext?.context,
    isLoaded: frameContext?.isLoaded,
    isMiniApp: frameContext?.isMiniApp,
    connector: frameContext?.context
      ? frameContext?.connector
      : config.connectors[1],
  };
};
