export type HostingConfig = {
  subdomain: string;
};
export type HostedAsset = {
  url: string;
};

export interface StoreHostedImageParams {
  hosting: HostingConfig | null;
  url: string;
  projectId: string;
  label: 'source' | 'rendered';
}

export interface DesignItem {
  id: string;
  name?: string | null;
  sourceImage: string;
  sourcePath?: string | null;
  renderedImage?: string | null;
  renderedPath?: string | null;
  publicPath?: string | null;
  timestamp: number;
  ownerId?: string | null;
  sharedBy?: string | null;
  sharedAt?: string | null;
  isPublic?: boolean;
}

export interface DesignConfig {
  floor: string;
  walls: string;
  style: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
}

export interface CreateProjectParams {
  item: DesignItem;
  visibility?: 'private' | 'public';
}
