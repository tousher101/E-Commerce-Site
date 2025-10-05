import Bannar from '../component/Bannar'
import Category from '../component/Category'
import Products from '../component/Product'

export default function Home() {
  return (
    <div className=' max-w-[1380] mx-auto overflow-hidden'>
      <Bannar/>
      <Category/>
      <Products/>
      </div>
  )
}
