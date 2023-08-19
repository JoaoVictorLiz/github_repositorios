import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Main from '../src/pages/Main'
import Repositorio from '../src/pages/Repositorio'


export default function routes() {
  return (
   
    <BrowserRouter>
        <Routes>
            <Route index element={<Main />} path='/'/>
            <Route  element={<Repositorio />} path='/repositorio/:repositorio'/>
        </Routes>
    </BrowserRouter>
    
  )
}
