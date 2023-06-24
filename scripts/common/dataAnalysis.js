export function percent(val, base) {
  return Math.round(((val * 100) / base) * 10) / 10;
}

export function roundTo(val, digits) {
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
      propName: 'income',
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
      const propValue = dataPart[statPart.propName];
      // В случае суммы прибавить значение
      if (statPart.type === 'sum') {
        statDB[statPart.outcomeName] += propValue;
      }

      // В случае счетчика увеличить значение проанализировав условия
      if (statPart.type === 'counter') {
        let increase = true;
        if (statPart.conditions?.length > 0) {
          for (let condition of statPart.conditions) {
            if (condition.type === '>' && propValue <= condition.value) {
              increase = false;
              break;
            }
            if (condition.type === '<' && propValue >= condition.value) {
              increase = false;
              break;
            }
            if (condition.type === '>=' && propValue < condition.value) {
              increase = false;
              break;
            }
            if (condition.type === '<=' && propValue > condition.value) {
              increase = false;
              break;
            }
            if (condition.type === '=' && propValue !== condition.value) {
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
    if (typeof dataObj[key] === 'number' && !Number.isFinite(dataObj[key])) {
      dataObj[key] = 0;
    }
  });
}
