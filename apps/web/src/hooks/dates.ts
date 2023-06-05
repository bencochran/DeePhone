import React from 'react';

export function useFormattedDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions,
  locales: string | string[] | undefined = undefined
): string {
  return React.useMemo(
    () => Intl.DateTimeFormat(locales, options).format(new Date(date)),
    [date]
  );
}

export function useYearOptionalFormattedDate(
  date: Date | string,
  options: Omit<Intl.DateTimeFormatOptions, 'timeStyle' | 'dateStyle'>,
  locales: string | string[] | undefined = undefined
): string {
  const realizedOptions = React.useMemo(() => {
    const now = new Date();
    const target = new Date(date);
    const showYear =
      target.getFullYear() !== now.getFullYear() &&
      now.getTime() - target.getTime() > 1000 * 60 * 60 * 24 * 273; // about 9 months
    const { year, ...rest } = options;

    return {
      ...rest,
      year: showYear ? year : undefined,
    };
  }, [date]);
  return useFormattedDate(date, realizedOptions, locales);
}
