import React from 'react';
import { TableFileInfo } from './types/tableFileInfo';

interface FileListViewProps {
  tableFileInfoList: TableFileInfo[];
}

const FileListView: React.FC<FileListViewProps> = ({ tableFileInfoList }) => {
    return (
        <div className="overflow-x-auto">
        <table className="table table-xs">
            <thead>
            <tr>
                <th></th>
                <th>현재이름</th>
                <th>바꿀이름</th>
                <th>현재폴더</th>
                <th>바꿀폴더</th>
            </tr>
            </thead>
            <tbody>
            {tableFileInfoList.map((file, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{file.srcName}</td>
              <td>{file.destName}</td> 
              <td>{file.srcPath}</td>
              <td>{file.destPath}</td>
            </tr>
          ))}
            </tbody>
        </table>
        </div>
    );
}

export default FileListView;