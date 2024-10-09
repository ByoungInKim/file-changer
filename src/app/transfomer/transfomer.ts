import { TableFileInfo } from '../types/tableFileInfo';
import { CMD } from '../types/command';

export const transfomer = (file: TableFileInfo, cmd: CMD, t1: string, t2: string, index: number): TableFileInfo => {
    let destName = file.destName
    if (cmd.cmd == "전체 지우기") {
        destName = file.destName.slice(file.destName.lastIndexOf('.'));
    }
    else if (cmd.cmd == "앞에 추가") {
        destName = t1 + file.destName;
    }
    else if (cmd.cmd == "이름 바꾸고 번호 붙이기") {
        const ext = file.destName.slice(file.destName.lastIndexOf('.'));
        destName = t1 + (index+1).toString() + ext
    }

  return {
    ...file,
    destName: destName,
  };
};
