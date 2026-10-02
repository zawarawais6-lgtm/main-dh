/**
 * Amorph Patch Connection Service for Host VST communication
 */
class AmorphPatchConnection {
  private static instance: AmorphPatchConnection;

  public connection = {
    sendEventOrValue: (eventName: string, value: any) => {
      // Dispatches parameter or preset updates to the parent audio host or wrapper
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('amorphPatchEvent', {
            detail: { eventName, value }
          })
        );
      }
    }
  };

  public static getInstance(): AmorphPatchConnection {
    if (!AmorphPatchConnection.instance) {
      AmorphPatchConnection.instance = new AmorphPatchConnection();
    }
    return AmorphPatchConnection.instance;
  }
}

export const getAmorphPatchConnection = () => AmorphPatchConnection.getInstance();

export function useAmorphPatchConnection() {
  const conn = getAmorphPatchConnection().connection;
  return {
    connection: conn,
    isConnected: true,
    isRealHost: typeof window !== 'undefined' && Boolean((window as any).amorphHostAvailable),
    sendThemePreset: (preset: any) => conn.sendEventOrValue('setThemePreset', preset),
    sendThemeSeed: (seed: any) => conn.sendEventOrValue('setThemeSeed', seed)
  };
}
