import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from 'flowbite-react';

import { ProductContext } from '@/context/productContext';
import { parseDataToModal, parseDate } from '@/utils';
import { useContext } from 'react';
import { MdOutlineEdit } from 'react-icons/md';
import { headTitle } from '../defaultValues';

const DashbProductList = ({ products }) => {
  const { setCurrentProduct, setIsEdit, setOpenModal } =
    useContext(ProductContext);

  const handleClickEdit = (product) => {
    const parsedObj = parseDataToModal(product);
    setCurrentProduct(parsedObj);
    setIsEdit(true);
    setOpenModal(true);
  };

  return (
    <Table hoverable>
      <TableHead>
        <TableRow>
          {headTitle.map((value) => (
            <TableHeadCell
              className="text-base transition-colors duration-500"
              key={value.key}
            >
              {value.label}
            </TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className="divide-y transition-colors duration-500">
        {products.map((product) => (
          <TableRow
            key={product._id}
            className="transition-colors duration-500 bg-mainLight-card text-base dark:border-gray-700 dark:bg-gray-800"
          >
            <TableCell className="transition-colors duration-500 whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {product.name}
            </TableCell>
            <TableCell>{product.active ? 'activo' : 'inactivo'}</TableCell>
            <TableCell>{product.disponibility}</TableCell>
            <TableCell>${product.price.buy}</TableCell>
            <TableCell>${product.price.minimun}</TableCell>
            <TableCell>${product.price.sale}</TableCell>
            <TableCell>${product.price.soldOn}</TableCell>
            <TableCell>{parseDate(product.createdOn)}</TableCell>
            <TableCell>
              <Button onClick={() => handleClickEdit(product)}>
                <MdOutlineEdit className="text-mainDark-white" size={20} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default DashbProductList;
