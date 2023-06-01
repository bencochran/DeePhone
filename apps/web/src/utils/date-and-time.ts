export type DurationUnit = 'seconds' | 'minutes' | 'hours' | 'days';

const orderedUnits = ['seconds', 'minutes', 'hours', 'days'];

export interface DurationFormatOptions {
  style?: 'time' | 'text';
  minimumUnit?: DurationUnit;
  maximumUnit?: DurationUnit;
}

const unitConfig = {
  seconds: {
    text: {
      short: 's',
    },
  },
  minutes: {
    text: {
      short: 'm',
    },
  },
  hours: {
    text: {
      short: 'h',
    },
  },
  days: {
    text: {
      short: 'd',
    }
  },
};

interface DurationPart {
  value: number;
  unit: DurationUnit;
}

export function formatDuration(durationSeconds: number, options: DurationFormatOptions = {}): string {
  const {
    style = 'text',
    minimumUnit = 'seconds',
    maximumUnit = 'days',
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

  const units = orderedUnits.slice(minimumUnitIndex, maximumUnitIndex + 1);

  const parts: DurationPart[] = [];

  let workingDuration = durationSeconds;

  if (units.includes('days')) {
    const days = Math.floor(durationSeconds / 86400);
    if (days !== 0 || style === 'time') {
      parts.push({ value: days, unit: 'days' });
    }
    workingDuration = durationSeconds % 86400;
  }

  if (units.includes('hours')) {
    const hours = Math.floor(workingDuration / 3600);
    if (hours !== 0 || parts.length > 0) {
      parts.push({ value: hours, unit: 'hours' });
    }
    workingDuration = workingDuration % 3600;
  }

  if (units.includes('minutes')) {
    const minutes = Math.floor(workingDuration / 60);
    if (minutes !== 0 || parts.length > 0) {
      parts.push({ value: minutes, unit: 'minutes' });
    }
    workingDuration = workingDuration % 60;
  }

  if (units.includes('seconds')) {
    const seconds = Math.floor(workingDuration);
    if (seconds !== 0 || parts.length > 0) {
      parts.push({ value: seconds, unit: 'seconds' });
    }
  }

  if (parts.length === 0) {
    if (style === 'time') {
      return ':00';
    }
    if (minimumUnit == 'seconds') {
      return '0s';
    }
    if (minimumUnit == 'minutes') {
      return '0m';
    }
    if (minimumUnit == 'hours') {
      return '0h';
    }
    if (minimumUnit == 'days') {
      return '0d';
    }
  }

  if (style === 'time') {
    return parts.reduce((string, part) => {
      if (string.length === 0 && part.unit === maximumUnit) {
        return String(part.value);
      }
      const formattedPart = String(part.value).padStart(2, '0');
      return `${string}:${formattedPart}`
    }, '');
  } else {
    return parts.map(p => `${p.value}${unitConfig[p.unit].text.short}`).join(' ');
  }
};
