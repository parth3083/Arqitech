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
