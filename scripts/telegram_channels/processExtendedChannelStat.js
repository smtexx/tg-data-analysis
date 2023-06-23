import * as fs from 'fs/promises';
import * as path from 'path';
import { readJSON } from '../common/readJSON.js';
import { writeJSON } from '../common/writeJSON.js';

export async function processExtendedChannelStat() {
  const categoriesDest = path.join('data_source', 'telega_in_categories');
  const tgStatGroupDest = path.join('data_source', 'tgstat_ru_channels');
  const telegaInGroupDest = path.join('data_source', 'telega_in_channels');
  const outputDest = path.join('data_dest', 'group_extended_data');

  const categories = await readJSON('categories', categoriesDest);
  const categoryIDs = categories.map((category) => category.name);

  // Начинаем создавать и записывать файлы категорий
  for (let categoryID of categoryIDs) {
    // Читаем файлы с данными каналов
    const telegaIn = await readJSON(categoryID, telegaInGroupDest);
    const tgStat = await readJSON(categoryID, tgStatGroupDest);

    // Объект для записи созданных каналов
    const groupsDB = {
      channels: [],
      chats: [],
    };

    // Фильтруем базовый массив с данными telegaIn
    const telegaInCleared = telegaIn.filter(
      (group) => group?.link && group.prices && group.channelType
    );

    // Обрабатываем базовый массив создавая новые объекты групп
    telegaInCleared.forEach((baseGroup) => {
      // Создаем объект новой группы
      const newGroup = {};

      // Заменяем 'empty' значения на 0
      Object.keys(baseGroup).forEach((key) => {
        if (baseGroup[key] === 'empty') {
          baseGroup[key] = 0;
        }
      });

      // Обрабатываем общие свойства
      newGroup.id = baseGroup.link.match(
        /https:\/\/telega\.in\/channels\/(.+)\/card/
      )[1];
      newGroup.category = categories.find(
        (category) => category.name === categoryID
      ).descriptionShort;
      newGroup.name = baseGroup.name;
      newGroup.description = baseGroup.description;
      newGroup.originLink = baseGroup.channelLink;
      newGroup.type = baseGroup.channelType;
      newGroup.adsCardViews = baseGroup.cardViews;
      newGroup.adsCardFavorite = baseGroup.cardFavorite;
      newGroup.adsReviewsCount = baseGroup.reviewsCount;
      newGroup.adsReviewsRating = baseGroup.reviewsRating;
      newGroup.adsChannelRating = baseGroup.channelRating;
      newGroup.orders = baseGroup.orders;

      // Обрабатываем цены
      ['24', '48', '72', 'eternal', 'repost'].forEach((type) => {
        const prices = baseGroup.prices.find(
          (price) => price.priceType === type
        ) || {
          postReach: 0,
          cpv: 0,
          err_percent: 0,
          price: 0,
        };
        const propNameBase = `adsPrice_${type}`;
        newGroup[`${propNameBase}`] = prices.price;
        newGroup[`${propNameBase}_reach`] = prices.postReach;
        newGroup[`${propNameBase}_cpv`] = prices.cpv;
        newGroup[`${propNameBase}_err`] = prices.err_percent;
      });

      // Получаем базовае данные с tgstat
      let tgStatBase = tgStat.find((group) =>
        newGroup.id.includes(group.channelID)
      );

      if (tgStatBase === undefined) {
        const falseTgStatBase = {
          subscribers: 0,
          subscribersDaily_trend: '0',
          subscribersWeekly_trend: '0',
          subscribersMonthly_trend: '0',
          channelAge: '',
          channelCreated: '',
          male_percent: 0,
          female_percent: 0,
        };

        if (baseGroup.channelType.includes('канал')) {
          const channelFalseProps = {
            citationIndex: 0,
            channelMentions: 0,
            postMentions: 0,
            reposts: 0,
            averagePostReach: 0,
            err_percent: 0,
            err24_percent: 0,
            averageAdsPostReach: 0,
            adsReach_12h: 0,
            adsReach_24h: 0,
            adsReach_48h: 0,
            totalPosts: 0,
            postsPerDay: 0,
            postsPerWeek: 0,
            postsPerMonth: 0,
            involvement_percent: 0,
            subscribersRepost: 0,
            subscribersComment: 0,
            subscribersReact: 0,
          };

          Object.assign(falseTgStatBase, channelFalseProps);
        } else {
          const chatFalseProps = {
            uniqMembersWeek: 0,
            uniqMembersDay: 0,
            uniqMembersMonth: 0,
            onlineNow: 0,
            onlineDay: 0,
            onlineNight: 0,
            totalMessages: 0,
            messagesDay: '0',
            messagesWeek: '0',
            messagesMonth: '0',
          };

          Object.assign(falseTgStatBase, chatFalseProps);
        }

        tgStatBase = falseTgStatBase;
      } else {
        // Заменяем 'empty' значения на 0
        Object.keys(tgStatBase).forEach((key) => {
          if (tgStatBase[key] === 'empty') {
            tgStatBase[key] = 0;
          }
        });
      }

      // Обрабатываем общие свойства
      newGroup.members = tgStatBase.subscribers || baseGroup.subscribers;
      newGroup.malePercent = tgStatBase.male_percent;
      newGroup.femalePercent = tgStatBase.female_percent;
      newGroup.membersWeeklyTrend = parseInt(
        tgStatBase.subscribersWeekly_trend
      );
      newGroup.membersMonthlyTrend = parseInt(
        tgStatBase.subscribersMonthly_trend
      );

      // Дата создания
      if (tgStatBase.channelCreated === '') {
        newGroup.created = new Date().toString();
      } else {
        newGroup.created = new Date(
          tgStatBase.channelCreated.split('.').reverse().join('-')
        ).toString();
      }

      if (baseGroup.channelType.includes('канал')) {
        // Обрабатываем группу как канал
        newGroup.citationIndex = tgStatBase.citationIndex;
        newGroup.channelMentions = tgStatBase.channelMentions;
        newGroup.postMentions = tgStatBase.postMentions;
        newGroup.reposts = tgStatBase.reposts;
        newGroup.avgPostReach = tgStatBase.averagePostReach;
        newGroup.errPercent = tgStatBase.err_percent;
        newGroup.err24Percent = tgStatBase.err24_percent;
        newGroup.avgAdsPostReach = tgStatBase.averageAdsPostReach;
        newGroup.adsReach12h = tgStatBase.adsReach_12h;
        newGroup.adsReach24h = tgStatBase.adsReach_24h;
        newGroup.adsReach48h = tgStatBase.adsReach_48h;
        newGroup.totalPosts = tgStatBase.totalPosts;
        newGroup.postsPerDay = tgStatBase.postsPerDay;
        newGroup.postsPerWeek = tgStatBase.postsPerWeek;
        newGroup.postsPerMonth = tgStatBase.postsPerMonth;
        newGroup.involvementPercent = tgStatBase.involvement_percent;
        newGroup.subscribersRepost = tgStatBase.subscribersRepost;
        newGroup.subscribersComment = tgStatBase.subscribersComment;
        newGroup.subscribersReact = tgStatBase.subscribersReact;

        // Сохраняем созданный канал
        groupsDB.channels.push(newGroup);
      } else {
        // Обрабатываем группу как чат
        newGroup.uniqMembersWeek = tgStatBase.uniqMembersWeek;
        newGroup.uniqMembersDay = tgStatBase.uniqMembersDay;
        newGroup.uniqMembersMonth = tgStatBase.uniqMembersMonth;
        newGroup.onlineNow = tgStatBase.onlineNow;
        newGroup.onlineDay = tgStatBase.onlineDay;
        newGroup.onlineNight = tgStatBase.onlineNight;
        newGroup.totalMessages = tgStatBase.totalMessages;
        newGroup.messagesDay = parseInt(tgStatBase.messagesDay);
        newGroup.messagesWeek = parseInt(tgStatBase.messagesWeek);
        newGroup.messagesMonth = parseInt(tgStatBase.messagesMonth);

        // Сохраняем созданный чат
        groupsDB.chats.push(newGroup);
      }
    });

    // Рассчитываем новые свойства
    function patchCalculatedProps(group) {
      const prices = [
        group.adsPrice_24,
        group.adsPrice_48,
        group.adsPrice_72,
        group.adsPrice_eternal,
        group.adsPrice_repost,
      ].filter((price) => price !== 0);

      group.minAdsPrice = Math.min(...prices);
      group.maxAdsPrice = Math.max(...prices);
      group.totalIncome = group.minAdsPrice * group.orders;
      group.interestIndex = group.adsCardViews + group.adsCardFavorite * 5;
      group.ageInMonths = Math.floor(
        (Date.now() - new Date(group.created).valueOf()) / 2_628_000_000
      );
      group.monthIncome = Math.round(
        group.totalIncome / (group.ageInMonths || 1)
      );
      group.incomePerMember =
        Math.round((group.totalIncome / (group.members || 1)) * 10000) / 10000;

      if (group.type.includes('канал')) {
        group.postPerDay = Math.floor(group.postsPerMonth / 30);
        group.avgPostPerDay = Math.floor(
          group.totalPosts / group.ageInMonths / 30
        );
        group.incomePerPost =
          Math.round((group.totalIncome / group.totalPosts) * 1000) / 1000;
      } else {
        group.messagesPerDay = Math.floor(group.messagesMonth / 30);
        group.avgMessagesPerDay = Math.floor(
          group.totalMessages / group.ageInMonths / 30
        );
        group.incomePerMessage =
          Math.round((group.totalIncome / group.totalMessages) * 10000) / 10000;
      }
    }

    // Патчим группы новыми свойствами
    groupsDB.channels.forEach(patchCalculatedProps);
    groupsDB.chats.forEach(patchCalculatedProps);

    // Заменяем не конечные значения на 0
    groupsDB.channels.forEach((channel) => {
      Object.keys(channel).forEach((key) => {
        if (channel[key] === Infinity || Number.isNaN(channel[key])) {
          channel[key] = 0;
        }
      });
    });
    groupsDB.chats.forEach((channel) => {
      Object.keys(channel).forEach((key) => {
        if (channel[key] === Infinity || Number.isNaN(channel[key])) {
          channel[key] = 0;
        }
      });
    });

    // Записываем новый файл с данными
    await writeJSON(categoryID, outputDest, groupsDB);
    console.log(`Категория ${categoryID} успешно обработана`);
  }
}

// Посчитать индекс интереса к каналу!!!!
