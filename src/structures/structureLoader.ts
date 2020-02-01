import { readdirSync } from 'fs';

export function StructureLoader() {
  const structureFiles = readdirSync('./build/src/structures');

  for (const file of structureFiles) {
    if (file !== 'structureLoader.js' && file.endsWith('js')) {
      require(`./${file}`);
    }
  }
}
