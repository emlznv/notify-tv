const NO_RESULT_TEXT = 'n/a';

export const formatPremiere = (value?: string) => {
  return value ? ` (${value.substring(0, 4)})` : '';
};

export const formatRating = (rating: { average?: number }) => {
  if (!rating.average) {
    return NO_RESULT_TEXT;
  }
  const isInteger = Number.isInteger(rating.average);
  return rating.average && isInteger ? `${rating.average}.0` : rating.average;
};

export const formatGenres = (genres?: string[]) => {
  return genres?.length
    ? genres.slice(0, 2).join(', ')
    : NO_RESULT_TEXT.toUpperCase();
};

export const formatAvgRuntime = (avgRuntime?: number) => {
  return avgRuntime ? `${avgRuntime}m` : NO_RESULT_TEXT;
};
