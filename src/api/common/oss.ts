import { http } from '@/utils/http';

export const getOssToken = () => {
  return http.get('/oss/token', {}, { isNotUseSuffixUrl: true, isShowNProgress: false });
};
