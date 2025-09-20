import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import FrontApp from './FrontApp.jsx'
import { getAppMode } from './utils/appMode.js'
import './index.css'

// 根據環境決定載入哪個應用
const AppComponent = getAppMode() === 'admin' ? App : FrontApp;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppComponent />
  </React.StrictMode>,
)