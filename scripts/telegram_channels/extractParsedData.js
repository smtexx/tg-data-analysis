import { finite } from '../common/dataAnalysis.js';

export function extractParsedData(
  group_telegaIn,
  groups_tgstatRu,
  category
) {
  const newGroup = {};
  // Общие свойства
  newGroup.category = category;
  newGroup.name = group_telegaIn.name;
  newGroup.description = group_telegaIn.description;
  newGroup.originLink = group_telegaIn.channelLink;
  newGroup.type = group_telegaIn.channelType
    .toLowerCase()
    .includes('приват')
    ? 'private'
    : 'public';
  newGroup.adsCardViews = finite(group_telegaIn.cardViews);
  newGroup.adsCardFavorite = finite(group_telegaIn.cardFavorite);
  newGroup.adsReviewsCount = finite(group_telegaIn.reviewsCount);
  newGroup.adsReviewsRating = finite(group_telegaIn.reviewsRating);
  newGroup.adsGroupRating = finite(group_telegaIn.channelRating);
  newGroup.orders = finite(group_telegaIn.orders);

  // Цены
  ['24', '48', '72', 'eternal', 'native', 'repost'].forEach(
    (type) => {
      const price = group_telegaIn.prices.find(
        (price) => price.priceType === type
      ) || {
        postReach: 0,
        cpv: 0,
        err_percent: 0,
        price: 0,
      };
      newGroup[`adsPrice_${type}`] = finite(price.price);
      newGroup[`adsPrice_${type}_reach`] = finite(price.postReach);
      newGroup[`adsPrice_${type}_cpv`] = finite(price.cpv);
      newGroup[`adsPrice_${type}_err`] = finite(price.err);
    }
  );

  // TGSTAT.RU
  const tgStat =
    groups_tgstatRu.find((group) =>
      group_telegaIn.channelLink.includes(group.channelID)
    ) || {};

  newGroup.members = finite(
    tgStat.subscribers || group_telegaIn.subscribers
  );
  newGroup.malePercent = finite(tgStat.male_percent);
  newGroup.femalePercent = finite(tgStat.female_percent);
  newGroup.membersWeeklyTrend = finite(
    parseInt(tgStat.subscribersWeekly_trend)
  );
  newGroup.membersMonthlyTrend = finite(
    parseInt(tgStat.subscribersMonthly_trend)
  );
  newGroup.created = !tgStat.channelCreated
    ? new Date().toDateString()
    : new Date(
        tgStat.channelCreated.split('.').reverse().join('-')
      ).toDateString();
  newGroup.totalMessages = finite(
    tgStat.totalPosts || tgStat.totalMessages
  );
  newGroup.messagesPerDay = finite(
    tgStat.postsPerDay || tgStat.messagesDay
  );
  newGroup.messagesPerWeek = finite(
    tgStat.postsPerWeek || tgStat.messagesWeek
  );
  newGroup.messagesPerMonth = finite(
    tgStat.postsPerMonth || tgStat.messagesMonth
  );

  // Специфичные свойства TGSTAT.RU
  if (group_telegaIn.channelType.toLowerCase().includes('канал')) {
    // Каналы
    newGroup.citationIndex = finite(tgStat.citationIndex);
    newGroup.channelMentions = finite(tgStat.channelMentions);
    newGroup.postMentions = finite(tgStat.postMentions);
    newGroup.reposts = finite(tgStat.reposts);
    newGroup.avgPostReach = finite(tgStat.averagePostReach);
    newGroup.errPercent = finite(tgStat.err_percent);
    newGroup.err24Percent = finite(tgStat.err24_percent);
    newGroup.avgAdsPostReach = finite(tgStat.averageAdsPostReach);
    newGroup.adsReach12h = finite(tgStat.adsReach_12h);
    newGroup.adsReach24h = finite(tgStat.adsReach_24h);
    newGroup.adsReach48h = finite(tgStat.adsReach_48h);
    newGroup.involvementPercent = finite(tgStat.involvement_percent);
    newGroup.subscribersRepost = finite(tgStat.subscribersRepost);
    newGroup.subscribersComment = finite(tgStat.subscribersComment);
    newGroup.subscribersReact = finite(tgStat.subscribersReact);
  } else {
    // Чаты
    newGroup.uniqMembersDay = finite(tgStat.uniqMembersDay);
    newGroup.uniqMembersWeek = finite(tgStat.uniqMembersWeek);
    newGroup.uniqMembersMonth = finite(tgStat.uniqMembersMonth);
    newGroup.onlineNow = finite(tgStat.onlineNow);
    newGroup.onlineDay = finite(tgStat.onlineDay);
    newGroup.onlineNight = finite(tgStat.onlineNight);
  }

  return newGroup;
}
