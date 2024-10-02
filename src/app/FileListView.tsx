import React from 'react';
import { FileInfo } from './types/fileInfo';

// Todo.
// 빈값일떄 처리 
// row 전체다 같이 클릭가능하게 변경
// 테마 밝은걸로 변경

interface FileListViewProps {
  fileInfoList: FileInfo[];
}

const FileListView: React.FC<FileListViewProps> = ({ fileInfoList }) => {
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
            {fileInfoList.map((file, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td>{file.name}</td>
              <td>{file.name}</td> 
              <td>{file.path}</td>
              <td>{file.path}</td>
            </tr>
          ))}
            </tbody>
        </table>
        </div>
    );
}

export default FileListView;