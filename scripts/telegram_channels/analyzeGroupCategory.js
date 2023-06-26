import { arrangeData } from '../common/arrangeData.js';
import {
  calculateStat,
  divide,
  percent,
} from '../common/dataAnalysis.js';
import { getDescription } from './getDescription.js';

export function analyzeGroupCategory(categoryInitialData, groups) {
  const newStatistic = {};
  newStatistic.name = categoryInitialData.descriptionShort;
  newStatistic.keywords = categoryInitialData.description;

  const statData = calculateStat(groups, [
    // Общее
    {
      type: 'counter',
      outcomeName: 'groupsCount',
      propertyName: 'originLink',
    },
    {
      type: 'sum',
      outcomeName: 'membersSum',
      propertyName: 'members',
    },
    {
      type: 'counter',
      outcomeName: 'smallGroupsCount',
      propertyName: 'members',
      conditions: [{ type: '<', value: 500 }],
    },
    {
      type: 'sum',
      outcomeName: 'monthsAgeSum',
      propertyName: 'ageInMonths',
    },
    {
      type: 'sum',
      outcomeName: 'weeklyTrendSum',
      propertyName: 'membersWeeklyTrend',
    },
    {
      type: 'sum',
      outcomeName: 'monthlyTrendSum',
      propertyName: 'membersMonthlyTrend',
    },
    {
      type: 'sum',
      outcomeName: 'malePercentSum',
      propertyName: 'malePercent',
    },
    {
      type: 'sum',
      outcomeName: 'femalePercentSum',
      propertyName: 'femalePercent',
    },
    {
      type: 'counter',
      outcomeName: 'genderDefinedCount',
      propertyName: 'femalePercent',
      conditions: [{ type: '!=', value: 0 }],
    },
    {
      type: 'counter',
      outcomeName: 'abandonedGroupsCount',
      propertyName: 'messagesPerMonth',
      conditions: [{ type: '=', value: 0 }],
    },
    {
      type: 'counter',
      outcomeName: 'publicGroupsCount',
      propertyName: 'type',
      conditions: [{ type: '=', value: 'public' }],
    },
    {
      type: 'counter',
      outcomeName: 'privateGroupsCount',
      propertyName: 'type',
      conditions: [{ type: '=', value: 'private' }],
    },
    {
      type: 'sum',
      outcomeName: 'actMessagesPerDaySum',
      propertyName: 'actMessagesPerDay',
    },
    // Финансы
    {
      type: 'sum',
      outcomeName: 'totalIncomeSum',
      propertyName: 'totalIncome',
    },
    {
      type: 'sum',
      outcomeName: 'ordersSum',
      propertyName: 'orders',
    },
    {
      type: 'sum',
      outcomeName: 'monthIncomeSum',
      propertyName: 'monthIncome',
    },
    {
      type: 'sum',
      outcomeName: 'incomePerMemberSum',
      propertyName: 'incomePerMember',
    },
    {
      type: 'sum',
      outcomeName: 'minAdsPriceSum',
      propertyName: 'minAdsPrice',
    },
    {
      type: 'sum',
      outcomeName: 'maxAdsPriceSum',
      propertyName: 'maxAdsPrice',
    },
    {
      type: 'sum',
      outcomeName: 'interestIndexSum',
      propertyName: 'interestIndex',
    },
    {
      type: 'sum',
      outcomeName: 'incomePerMessageSum',
      propertyName: 'incomePerMessage',
    },
    {
      type: 'counter',
      outcomeName: 'ADP_6_Count',
      propertyName: 'ageInMonths',
      conditions: [{ type: '<', value: 6 }],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_6_12_Count',
      propertyName: 'ageInMonths',
      conditions: [
        { type: '>=', value: 6 },
        { type: '<', value: 12 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_12_18_Count',
      propertyName: 'ageInMonths',
      conditions: [
        { type: '>=', value: 12 },
        { type: '<', value: 18 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_18_24_Count',
      propertyName: 'ageInMonths',
      conditions: [
        { type: '>=', value: 18 },
        { type: '<', value: 24 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_24_30_Count',
      propertyName: 'ageInMonths',
      conditions: [
        { type: '>=', value: 24 },
        { type: '<', value: 30 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_30_36_Count',
      propertyName: 'ageInMonths',
      conditions: [
        { type: '>=', value: 30 },
        { type: '<', value: 36 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'ADP_36_Count',
      propertyName: 'ageInMonths',
      conditions: [{ type: '>=', value: 36 }],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_100_Count',
      propertyName: 'members',
      conditions: [{ type: '<', value: 100 }],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_100_500_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 100 },
        { type: '<', value: 500 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_500_1k_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 500 },
        { type: '<', value: 1000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_1k_10k_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 1000 },
        { type: '<', value: 10000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_10k_50k_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 10000 },
        { type: '<', value: 50000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_50k_100k_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 50000 },
        { type: '<', value: 100000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_100k_500k_Count',
      propertyName: 'members',
      conditions: [
        { type: '>=', value: 100000 },
        { type: '<', value: 500000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'SDP_500k_Count',
      propertyName: 'members',
      conditions: [{ type: '>=', value: 500000 }],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_0_Count',
      propertyName: 'totalIncome',
      conditions: [{ type: '=', value: 0 }],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_0_5k_Count',
      propertyName: 'totalIncome',
      conditions: [
        { type: '>', value: 0 },
        { type: '<', value: 5000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_5_20k_Count',
      propertyName: 'totalIncome',
      conditions: [
        { type: '>=', value: 5000 },
        { type: '<', value: 20000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_20_50k_Count',
      propertyName: 'totalIncome',
      conditions: [
        { type: '>=', value: 20000 },
        { type: '<', value: 50000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_50_100k_Count',
      propertyName: 'totalIncome',
      conditions: [
        { type: '>=', value: 50000 },
        { type: '<', value: 100000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_100_500k_Count',
      propertyName: 'totalIncome',
      conditions: [
        { type: '>=', value: 100000 },
        { type: '<', value: 500000 },
      ],
    },
    {
      type: 'counter',
      outcomeName: 'IDP_500k_Count',
      propertyName: 'totalIncome',
      conditions: [{ type: '>=', value: 500000 }],
    },
  ]);

  const profitableStat = calculateStat(
    groups.filter((group) => group.totalIncome >= 50000),
    [
      {
        type: 'counter',
        outcomeName: 'groupsCount',
        propertyName: 'members',
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_100_Count',
        propertyName: 'members',
        conditions: [{ type: '<', value: 100 }],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_100_500_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 100 },
          { type: '<', value: 500 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_500_1k_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 500 },
          { type: '<', value: 1000 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_1k_10k_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 1000 },
          { type: '<', value: 10000 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_10k_50k_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 10000 },
          { type: '<', value: 50000 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_50k_100k_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 50000 },
          { type: '<', value: 100000 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_100k_500k_Count',
        propertyName: 'members',
        conditions: [
          { type: '>=', value: 100000 },
          { type: '<', value: 500000 },
        ],
      },
      {
        type: 'counter',
        outcomeName: 'PSDP_500k_Count',
        propertyName: 'members',
        conditions: [{ type: '>=', value: 500000 }],
      },
    ]
  );

  // Обработка свойств
  // Общее
  newStatistic.groups = statData.groupsCount;
  newStatistic.members = statData.membersSum;
  newStatistic.smallGroupsPercent = percent(
    statData.smallGroupsCount,
    statData.groupsCount,
    1
  );
  newStatistic.avgMembersPerGroup = divide(
    statData.membersSum,
    statData.groupsCount,
    0
  );

  newStatistic.avgGroupMonthsAge = divide(
    statData.monthsAgeSum,
    statData.groupsCount,
    0
  );

  newStatistic.membersWeeklyTrend = statData.weeklyTrendSum;
  newStatistic.membersMonthlyTrend = statData.monthlyTrendSum;
  newStatistic.avgMalePercent = divide(
    statData.malePercentSum,
    statData.genderDefinedCount,
    1
  );
  newStatistic.avgFemalePercent = divide(
    statData.femalePercentSum,
    statData.genderDefinedCount,
    1
  );
  newStatistic.abandonedGroupsPercent = percent(
    statData.abandonedGroupsCount,
    statData.groupsCount,
    1
  );
  newStatistic.publicPercent = percent(
    statData.publicGroupsCount,
    statData.groupsCount,
    1
  );
  newStatistic.privatePercent = percent(
    statData.privateGroupsCount,
    statData.groupsCount,
    1
  );
  newStatistic.avgMessagesPerDay = divide(
    statData.actMessagesPerDaySum,
    statData.groupsCount,
    0
  );
  // Финансы
  newStatistic.income = statData.totalIncomeSum;
  newStatistic.orders = statData.ordersSum;
  newStatistic.avgIncome = divide(
    statData.totalIncomeSum,
    statData.groupsCount,
    0
  );
  newStatistic.avgMonthIncome = divide(
    statData.monthIncomeSum,
    statData.groupsCount,
    0
  );
  newStatistic.avgIncomePerMember = divide(
    statData.incomePerMemberSum,
    statData.groupsCount,
    2
  );
  newStatistic.avgIncomePerMessage = divide(
    statData.incomePerMessageSum,
    statData.groupsCount,
    2
  );
  newStatistic.avgMinAdsPrice = divide(
    statData.minAdsPriceSum,
    statData.groupsCount,
    0
  );
  newStatistic.avgMaxAdsPrice = divide(
    statData.maxAdsPriceSum,
    statData.groupsCount,
    0
  );
  newStatistic.interestIndex = statData.interestIndexSum;
  newStatistic.avgInterestIndex = divide(
    statData.interestIndexSum,
    statData.groupsCount,
    0
  );
  // Статистика
  newStatistic.ADP_6 = percent(
    statData.ADP_6_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_6_12 = percent(
    statData.ADP_6_12_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_12_18 = percent(
    statData.ADP_12_18_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_18_24 = percent(
    statData.ADP_18_24_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_24_30 = percent(
    statData.ADP_24_30_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_30_36 = percent(
    statData.ADP_30_36_Count,
    statData.groupsCount,
    1
  );
  newStatistic.ADP_36 = percent(
    statData.ADP_36_Count,
    statData.groupsCount,
    1
  );

  newStatistic.SDP_100 = percent(
    statData.SDP_100_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_100_500 = percent(
    statData.SDP_100_500_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_500_1k = percent(
    statData.SDP_500_1k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_1k_10k = percent(
    statData.SDP_1k_10k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_10k_50k = percent(
    statData.SDP_10k_50k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_50k_100k = percent(
    statData.SDP_50k_100k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_100k_500k = percent(
    statData.SDP_100k_500k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.SDP_500k = percent(
    statData.SDP_500k_Count,
    statData.groupsCount,
    1
  );

  newStatistic.IDP_0 = percent(
    statData.IDP_0_Count,
    statData.groupsCount,
    1
  );
  newStatistic.IDP_0_5k = percent(
    statData.IDP_0_5k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.IDP_5_20k = percent(
    statData.IDP_5_20k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.IDP_20_50k = percent(
    statData.IDP_20_50k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.IDP_50_100k = percent(
    statData.IDP_50_100k_Count,
    statData.groupsCount,
    1
  );

  newStatistic.IDP_100_500k = percent(
    statData.IDP_100_500k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.IDP_500k = percent(
    statData.IDP_500k_Count,
    statData.groupsCount,
    1
  );
  newStatistic.PSDP_100 = percent(
    profitableStat.PSDP_100_Count,
    statData.SDP_100_Count,
    1
  );
  newStatistic.PSDP_100_500 = percent(
    profitableStat.PSDP_100_500_Count,
    statData.SDP_100_500_Count,
    1
  );
  newStatistic.PSDP_500_1k = percent(
    profitableStat.PSDP_500_1k_Count,
    statData.SDP_500_1k_Count,
    1
  );
  newStatistic.PSDP_1k_10k = percent(
    profitableStat.PSDP_1k_10k_Count,
    statData.SDP_1k_10k_Count,
    1
  );
  newStatistic.PSDP_10k_50k = percent(
    profitableStat.PSDP_10k_50k_Count,
    statData.SDP_10k_50k_Count,
    1
  );
  newStatistic.PSDP_50k_100k = percent(
    profitableStat.PSDP_50k_100k_Count,
    statData.SDP_50k_100k_Count,
    1
  );
  newStatistic.PSDP_100k_500k = percent(
    profitableStat.PSDP_100k_500k_Count,
    statData.SDP_100k_500k_Count,
    1
  );
  newStatistic.PSDP_500k = percent(
    profitableStat.PSDP_500k_Count,
    statData.SDP_500k_Count,
    1
  );

  return arrangeData(newStatistic, getDescription('category'));
}
