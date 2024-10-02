// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer  } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    onFileOpened: (callback: (filePaths: string[]) => void) => ipcRenderer.on('file-opened', (event, filePaths) => callback(filePaths)),
    removeFileOpenedListener: (callback: (event: Electron.IpcRendererEvent, filePaths: string[]) => void) => {
        ipcRenderer.removeListener('file-opened', callback);
      },
});
