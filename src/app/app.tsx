import React from "react";
import { createRoot } from 'react-dom/client';
import FileListView from "./FileListView";

export default class App extends React.Component {
    render() {
      return (
        <div>
            <h1 className="font-bold text-2xl underline text-red-700">Hello App</h1>
            <FileListView/>
        </div>
      );
    }
}

const root = createRoot(document.body);
root.render(
    <React.StrictMode>
    <App/>
    </React.StrictMode>
);
