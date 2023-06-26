export function percent(val, base, digits) {
  if (base === 0) {
    return 0;
  }
  const result = Math.round(((val * 100) / base) * 10) / 10;
  return digits === undefined ? result : roundTo(result, digits);
}

export function divide(divisible, divider, digits) {
  if (divider === 0) {
    return 0;
  }

  const result = divisible / divider;
  return digits === undefined ? result : roundTo(result, digits);
}

export function roundTo(val, digits) {
  if (val === 0) {
    return 0;
  }
  const factor = 10 ** digits;
  return Math.round(val * factor) / factor;
}

/*
  config: [
    {
      type: 'sum',
      outcomeName: 'totalIncome',
      propertyName: 'income'
    },
    {
      type: 'counter',
      outcomeName: 'smallChannels',
      propertyName: 'income',
      conditions: [
        { type: '>', value: 10 },
        { type: '<=', value: 100 }
      ]
    },
    ...
  ]
*/

export function calculateStat(data, config) {
  const statDB = {};

  // Инициализация свойств
  config.forEach((statPart) => {
    statDB[statPart.outcomeName] = 0;
  });

  data.forEach((dataPart) => {
    config.forEach((statPart) => {
      const propertyValue = dataPart[statPart.propertyName];
      // В случае суммы прибавить значение
      if (statPart.type === 'sum') {
        statDB[statPart.outcomeName] += propertyValue;
      }

      // В случае счетчика увеличить значение проанализировав условия
      if (statPart.type === 'counter') {
        let increase = true;
        if (statPart.conditions?.length > 0) {
          for (let condition of statPart.conditions) {
            if (
              condition.type === '>' &&
              propertyValue <= condition.value
            ) {
              increase = false;
              break;
            }
            if (
              condition.type === '<' &&
              propertyValue >= condition.value
            ) {
              increase = false;
              break;
            }
            if (
              condition.type === '>=' &&
              propertyValue < condition.value
            ) {
              increase = false;
              break;
            }
            if (
              condition.type === '<=' &&
              propertyValue > condition.value
            ) {
              increase = false;
              break;
            }
            if (
              condition.type === '=' &&
              propertyValue !== condition.value
            ) {
              increase = false;
              break;
            }
            if (
              condition.type === '!=' &&
              propertyValue === condition.value
            ) {
              increase = false;
              break;
            }
          }
        }
        if (increase) {
          statDB[statPart.outcomeName]++;
        }
      }
    });
  });

  return statDB;
}

export function clearNonFinite(dataObj) {
  Object.keys(dataObj).forEach((key) => {
    if (dataObj[key] === null) {
      dataObj[key] = 0;
    }
    if (
      typeof dataObj[key] === 'number' &&
      !Number.isFinite(dataObj[key])
    ) {
      dataObj[key] = 0;
    }
  });
}

export function finite(value) {
  return Number.isFinite(value) ? value : 0;
}
