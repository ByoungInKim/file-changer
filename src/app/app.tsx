import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { FileInfo } from "./types/fileInfo";
import FileListView from "./FileListView"

declare global {
  interface Window {
    electron: {
      onFileOpened: (callback: (filePaths: string[]) => void) => void;
    }
  }
}

export default function App() {
  let orgFileInfoList: FileInfo[] = [];
  const [fileInfoList, setFileInfoList] = useState<FileInfo[]>([]);
  
  useEffect(() => {
    window.electron.onFileOpened((filePaths: string[]) => {
      const newDetails = filePaths.map(filePath => ({
        name: filePath.replace(/^.*[\\/]/, ''),
        path: filePath,
        size: 0, // 필요한 경우 파일 크기를 추가로 가져올 수 있습니다.
        lastModified: 0, // 필요한 경우 마지막 수정 시간을 추가로 가져올 수 있습니다.
      }));

      const uniqueDetails = newDetails.filter(newFile => 
        !orgFileInfoList.some(existingFile => existingFile.path === newFile.path)
      );

      orgFileInfoList = orgFileInfoList.concat(uniqueDetails)
      setFileInfoList(orgFileInfoList);
    });
  }, []);

  return (
    <div className="flex">
      {/* Sidebar*/}
      <div className="drawer drawer-open w-40">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
            {/* Sidebar content here */}
            <li><a>앞에 추가</a></li>
            <li><a>뒤에 추가</a></li>
            <li><a>v3</a></li>
            </ul>
         </div>
      </div>
      {/* Sidebar*/}
     <FileListView fileInfoList={fileInfoList} />
    </div>
  );
}

const root = createRoot(document.body);
root.render(
    <App/>
);
