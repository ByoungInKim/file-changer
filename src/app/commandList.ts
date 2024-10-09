import { CMD } from "./types/command";

export const commandList: { [key: string]: CMD }  = {
  delete_all: { cmd: "전체 지우기", sub_cmd: "전체 지우기", t1: "", t2: "" },
  rename_numbering: { cmd: "이름 바꾸고 번호 붙이기", sub_cmd: "아래에 입력한 문자열 뒤 에 1부터 순서대로 추가합니다.", t1: "변경할 문자열", t2: ""},
  forward_1: { cmd: "앞에 추가", sub_cmd: "직접 입력한 문자열을 추가합니다.", t1: "추가할 문자열", t2: "추가할 위치 : 앞에서부터 아래 글자 수 뒤에 (맨 앞 = 0)" },
};