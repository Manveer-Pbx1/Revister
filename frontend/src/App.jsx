import React from 'react'
import List from './List';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Notifications from './Notifications';
export default function App() {
  return (
    <Router>
    <div>
      <Routes>
      <Route path='/' element= {<List/> }/>
      <Route path='/notifications' element= {<Notifications/>}/>
      </Routes>
    </div>
    </Router>
  )
}
