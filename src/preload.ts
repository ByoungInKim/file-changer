// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer  } from 'electron';
import { CMD } from './app/types/command';

contextBridge.exposeInMainWorld('electron', {
    renameFile: (oldName: string, newName: string) => ipcRenderer.invoke('rename-file', oldName, newName),

    onFileOpened: (callback: (filePaths: string[]) => void) => ipcRenderer.on('file-opened', (event, filePaths) => callback(filePaths)),
    onFileClear: (callback: () => void) => ipcRenderer.on('file-clear', (event) => callback()),

    onModalOpen: (callback: (command: CMD) => void) => ipcRenderer.on('modal-open', (event, command) => callback(command)),
    onDeleteAll: (callback: (command: CMD) => void) => ipcRenderer.on('delete-all', (event, command) => callback(command)),
    onApply: (callback: () => void) => ipcRenderer.on('apply', (event) => callback()),

});
