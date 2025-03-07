export const WHITE_LIST = ['/login', '/404', '/403'];

export const isWhiteList = (pathname: string) => WHITE_LIST.includes(pathname);
