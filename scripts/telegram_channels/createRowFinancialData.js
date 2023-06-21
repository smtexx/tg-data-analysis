import * as fs from 'fs/promises';
import * as path from 'path';
import { readJSON } from '../common/readJSON.js';
import { writeJSON } from '../common/writeJSON.js';

export async function createRowFinancialData() {
  // Получить массив с ID категорий
  const categoriesRowData = await readJSON(
    'categories.json',
    path.join('data_source', 'telega_in_categories')
  );
  const categoryIDs = categoriesRowData.map(({ name }) => name);

  // Начать обработку данных в цикле
  for (let categoryID of categoryIDs) {
    const categoryData = categoriesRowData.find(
      ({ name }) => name === categoryID
    );
    const newCategory = {
      categoryID,
      title: categoryData.descriptionShort,
      keywords: categoryData.description,
      groups: [],
    };

    // Добавляем в созданную категорию каналы
    const channels_telegaIn = await readJSON(
      categoryID,
      path.join('data_source', 'telega_in_channels')
    );
    const channels_tgstatRu = await readJSON(
      categoryID,
      path.join('data_source', 'tgstat_ru_channels')
    );

    channels_telegaIn.forEach((channel) => {
      if (channel?.link) {
        const id = channel.link.match(
          /https:\/\/telega\.in\/channels\/(.+)\/card/
        )[1];
        const stat =
          channels_tgstatRu.find((channelStat) =>
            id.includes(channelStat.channelID)
          ) || {};
        const financial = channel;

        // Удалить лишние свойства
        delete financial.link;
        delete stat.channelID;

        // Добавить канал в категорию
        newCategory.groups.push({
          id,
          financial,
          stat,
        });
      }
    });

    // Записываем файл категории на диск
    await writeJSON(
      'ROW_' + categoryID,
      path.join('data_dest', 'temp'),
      newCategory
    );
  }
}
