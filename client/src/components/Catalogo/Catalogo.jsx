import { ProductContext } from '@/context/productContext'
import { useContext, useEffect } from 'react'
import { ProductPagination } from '../Pagination/ProductPagination'
import { Spinner } from 'flowbite-react'
import { getProducts } from '@/services/products'
import SideBarComponent from '../SideBar/SideBarComponent'
const { CardComponent } = require('./CardComponent')

export const Catalogo = () => {
  const {
    products,
    loaderProducts,
    setLoaderProducts,
    setProducts,
    setTotalPages,
    error,
    setError,
  } = useContext(ProductContext)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoaderProducts(true)
      const response = await getProducts()
      if (response?.docs.length) {
        setTotalPages(response.totalPages)
        setProducts(response.docs)
        setLoaderProducts(false)
      } else {
        setError('No se encontraron productos')
        setProducts([])
        setLoaderProducts(false)
      }
    }
    fetchProducts()

    return () => {
      setTotalPages(1)
      setProducts([])
    }
  }, [setLoaderProducts, setProducts, setTotalPages])

  return (
    <>
      <SideBarComponent className='bg-[#31363F]' />

      <div className='flex flex-col justify-center items-center w-full min-h-screen bg-gray-900'>
        {loaderProducts ? (
          <Spinner />
        ) : error ? (
          <p className='text-white'>{error}</p>
        ) : (
          <div className='w-full my-10 px-10'>
            <div className='mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {products.map(data => (
                <div key={data._id} className='h-full flex justify-center'>
                  <CardComponent data={data} />
                </div>
              ))}
            </div>
            <ProductPagination />
          </div>
        )}
      </div>
    </>
  )
}
