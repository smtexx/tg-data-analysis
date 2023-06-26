export function arrangeData(data, description) {
  const arranged = {};
  const props = Object.keys(description);

  // Основные свойства
  props.forEach((prop) => {
    arranged[prop] = data[prop];
  });
  // Неуказанные свойства
  Object.keys(data)
    .filter((prop) => !props.includes(prop))
    .forEach((prop) => {
      arranged[prop] = data[prop];
    });

  return arranged;
}
