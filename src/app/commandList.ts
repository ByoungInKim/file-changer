import { CMD } from "./types/command";

export const commandList: { [key: string]: CMD }  = {
  forward_1: { cmd: "앞에 추가", sub_cmd: "직접 입력한 문자열을 추가합니다.", t1: "추가할 문자열", t2: "추가할 위치 : 앞에서부터 아래 글자 수 뒤에 (맨 앞 = 0)" },
};