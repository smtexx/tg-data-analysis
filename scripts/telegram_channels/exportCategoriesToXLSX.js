import * as path from 'path';
import { readJSON } from '../common/readJSON.js';
import { writeXlsxFile } from '../common/writeXlsxFile.js';

export async function exportCategoriesToXLSX() {
  const sourceDest = path.join('data_dest', 'category_extended_data');
  const sourceFileName = 'categories_extended_data.json';
  const dataDest = path.join('data_dest', 'xlsx');
  const dataFileName = 'categories.xlsx';

  // Читаем json
  const categories = await readJSON(sourceFileName, sourceDest);
  const headers = Object.keys(categories[0]);

  // Записываем файл
  writeXlsxFile(path.join(dataDest, dataFileName), [
    {
      name: 'Categories',
      flatData: categories,
      headers,
    },
  ]);
}
