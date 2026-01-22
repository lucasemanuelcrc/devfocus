export {};

declare global {
  interface Window {
    desktop?: {
      isElectron?: boolean;
      platform?: string;
      window?: {
        minimize: () => Promise<void>;
        toggleMaximize: () => Promise<void>;
        close: () => Promise<void>;
        toggleFullscreen: () => Promise<void>;
        getState: () => Promise<{ isMaximized: boolean; isFullScreen: boolean }>;
        onStateChanged: (
          callback: (state: { isMaximized: boolean; isFullScreen: boolean }) => void
        ) => () => void;
      };
    };
  }
}
