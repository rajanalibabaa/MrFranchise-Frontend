import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import {Provider} from "react-redux"
import App from './App.jsx'
import store from './Redux/Store/Index.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
<Provider store={store}>
<BrowserRouter>
<App />
</BrowserRouter> 
</Provider>)
=======
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
>>>>>>> caf0e5a4f3f3020d891d1d3b4647e0c8ec95ecb1
