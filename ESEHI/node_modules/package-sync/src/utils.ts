import { exec } from 'child_process';
import { mkdir, readFile, stat, writeFile } from 'fs';

export function makeDirDeep(dirPath: string): Promise<void> {
  return new Promise(async (res, rej) => {
    try {
      const dirExists = await exists(dirPath);

      if (dirExists) {
        res();

        return;
      }
    } catch (err) {
      rej(err);

      return;
    }

    mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        rej(err);

        return;
      }

      res();
    });
  });
}

export function exists(dirPath: string): Promise<boolean> {
  return new Promise((res, rej) => {
    stat(dirPath, (err, stats) => {
      if (err) {
        rej(err);

        return;
      }

      // @FIXME
      res(true);
    });
  });
}

export function getFileData(filePath: string): Promise<string> {
  return new Promise((res, rej) => {
    readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        rej(err);

        return;
      }

      res(data);
    });
  });
}

export function writeFileData(filePath: string, content: string): Promise<void> {
  return new Promise((res, rej) => {
    writeFile(filePath, content, 'utf-8', (err) => {
      if (err) {
        rej(err);

        return;
      }

      res();
    });
  });
}

type ExecOutput = {
  stdout: string;
  stderr: string;
};

export function execCommand(command: string): Promise<ExecOutput> {
  return new Promise((res, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        rej(err);

        return;
      }

      res({
        stdout,
        stderr,
      });
    });
  });
}
