export const convertStringToUrl = (str: string): string => {
  let url: string = str.trim().toLowerCase();

  url = url.replace(/[^\w\s]/g, "");
  url = url.replace(/[\s-]+/g, "-");

  return url;
};
