import puter from '@heyputer/puter.js';
import { CreateProjectParams, DesignItem } from '@/types/puter.types';
import {
  getOrCreateHostingConfig,
  uploadImageToHosting,
} from './puter.hosting';
import { isHostedUrl } from '@/utils/puter';

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = async () => {
  try {
    return await puter.auth.getUser();
  } catch (error) {
    console.error(`Error in fetching the current user : ${error}`);
    return null;
  }
};

export const createProject = async ({
  item,
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
  const projectId = item.id;

  const hosting = await getOrCreateHostingConfig();

  const hostedSource = projectId
    ? await uploadImageToHosting({
        hosting,
        url: item.sourceImage,
        projectId,
        label: 'source',
      })
    : null;

  const hostedRender =
    projectId && item.renderedImage
      ? await uploadImageToHosting({
          hosting,
          url: item.renderedImage,
          projectId,
          label: 'source',
        })
      : null;

  const resolvedSource =
    hostedSource?.url ||
    (isHostedUrl(item.sourceImage) ? item.sourceImage : '');

  if (!resolvedSource) {
    console.warn(`Failed to host source image, skipping save.`);
    return null;
  }

  const resolvedRender = hostedRender?.url
    ? hostedRender.url
    : item.renderedImage && isHostedUrl(item.renderedImage)
      ? item.renderedImage
      : undefined;

  const { sourcePath, renderedPath, publicPath, ...rest } = item;
  // These fields are excluded from the payload intentionally
  void sourcePath;
  void renderedPath;
  void publicPath;

  const payload = {
    ...rest,
    sourceImage: resolvedSource,
    renderedImage: resolvedRender,
  };

  try {
    // Call the puter worker to store project in kv

    return payload;
  } catch (error) {
    console.log('Failed to save Project', error);
    return null;
  }
};
