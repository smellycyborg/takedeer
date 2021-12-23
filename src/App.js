import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './elements/Home.js';
import User from './elements/User.js'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/User/:id' element={<User />} />
      </Routes>
    </Router>
  );
};

export default App;
