import React from 'react';
import { TableFileInfo } from './types/tableFileInfo';

interface FileListViewProps {
  tableFileInfoList: TableFileInfo[];
  moveRowUp: (index: number) => void;
  moveRowDown: (index: number) => void;
}

const FileListView: React.FC<FileListViewProps> =  ({ tableFileInfoList, moveRowUp, moveRowDown }) => {
    return (
        <div className="overflow-x-auto">
        <table className="table table-xs">
            <thead>
            <tr>
                <th></th>
                <th>현재이름</th>
                <th>바꿀이름</th>
                <th>현재폴더</th>
            </tr>
            </thead>
            <tbody>
            {tableFileInfoList.map((file, index) => (
            <tr key={index}>
              <th>
                <div className="join grid grid-cols-2">
                  <button className="join-item btn btn-xs" onClick={() => moveRowUp(index)}>↑</button>
                  <button className="join-item btn btn-xs" onClick={() => moveRowDown(index)}>↓</button>
                </div>
              </th>
              <td>{file.srcName}</td>
              <td>{file.destName}</td> 
              <td>{file.srcPath}</td>
            </tr>
          ))}
            </tbody>
        </table>
        </div>
    );
}

export default FileListView;