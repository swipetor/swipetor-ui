import httpClient from 'src/utils/httpClient';
import photoUtils from 'src/utils/photoUtils';
import { photoUploadPreviewsInit } from '@atas/webapp-ui-shared';

export default photoUploadPreviewsInit(httpClient, photoUtils);
