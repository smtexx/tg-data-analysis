import * as fs from 'fs/promises';
import * as path from 'path';
import { readJSON } from '../common/readJSON.js';
import { writeJSON } from '../common/writeJSON.js';

export async function processExtendedCategoryStat() {
  const categorySource = path.join('data_source', 'telega_in_categories');
  const groupSource = path.join('data_dest', 'group_extended_data');
  const outputDest = path.join('data_dest', 'category_extended_data');

  const categoriesDB = [];
  const categotiesData = await readJSON('categories.json', categorySource);

  // Начинаем обрабатывать файлы категорий
  for (let categoryData of categotiesData) {
    // Читаем содержимое файла с группами
    const sourceData = await readJSON(categoryData.name, groupSource);

    // Считаем суммы данных
    const sumData = {
      // Общее статистика
      groups: 0,
      members: 0,
      ageInMonths: 0,
      membersWeeklyTrend: 0,
      membersMonthlyTrend: 0,
      males: 0,
      females: 0,
      smallGroups: 0,
      abandonedGroups: 0,
      // Общее финансы
      monthIncome: 0,
      incomePerMember: 0,
      orders: 0,
      interestIndex: 0,
      minPrice: 0,
      maxPrice: 0,
      smallGroupsIncome: 0,

      incomeDistribution_0: 0,
      incomeDistribution_0_5k: 0,
      incomeDistribution_5_20k: 0,
      incomeDistribution_20_50k: 0,
      incomeDistribution_50_100K: 0,
      incomeDistribution_100_500k: 0,
      incomeDistribution_500k: 0,

      groupsDistribution_100: 0,
      groupsDistribution_100_500: 0,
      groupsDistribution_500_1k: 0,
      groupsDistribution_1k_10k: 0,
      groupsDistribution_10k_50k: 0,
      groupsDistribution_50k_100k: 0,
      groupsDistribution_100k_500k: 0,
      groupsDistribution_500k: 0,

      membersDistribution_100: 0,
      membersDistribution_100_500: 0,
      membersDistribution_500_1k: 0,
      membersDistribution_1k_10k: 0,
      membersDistribution_10k_50k: 0,
      membersDistribution_50k_100k: 0,
      membersDistribution_100k_500k: 0,
      membersDistribution_500k: 0,
      // Чаты
      publicChats: 0,
      privateChats: 0,
      messagesPerDay: 0,
      chatIncome: 0,
      incomePerMessage: 0,
      // Каналы
      publicChannels: 0,
      privateChannels: 0,
      postsPerDay: 0,
      channelIncome: 0,
      incomePerPost: 0,
    };

    function updateSum(group) {
      // Общее статистика
      sumData.groups++;
      sumData.members += group.members;
      sumData.ageInMonths += group.ageInMonths;
      sumData.membersWeeklyTrend += group.membersWeeklyTrend;
      sumData.membersMonthlyTrend += group.membersMonthlyTrend;
      sumData.males += group.malePercent;
      sumData.females += group.femalePercent;

      if (group.messagesMonth === 0 || group.postsPerMonth === 0) {
        sumData.abandonedGroups++;
      }

      if (group.members <= 100) {
        sumData.smallGroups++;
      }

      // Общее финансы
      sumData.monthIncome += group.monthIncome;
      sumData.incomePerMember += group.incomePerMember;
      sumData.orders += group.orders;
      sumData.minPrice += group.minAdsPrice;
      sumData.maxPrice += group.maxAdsPrice;
      sumData.interestIndex += group.interestIndex;

      if (group.members <= 100) {
        sumData.smallGroupsIncome += group.totalIncome;
      }

      // Распределение по доходам
      if (group.totalIncome === 0) {
        sumData.incomeDistribution_0++;
      }
      if (group.totalIncome > 0 && group.totalIncome <= 5000) {
        sumData.incomeDistribution_0_5k++;
      }
      if (group.totalIncome > 5000 && group.totalIncome <= 20000) {
        sumData.incomeDistribution_5_20k++;
      }
      if (group.totalIncome > 20000 && group.totalIncome <= 50000) {
        sumData.incomeDistribution_20_50k++;
      }
      if (group.totalIncome > 50000 && group.totalIncome <= 100000) {
        sumData.incomeDistribution_50_100K++;
      }
      if (group.totalIncome > 100000 && group.totalIncome <= 500000) {
        sumData.incomeDistribution_100_500k++;
      }
      if (group.totalIncome > 500000) {
        sumData.incomeDistribution_500k++;
      }

      // Распределение заработавших более 50k по количеству подписчиков
      if (group.members <= 100) {
        sumData.groupsDistribution_100++;
      }
      if (group.members > 100 && group.members <= 500) {
        sumData.groupsDistribution_100_500++;
      }
      if (group.members > 500 && group.members <= 1000) {
        sumData.groupsDistribution_500_1k++;
      }
      if (group.members > 1000 && group.members <= 10000) {
        sumData.groupsDistribution_1k_10k++;
      }
      if (group.members > 10000 && group.members <= 50000) {
        sumData.groupsDistribution_10k_50k++;
      }
      if (group.members > 50000 && group.members <= 100000) {
        sumData.groupsDistribution_50k_100k++;
      }
      if (group.members > 100000 && group.members <= 500000) {
        sumData.groupsDistribution_100k_500k++;
      }
      if (group.members > 500000) {
        sumData.groupsDistribution_500k++;
      }

      if (group.totalIncome >= 50000) {
        if (group.members <= 100) {
          sumData.membersDistribution_100++;
        }
        if (group.members > 100 && group.members <= 500) {
          sumData.membersDistribution_100_500++;
        }
        if (group.members > 500 && group.members <= 1000) {
          sumData.membersDistribution_500_1k++;
        }
        if (group.members > 1000 && group.members <= 10000) {
          sumData.membersDistribution_1k_10k++;
        }
        if (group.members > 10000 && group.members <= 50000) {
          sumData.membersDistribution_10k_50k++;
        }
        if (group.members > 50000 && group.members <= 100000) {
          sumData.membersDistribution_50k_100k++;
        }
        if (group.members > 100000 && group.members <= 500000) {
          sumData.membersDistribution_100k_500k++;
        }
        if (group.members > 500000) {
          sumData.membersDistribution_500k++;
        }
      }

      if (group.type.includes('чат')) {
        // Чаты
        switch (group.type) {
          case 'Публичный чат':
            sumData.publicChats++;
            break;

          case 'Приватный чат':
            sumData.privateChats++;
            break;
        }

        sumData.messagesPerDay += group.messagesPerDay;
        sumData.chatIncome += group.totalIncome;
        sumData.incomePerMessage += group.incomePerMessage;
      } else {
        // Каналы
        switch (group.type) {
          case 'Публичный канал':
            sumData.publicChannels++;
            break;

          case 'Приватный канал':
            sumData.privateChannels++;
            break;
        }

        sumData.postsPerDay += group.postPerDay;
        sumData.channelIncome += group.totalIncome;
        sumData.incomePerPost += group.incomePerPost;
      }
    }

    sourceData.channels.forEach(updateSum);
    sourceData.chats.forEach(updateSum);

    // Создаем и заполняем объект категории
    const newCategory = {
      // Статистика
      id: categoryData.name,
      name: categoryData.descriptionShort,
      keywords: categoryData.description,
      groups: sumData.groups,
      members: sumData.members,
      smallGroupsPercent:
        Math.round(((sumData.smallGroups * 100) / sumData.groups) * 10) / 10,
      avgMembersPerGroup: Math.round(sumData.members / sumData.groups),
      avgGroupMonthsAge: Math.round(sumData.ageInMonths / sumData.groups),
      avgMembersWeeklyTrend: Math.round(
        sumData.membersWeeklyTrend / sumData.groups
      ),
      avgMembersMonthlyTrend: Math.round(
        sumData.membersMonthlyTrend / sumData.groups
      ),
      malePercent: Math.round(
        (sumData.males * 100) / (sumData.males + sumData.females)
      ),
      femalePercent: Math.round(
        (sumData.females * 100) / (sumData.males + sumData.females)
      ),
      abandonedGroupsPercent:
        Math.round(((sumData.abandonedGroups * 100) / sumData.groups) * 100) /
        100,

      // Финансы
      income: sumData.channelIncome + sumData.chatIncome,
      orders: sumData.orders,
      avgIncome: Math.round(
        (sumData.channelIncome + sumData.chatIncome) / sumData.groups
      ),
      avgMonthIncome: Math.round(sumData.monthIncome / sumData.groups),
      avgIncomePerMember:
        Math.round((sumData.incomePerMember / sumData.groups) * 10000) / 10000,
      avgMinAdsPrice: Math.round(sumData.minPrice / sumData.groups),
      avgMaxAdsPrice: Math.round(sumData.maxPrice / sumData.groups),
      interestIndex: sumData.interestIndex,
      avgInterestIndex: Math.round(sumData.interestIndex / sumData.groups),
      incomeDistributionPercent_0:
        Math.round(
          ((sumData.incomeDistribution_0 * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_0_5k:
        Math.round(
          ((sumData.incomeDistribution_0_5k * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_5_20k:
        Math.round(
          ((sumData.incomeDistribution_5_20k * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_20_50k:
        Math.round(
          ((sumData.incomeDistribution_20_50k * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_50_100K:
        Math.round(
          ((sumData.incomeDistribution_50_100K * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_100_500k:
        Math.round(
          ((sumData.incomeDistribution_100_500k * 100) / sumData.groups) * 10
        ) / 10,
      incomeDistributionPercent_500k:
        Math.round(
          ((sumData.incomeDistribution_500k * 100) / sumData.groups) * 10
        ) / 10,

      membersDistributionPercent_100:
        Math.round(
          ((sumData.membersDistribution_100 * 100) /
            sumData.groupsDistribution_100) *
            10
        ) / 10,
      membersDistributionPercent_100_500:
        Math.round(
          ((sumData.membersDistribution_100_500 * 100) /
            sumData.groupsDistribution_100_500) *
            10
        ) / 10,
      membersDistributionPercent_500_1k:
        Math.round(
          ((sumData.membersDistribution_500_1k * 100) /
            sumData.groupsDistribution_500_1k) *
            10
        ) / 10,
      membersDistributionPercent_1k_10k:
        Math.round(
          ((sumData.membersDistribution_1k_10k * 100) /
            sumData.groupsDistribution_1k_10k) *
            10
        ) / 10,
      membersDistributionPercent_10k_50k:
        Math.round(
          ((sumData.membersDistribution_10k_50k * 100) /
            sumData.groupsDistribution_10k_50k) *
            10
        ) / 10,
      membersDistributionPercent_50k_100k:
        Math.round(
          ((sumData.membersDistribution_50k_100k * 100) /
            sumData.groupsDistribution_50k_100k) *
            10
        ) / 10,
      membersDistributionPercent_100k_500k:
        Math.round(
          ((sumData.membersDistribution_100k_500k * 100) /
            sumData.groupsDistribution_100k_500k) *
            10
        ) / 10,
      membersDistributionPercent_500k:
        Math.round(
          ((sumData.membersDistribution_500k * 100) /
            sumData.groupsDistribution_500k) *
            10
        ) / 10,

      // Каналы
      publicChannels: sumData.publicChannels,
      privateChannels: sumData.privateChannels,
      publicChannelsPercent:
        Math.round(((sumData.publicChannels * 100) / sumData.groups) * 10) / 10,
      privateChannelsPercent:
        Math.round(((sumData.privateChannels * 100) / sumData.groups) * 10) /
        10,
      avgPostsPerDay: Math.round(
        sumData.postsPerDay / (sumData.publicChannels + sumData.privateChannels)
      ),
      avgChannelIncome: Math.round(
        sumData.channelIncome /
          (sumData.publicChannels + sumData.privateChannels)
      ),
      avgIncomePerPost:
        Math.round(
          (sumData.incomePerPost /
            (sumData.publicChannels + sumData.privateChannels)) *
            1000
        ) / 1000,

      // Чаты
      publicChats: sumData.publicChats,
      privateChat: sumData.privateChats,
      publicChatsPercent:
        Math.round(((sumData.publicChats * 100) / sumData.groups) * 10) / 10,
      privateChatPercent:
        Math.round(((sumData.privateChats * 100) / sumData.groups) * 10) / 10,
      avgMessagesPerDay: Math.round(
        sumData.messagesPerDay / (sumData.publicChats + sumData.privateChats)
      ),
      avgChatIncome: Math.round(
        sumData.chatIncome / (sumData.publicChats + sumData.privateChats)
      ),
      avgIncomePerMessage:
        Math.round(
          (sumData.incomePerMessage /
            (sumData.publicChats + sumData.privateChats)) *
            10000
        ) / 10000,
    };

    console.log(
      `Создание категории ${categoryData.descriptionShort} прошло успешно`
    );

    // Заменяем не конечные значения на 0
    Object.keys(newCategory).forEach((key) => {
      if (newCategory[key] === Infinity || Number.isNaN(newCategory[key])) {
        newCategory[key] = 0;
      }
    });

    categoriesDB.push(newCategory);
  }

  await writeJSON('categories_extended_data', outputDest, categoriesDB);
}
