
import './App.css';
import { Route } from 'react-router-dom';
import Myhomepage from './Pages/Myhomepage';
import Mychatpage from './Pages/Mychatpage';


function App() {
  return (
    <div className="App">
      <Route path='/' component={Myhomepage} exact />
      <Route path='/chats' component={Mychatpage} />
    </div>
  );
}

export default App;
