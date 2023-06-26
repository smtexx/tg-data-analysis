import { arrangeData } from '../common/arrangeData.js';
import { divide, finite } from '../common/dataAnalysis.js';
import { getDescription } from './getDescription.js';

export function analyzeGroup(group) {
  const newGroup = { ...group };

  const prices = [
    '24',
    '48',
    '72',
    'eternal',
    'native',
    'repost',
  ].map((type) => group[`adsPrice_${type}`]);

  newGroup.minAdsPrice = Math.min(
    ...prices.filter((price) => price !== 0)
  );
  newGroup.maxAdsPrice = Math.max(...prices);
  newGroup.totalIncome = group.orders * newGroup.minAdsPrice;
  newGroup.ageInMonths = finite(
    Math.floor(
      (Date.now() - new Date(group.created).valueOf()) / 2_628_000_000
    )
  );

  newGroup.monthIncome = divide(
    newGroup.totalIncome,
    newGroup.ageInMonths,
    0
  );

  newGroup.incomePerMember = divide(
    newGroup.totalIncome,
    group.members,
    3
  );

  newGroup.incomePerMessage = divide(
    newGroup.totalIncome,
    group.totalMessages,
    3
  );

  newGroup.actMessagesPerDay = divide(
    group.messagesPerMonth,
    30.42,
    0
  );

  newGroup.avgMessagesPerDay = divide(
    group.totalMessages,
    newGroup.ageInMonths * 30.42,
    0
  );

  newGroup.interestIndex =
    group.adsCardViews + group.adsCardFavorite * 5;

  const type =
    newGroup.citationIndex !== undefined ? 'channel' : 'chat';

  return arrangeData(newGroup, getDescription(type));
}
