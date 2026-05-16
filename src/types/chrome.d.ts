declare namespace chrome {
  namespace tabs {
    interface MutedInfo {
      muted: boolean;
      reason?: "user" | "capture" | "extension";
      extensionId?: string;
    }

    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      active: boolean;
      audible?: boolean;
      favIconUrl?: string;
      mutedInfo?: MutedInfo;
      title?: string;
      url?: string;
    }

    interface QueryInfo {
      audible?: boolean;
      currentWindow?: boolean;
    }

    interface UpdateProperties {
      active?: boolean;
      muted?: boolean;
    }

    function query(queryInfo: QueryInfo): Promise<Tab[]>;
    function update(tabId: number, updateProperties: UpdateProperties): Promise<Tab>;
    function remove(tabId: number): Promise<void>;
  }

  namespace windows {
    interface UpdateInfo {
      focused?: boolean;
    }

    function update(windowId: number, updateInfo: UpdateInfo): Promise<unknown>;
  }
}
