import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import App from "./App"
import store from "./redux/store"
import { ThemeProvider } from "./context/ThemeContext"
import { SearchContext } from "./context/SearchContext"
import "./index.css"

const Root = () => {
  const [query, setQuery] = useState("")
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <SearchContext.Provider value={{ query, setQuery }}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SearchContext.Provider>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />)



