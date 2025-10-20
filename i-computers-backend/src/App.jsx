import { useState } from 'react'
import './App.css'
import ProductCard from './components/productCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductCard name ="Gaming Laptop" des = "Intel i7 | 16GB RAM | 512GB SSD"price = "$1,199.99" image = "https://images.pexels.com/photos/18105/pexels-photo.jpg"/>

        <ProductCard
        name="Mechanical Keyboard"
        des="RGB Backlight | Blue Switches"
        price="$89.99"
        image="https://images.pexels.com/photos/4792729/pexels-photo-4792729.jpeg"
      />

       <ProductCard
        name="Gaming Mouse"
        des="16000 DPI | RGB | Wireless"
        price="$49.99"
        image="https://images.pexels.com/photos/3862636/pexels-photo-3862636.jpeg"
      />

      <ProductCard
        name="4K Monitor"
        des="27-inch | 144Hz | HDR"
        price="$329.99"
        image="https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg"
      />

    </>
  )
}

export default App
