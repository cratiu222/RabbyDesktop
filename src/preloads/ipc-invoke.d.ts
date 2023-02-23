type ChannelInvokePayload = {
  'get-app-version': {
    send: [];
    response: {
      version: ReturnType<Electron.App['getVersion']>;
    };
  };
  'get-os-info': {
    send: [];
    response: IOSInfo;
  };
  'detect-dapp': {
    send: [dappUrl: string];
    response: {
      result: IDappsDetectResult;
    };
  };
  'dapps-fetch': {
    send: [];
    response: {
      dapps: IDapp[];
      pinnedList: IDapp['origin'][];
      unpinnedList: IDapp['origin'][];
    };
  };
  'get-dapp': {
    send: [origin: IDapp['origin']];
    response: {
      dapp: IDapp | null;
      isPinned: boolean;
    };
  };
  'dapps-post': {
    send: [dapp: IDapp];
    response: {
      error?: string;
    };
  };
  'dapps-put': {
    send: [dapp: IDapp];
    response: void;
  };
  'dapps-replace': {
    send: [originsToDel: string | string[], newDapp: IDapp];
    response: {
      error?: string | null;
    };
  };
  'dapps-delete': {
    send: [dapp: IDapp];
    response: {
      error?: string;
    };
  };
  'dapps-togglepin': {
    send: [dappOrigins: IDapp['origin'][], nextPinned: boolean];
    response: {
      error?: string;
    };
  };
  'dapps-setOrder': {
    send: [
      {
        pinnedList?: IDapp['origin'][];
        unpinnedList?: IDapp['origin'][];
      }
    ];
    response: {
      error: string | null;
    };
  };
  'dapps-put-protocol-binding': {
    send: [bindings: IProtocolDappBindings];
    response: {
      error?: string;
    };
  };
  'dapps-fetch-protocol-binding': {
    send: [];
    response: {
      result: IProtocolDappBindings;
    };
  };
  'get-desktopAppState': {
    send: [];
    response: {
      state: IDesktopAppState;
    };
  };
  'put-desktopAppState': {
    send: [
      partialPayload: {
        [K in keyof IDesktopAppState]?: IDesktopAppState[K];
      }
    ];
    response: {
      state: IDesktopAppState;
    };
  };
  'toggle-activetab-animating': {
    send: [visible: boolean];
    response: void;
  };
  'check-proxyConfig': {
    send: [
      {
        detectURL: string;
        proxyConfig: IAppProxyConf['proxySettings'];
      }
    ];
    response: {
      valid: boolean;
      errMsg: string;
    };
  };
  'get-proxyConfig': {
    send: [];
    response: {
      persisted: IAppProxyConf;
      runtime: IRunningAppProxyConf;
    };
  };
  'apply-proxyConfig': {
    send: [conf: IAppProxyConf];
    response: void;
  };
  'get-hid-devices': {
    send: [
      options?: {
        filters?: HIDDeviceRequestOptions['filters'];
      }
    ];
    response: {
      error?: string;
      devices: INodeHidDeviceInfo[];
    };
  };
  'get-usb-devices': {
    send: [
      options?: {
        filters?: HIDDeviceRequestOptions['filters'];
      }
    ];
    response: {
      devices: IUSBDevice[];
    };
  };
  'confirm-selected-device': {
    send: [
      {
        selectId: string;
        // null means cancel
        device: Pick<IHidDevice, 'deviceId' | 'productId' | 'vendorId'> | null;
      }
    ];
    response: {
      error: string | null;
    };
  };
  'parse-favicon': {
    send: [targetURL: string];
    response: {
      error?: string | null;
      favicon: IParsedFavicon | null;
    };
  };
  'preview-dapp': {
    send: [targetURL: string];
    response: {
      error?: string | null;
      previewImg: Uint8Array | string | null;
    };
  };
  'get-app-dynamic-config': {
    send: [];
    response: {
      error?: string | null;
      dynamicConfig: IAppDynamicConfig;
    };
  };
  [`__internal_rpc:rabbyx-rpc:query`]: {
    send: [query: Omit<IRabbyxRpcQuery, 'rpcId'>];
    response: {
      result: any;
      error?: Error;
    };
  };
};

type IInvokesKey = keyof ChannelInvokePayload;