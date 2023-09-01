import * as path from 'path';
import { readJSON } from '../common/readJSON.js';
import { extractParsedData } from './extractParsedData.js';
import { analyzeGroup } from './analyzeGroup.js';
import { analyzeGroupCategory } from './analyzeGroupCategory.js';
import { writeXlsxFile } from '../common/writeXlsxFile.js';
import { getDescription } from './getDescription.js';

export async function handleData() {
  const categoriesSource = await readJSON(
    'categories.json',
    path.join('data_source', 'telega_in_categories')
  );
  const channelCategories = [];
  const channels = {};
  const chatCategories = [];
  const chats = {};

  for (let category of categoriesSource) {
    const telegaInGroups = (
      await readJSON(
        category.name,
        path.join('data_source', 'telega_in_channels')
      )
    ).filter((group) => group?.channelLink);

    const tgStatGroups = await readJSON(
      category.name,
      path.join('data_source', 'tgstat_ru_channels')
    );

    // Получаем массив проанализированных каналов категории и категорию
    const readyChannels = [];
    telegaInGroups
      .filter((group) =>
        group.channelType.toLowerCase().includes('канал')
      )
      .forEach((channel) => {
        const parsedChannel = extractParsedData(
          channel,
          tgStatGroups,
          category.descriptionShort
        );
        const analyzedChannel = analyzeGroup(parsedChannel);

        readyChannels.push(analyzedChannel);
      });
    const readyChannelsCategory = analyzeGroupCategory(
      category,
      readyChannels
    );

    // Получаем массив проанализированных чатов категории и категорию
    const readyChats = [];
    telegaInGroups
      .filter((group) =>
        group.channelType.toLowerCase().includes('чат')
      )
      .forEach((channel) => {
        const parsedChannel = extractParsedData(
          channel,
          tgStatGroups,
          category.descriptionShort
        );
        const analyzedChannel = analyzeGroup(parsedChannel);

        readyChats.push(analyzedChannel);
      });
    const readyChatsCategory = analyzeGroupCategory(
      category,
      readyChats
    );

    // Сохраняем данные
    channelCategories.push(readyChannelsCategory);
    channels[category.name] = readyChannels;
    chatCategories.push(readyChatsCategory);
    chats[category.name] = readyChats;
  }

  // Записываем файлы xlsx
  // Каналы
  console.log('Запись файлов xlsx');
  await writeXlsxFile(
    path.join('data_dest', 'xlsx', 'channels_22_06_2023.xlsx'),
    [
      {
        name: 'Категории',
        headers: Object.keys(channelCategories[0]),
        flatData: channelCategories,
      },
      {
        name: 'Каналы',
        headers: Object.keys(channels[categoriesSource[0].name][0]),
        flatData: Object.values(channels).flat(),
      },
      {
        name: 'Свойства категорий',
        headers: ['Свойство', 'Описание'],
        flatData: Object.entries(getDescription('category')).map(
          ([propName, description]) => ({
            property: propName,
            description,
          })
        ),
      },
      {
        name: 'Свойства каналов',
        headers: ['Свойство', 'Описание'],
        flatData: Object.entries(getDescription('channel')).map(
          ([propName, description]) => ({
            property: propName,
            description,
          })
        ),
      },
    ]
  );
  // Чаты
  await writeXlsxFile(
    path.join('data_dest', 'xlsx', 'chats_22_06_2023.xlsx'),
    [
      {
        name: 'Категории',
        headers: Object.keys(chatCategories[0]),
        flatData: chatCategories,
      },
      {
        name: 'Чаты',
        headers: Object.keys(chats[categoriesSource[0].name][0]),
        flatData: Object.values(chats).flat(),
      },
      {
        name: 'Свойства категорий',
        headers: ['Свойство', 'Описание'],
        flatData: Object.entries(getDescription('category')).map(
          ([propName, description]) => ({
            property: propName,
            description,
          })
        ),
      },
      {
        name: 'Свойства чатов',
        headers: ['Свойство', 'Описание'],
        flatData: Object.entries(getDescription('chat')).map(
          ([propName, description]) => ({
            property: propName,
            description,
          })
        ),
      },
    ]
  );
  console.log('Файлы успешно записаны');
}
