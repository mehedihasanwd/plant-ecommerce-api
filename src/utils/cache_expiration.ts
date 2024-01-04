export const setCacheExpiration = ({ day }: { day: number }): number => {
  const EX: number = 3600 * 24 * day;

  return EX;
};
