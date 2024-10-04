import React, { useEffect, useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { FileInfo } from "./types/fileInfo";
import { CMD } from "./types/command";
import { TableFileInfo } from "./types/tableFileInfo";
import FileListView from "./FileListView"

// Todo.
// modal 에서 입력한것으로 tableInfo - destName, destPath 를 변경한다.
// apply 에서 syncTableFileInfoList를 loop 하면서 파일 이름 바꾼다.

declare global {
  interface Window {
    electron: {
      renameFile: (oldName: string, newName: string) => Promise<string>;

      onFileOpened: (callback: (filePaths: string[]) => void) => void;
      onModalOpen: (callback: (command: CMD) => void) => void;
      onApply: (callback: () => void) => void;
    }
  }
}

export default function App() {
  let syncTableFileInfoList: TableFileInfo[] = [];

  const [tableFileInfoList, setTableFileInfoList] = useState<TableFileInfo[]>([]);

  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalContent, setModalContent] = useState<CMD | null>(null);

  useEffect(() => {
    window.electron.onFileOpened((filePaths: string[]) => {
      const newDetails = filePaths.map(filePath => ({
        name: filePath.replace(/^.*[\\/]/, ''),
        path: filePath,
        size: 0, // 필요한 경우 파일 크기를 추가로 가져올 수 있습니다.
        lastModified: 0, // 필요한 경우 마지막 수정 시간을 추가로 가져올 수 있습니다.
      }));

      const uniqueDetails = newDetails.filter(newFile => 
        !syncTableFileInfoList.some(existingFile => existingFile.srcPath === newFile.path)
      );

      const tableFileInfos: TableFileInfo[] = uniqueDetails.map(file => ({
        srcName: file.name,
        destName: file.name,
        srcPath: file.path,
        destPath: file.path,
      }));

      syncTableFileInfoList = syncTableFileInfoList.concat(tableFileInfos)
      setTableFileInfoList(syncTableFileInfoList)
    });

    window.electron.onModalOpen((command: CMD) => {
      setModalContent(command)
      if (modalRef.current) {
        (modalRef.current as any).showModal();
      }
    });

    window.electron.onApply(() => {
      console.log("do apply")
      window.electron.renameFile(
        "C:\\Users\\keni\\workspace\\github\\file-changer\\test.txt",
        "C:\\Users\\keni\\workspace\\github\\file-changer\\test2.txt"
      ).then(result => {
        console.log(result);
      }).catch(error => {
        console.error('파일 이름 변경 실패:', error);
      });
    });

  }, []);

  return (
    <div className="flex">
      <FileListView tableFileInfoList={tableFileInfoList} />
     {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box">
          {modalContent && (
            <>
            <h3 className="font-bold text-lg">{modalContent.cmd}</h3>
            <h2 className="py-4">{modalContent.sub_cmd}</h2>
            <p className="py-2">{modalContent.t1}</p>
            <input type="text" placeholder={modalContent.t1} className="input input-bordered w-full max-w-xs" />
            <p className="py-2">{modalContent.t2}</p>
            <input type="text" placeholder={modalContent.t2} className="input input-bordered w-full max-w-xs" />
            </>
          )}
        <div className="flex justify-end mt-4">
          <button className="btn mr-2">확인</button>
          <button className="btn" onClick={() => (modalRef.current as any).close()}>취소</button>
        </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      </div>
  );
}

const root = createRoot(document.body);
root.render(
    <App/>
);
