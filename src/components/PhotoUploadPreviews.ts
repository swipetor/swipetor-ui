import httpClient from 'src/utils/httpClient';
import photoUtils from 'src/utils/photoUtils';
import { photoUploadPreviewsInit } from '@atas/weblib-ui-js';

export default photoUploadPreviewsInit(httpClient, photoUtils);
