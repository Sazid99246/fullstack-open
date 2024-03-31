import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

axios.get('http://localhost:3001/persons').then(response => {
    const phonebook = response.data;
    ReactDOM.createRoot(document.getElementById('root')).render(<App phonebook={phonebook} />)
})
