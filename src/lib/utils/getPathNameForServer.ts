export const getPathNameForServer = (headersList: any) => {
  const domain = headersList.get("x-forwarded-host") || "";
  const fullUrl = headersList.get("referer") || "";
  const [, pathname] =
    fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
  return pathname;
};
