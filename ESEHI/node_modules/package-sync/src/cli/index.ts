import * as minimist from 'minimist';
// tslint:disable-next-line:import-name
import PackageSync from '../index';

const availableOptions = [
  'update',
  'check',
  'soft-check',
  'install',
];

const argv = minimist(process.argv.slice(2));

const selectedOptions = availableOptions.filter(option => (
  argv.hasOwnProperty(option)
));

if (selectedOptions.length === 0) {
  throw new Error(
    `You have to specify options. Available options:${
      availableOptions
        .map(option => `\n--${option}`)
        .join('')
    }`,
  );
}

if (selectedOptions.length !== 1) {
  throw new Error('You have to specify only one option.');
}

const [selectedOption] = selectedOptions;
const packageSync = new PackageSync();

const doWork = async () => {
  switch (selectedOption) {
    case 'update': {
      const result = await packageSync.updateCache();
      console.log(result);

      return;
    }
    case 'check': {
      const result = await packageSync.check();
      console.log(result);

      return;
    }
    case 'soft-check': {
      const result = await packageSync.softCheck();
      console.log(result);

      return;
    }
    case 'install': {
      const result = await packageSync.installNew();
      console.log(result);

      return;
    }
    default:
      throw new Error(`Unrecognized option: ${selectedOption}`);
  }
};

doWork();
