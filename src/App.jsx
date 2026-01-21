//Página para montar todos los componentes!!!!
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound.jsx'
import Home from './pages/Home/Home.jsx';


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

/*   return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="games" element={<Games />} />
        <Route path="consoles" element={<Consoles />} />
        <Route path="merchandise" element={<Merchandise />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
    </Routes>
  ) */


export default App
