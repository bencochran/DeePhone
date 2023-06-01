export type FileSizeUnit = 'B' | 'kB' | 'MB' | 'GB' | 'TB';

const orderedUnits = ['B', 'kB', 'MB', 'GB', 'TB'];

export interface FileSizeFormatOptions {
  decimals?: number;
  minimumUnit?: FileSizeUnit;
  maximumUnit?: FileSizeUnit;
}

export function formatFileSize(bytes: number, options: FileSizeFormatOptions = {}) {
  const {
    decimals = 1,
    minimumUnit = 'B',
    maximumUnit = 'TB',
  } = options;

  const minimumUnitIndex = orderedUnits.indexOf(minimumUnit);
  const maximumUnitIndex = orderedUnits.indexOf(maximumUnit);
  if (minimumUnitIndex === -1) {
    throw new ReferenceError(`'${minimumUnit}' is not one of these duration units: ${orderedUnits.join(', ')}`)
  }
  if (maximumUnitIndex === -1) {
    throw new ReferenceError(`'${maximumUnit}' is not one of these duration units: ${orderedUnits.join(', ')}`)
  }
  if (minimumUnitIndex > maximumUnitIndex) {
    throw new RangeError('minimumUnit cannot be larger than maximumUnit');
  }

  const unitIndex = bytes === 0 ? 0 : Math.max(Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), maximumUnitIndex), minimumUnitIndex);

  const significant = (bytes / Math.pow(1000, unitIndex)).toFixed(decimals);
  return `${significant} ${orderedUnits[unitIndex]}`
}
