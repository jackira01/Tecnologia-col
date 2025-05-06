import { ProductContext } from '@/context/productContext'
import { useContext, useEffect } from 'react'
import { ProductPagination } from '../Pagination/ProductPagination'
import { Spinner } from 'flowbite-react'
import { getProducts } from '@/services/products'
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
      if (response.docs.length) {
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
    <div className='flex flex-col justify-center items-center w-full h-screen bg-gray-900'>
      {loaderProducts ? (
        <Spinner />
      ) : error ? (
        <p className='text-white'>{error}</p>
      ) : (
        <div className='grid gap-10 grid-cols-1 place-items-center w-screen md:grid-cols-2 lg:grid-cols-3'>
          {products.map(card => (
            /* Arreglar el tamaño maximo y minimo de la card */
            <CardComponent key={card._id} data={card} />
          ))}
          <ProductPagination />
        </div>
      )}
    </div>
  )
}
