import * as path from 'path';
import * as fs from 'fs/promises';
import { readJSON } from '../common/readJSON.js';
import { writeXlsxFile } from '../common/writeXlsxFile.js';

export async function exportGroupsToXLSX() {
  const sourceDest = path.join('data_dest', 'group_extended_data');
  const readyDest = path.join('data_dest', 'xlsx');
  const readyFileName = 'groups.xlsx';

  const dataChats = [];
  const dataChannels = [];

  const groupFileNames = await fs.readdir(sourceDest);

  for (let groupFileName of groupFileNames) {
    const categoryData = await readJSON(groupFileName, sourceDest);
    dataChannels.push(...categoryData.channels);
    dataChats.push(...categoryData.chats);
  }

  writeXlsxFile(path.join(readyDest, readyFileName), [
    {
      name: 'Chats',
      headers: Object.keys(dataChats[0]),
      flatData: dataChats,
    },
    {
      name: 'Channels',
      headers: Object.keys(dataChannels[0]),
      flatData: dataChannels,
    },
  ]);
}
