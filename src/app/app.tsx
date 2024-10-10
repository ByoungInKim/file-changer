import React, { useEffect, useState, useRef } from "react";
import { createRoot } from 'react-dom/client';
import { FileInfo } from "./types/fileInfo";
import { CMD } from "./types/command";
import { TableFileInfo } from "./types/tableFileInfo";
import FileListView from "./FileListView"
import { transfomer } from "./transfomer/transfomer";

// Todo.
// 변경 기능 하나씩 추가 하기
// 테이블, 이름, 변경이름 좀더 넓게 쓰고 싶다.
// destName, destPath 에서 바뀐부분의 컬러를 변경하고 싶어 
declare global {
  interface Window {
    electron: {
      renameFile: (oldName: string, newName: string) => Promise<string>;

      onFileOpened: (callback: (filePaths: string[]) => void) => void;
      onFileClear: (callback: () => void) => void;
      onModalOpen: (callback: (command: CMD) => void) => void;
      onDeleteAll: (callback: (command: CMD) => void) => void;
      onApply: (callback: () => void) => void;
    }
  }
}

export default function App() {
  let syncTableFileInfoList: TableFileInfo[] = [];

  const [tableFileInfoList, setTableFileInfoList] = useState<TableFileInfo[]>([]);

  const modalRef = useRef<HTMLDialogElement>(null);
  const [modalContent, setModalContent] = useState<CMD | null>(null);
  const [inputT1, setInputT1] = useState<string>('');
  const [inputT2, setInputT2] = useState<string>('');

  useEffect(() => {
    window.electron.onModalOpen((command: CMD) => {
      setModalContent(command)
      if (modalRef.current) {
        (modalRef.current as any).showModal();
      }
    });


  }, []);

  useEffect(() => {
    window.electron.onFileOpened((filePaths: string[]) => {
      const newDetails = filePaths.map(filePath => ({
        name: filePath.replace(/^.*[\\/]/, ''),
        path: filePath.slice(0, filePath.length - filePath.replace(/^.*[\\/]/, '').length),
        size: 0, // 필요한 경우 파일 크기를 추가로 가져올 수 있습니다.
        lastModified: 0, // 필요한 경우 마지막 수정 시간을 추가로 가져올 수 있습니다.
      }));

      const uniqueDetails = newDetails.filter(newFile => 
        !tableFileInfoList.some(existingFile => existingFile.srcPath === newFile.path && existingFile.srcName === newFile.name)
      );

      const tableFileInfos: TableFileInfo[] = uniqueDetails.map((file, index) => ({
        id: index,
        srcName: file.name,
        destName: file.name,
        srcPath: file.path,
        destPath: file.path,
      }));

      syncTableFileInfoList = tableFileInfoList.concat(tableFileInfos)
      syncTableFileInfoList = syncTableFileInfoList.map((file, index) => ({
        id: index,
        srcName: file.srcName,
        destName: file.destName,
        srcPath: file.srcPath,
        destPath: file.destPath,
      }));
      setTableFileInfoList(syncTableFileInfoList)
    });

    window.electron.onApply(() => {
      const updatedList = tableFileInfoList.map(file => {
        const srcFullPath = `${file.srcPath}${file.srcName}`;
        const destFullPath = `${file.destPath}${file.destName}`;
  
        window.electron.renameFile(srcFullPath, destFullPath)
          .then(result => {
            console.log(`파일 이름 변경 성공: ${srcFullPath} -> ${destFullPath}`);
          })
          .catch(error => {
            console.error(`파일 이름 변경 실패: ${srcFullPath} -> ${destFullPath}`, error);
          });
  
        return { ...file, srcName: file.destName };
      });
  
      // 상태 업데이트
      setTableFileInfoList(updatedList);
    });

    window.electron.onDeleteAll((command: CMD) => {
      handleConfirm(command, "", "")
    });

    window.electron.onFileClear(() => {
      setTableFileInfoList([])
    });

  }, [tableFileInfoList]);

  const handleConfirm = (cmd: CMD, t1: string, t2: string) => {
    syncTableFileInfoList = tableFileInfoList.map((file: TableFileInfo, index: number) => {
      return transfomer(file, cmd, t1, t2, index);
    });

    setTableFileInfoList(syncTableFileInfoList);
    setInputT1('');
    (document.getElementById('my_modal_2') as any)?.close();
  };
  
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(tableFileInfoList);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    setTableFileInfoList(newItems);
  };

  const removeRow = (index: number) => {
    const newItems = Array.from(tableFileInfoList);
    newItems.splice(index, 1);
    setTableFileInfoList(newItems);
  };

  return (
    <div className="flex">
      <FileListView 
        tableFileInfoList={tableFileInfoList}
        onDragEnd={onDragEnd}
        removeRow={removeRow}
      />
     {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_2" className="modal" ref={modalRef}>
        <div className="modal-box">
        {modalContent && (
          <>
            <h3 className="font-bold text-lg">{modalContent.cmd}</h3>
            <h2 className="py-4">{modalContent.sub_cmd}</h2>
            <p className="py-2">{modalContent.t1}</p>
            <input
              type="text"
              placeholder={modalContent.t1}
              className="input input-bordered w-full max-w-xs"
              value={inputT1}
              onChange={(e) => setInputT1(e.target.value)}
            />
            {modalContent.t2.length >= 2 && (
              <>
                <p className="py-2">{modalContent.t2}</p>
                <input
                  type="text"
                  placeholder={modalContent.t2}
                  className="input input-bordered w-full max-w-xs"
                  value={inputT2}
                  onChange={(e) => setInputT2(e.target.value)}
                />
              </>
            )}
          </>
        )}
        <div className="flex justify-end mt-4">
        <button className="btn mr-2" onClick={() => handleConfirm(modalContent, inputT1, inputT2)}>확인</button>
        <button className="btn"  onClick={() => {
          (modalRef.current as any).close();
          setInputT1('');
        }}>취소</button>
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
