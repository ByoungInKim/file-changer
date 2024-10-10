import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TableFileInfo } from './types/tableFileInfo';

interface FileListViewProps {
  tableFileInfoList: TableFileInfo[];
  onDragEnd: (result: any) => void;
  removeRow: (index: number) => void;
}

const FileListView: React.FC<FileListViewProps> = ({ tableFileInfoList, onDragEnd, removeRow }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div className="overflow-x-auto" {...provided.droppableProps} ref={provided.innerRef}>
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
                  <Draggable key={file.id} draggableId={file.id.toString()} index={index}>
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <th>
                          <button className="btn btn-circle btn-outline btn-xs" onClick={() => removeRow(index)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            </button>
                        </th>
                        <td>{file.srcName}</td>
                        <td>{file.destName}</td>
                        <td>{file.srcPath}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FileListView;
