// import { processExtendedCategoryStat } from './scripts/telegram_channels/processExtendedCategoryStat.js';
// import { processExtendedChannelStat } from './scripts/telegram_channels/processExtendedChannelStat.js';
// import { exportCategoriesToXLSX } from './scripts/telegram_channels/exportCategoriesToXLSX.js';
// import { exportGroupsToXLSX } from './scripts/telegram_channels/exportGroupsToXLSX.js';

import { handleData } from './scripts/telegram_channels/handleData.js';

(async () => {
  // await processExtendedChannelStat();
  // await processExtendedCategoryStat();
  // await exportCategoriesToXLSX();
  // await exportGroupsToXLSX();
  await handleData();
})();
