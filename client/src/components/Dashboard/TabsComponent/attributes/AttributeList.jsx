'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Badge,
} from 'flowbite-react';
import { MdOutlineEdit, MdDelete } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAttribute } from '@/services/attributes';
import toast from 'react-hot-toast';

const AttributeList = ({ attributes, onEdit }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (id) => deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['attributes']);
      toast.success('Atributo eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar atributo');
    },
  });

  const handleDelete = (id, value) => {
    if (confirm(`¿Estás seguro de eliminar el atributo "${value}"?`)) {
      deleteMutation(id);
    }
  };

  const categoryColors = {
    processors: 'info',
    ram: 'success',
    storage: 'warning',
    so: 'purple',
    brands: 'pink',
  };

  const categoryLabels = {
    processors: 'Procesador',
    ram: 'RAM',
    storage: 'Almacenamiento',
    so: 'Sistema Operativo',
    brands: 'Marca',
  };

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>Categoría</TableHeadCell>
            <TableHeadCell>Valor</TableHeadCell>
            <TableHeadCell>Metadata</TableHeadCell>
            <TableHeadCell>Estado</TableHeadCell>
            <TableHeadCell>Acciones</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {attributes.map((attr) => (
            <TableRow
              key={attr._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <TableCell>
                <Badge color={categoryColors[attr.category] || 'gray'}>
                  {categoryLabels[attr.category] || attr.category}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {attr.value}
              </TableCell>
              <TableCell>
                {attr.metadata && Object.keys(attr.metadata).length > 0 ? (
                  <div className="text-xs space-y-1">
                    {Object.entries(attr.metadata)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <div key={key} className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">{key}:</span> {value}
                        </div>
                      ))}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Sin metadata</span>
                )}
              </TableCell>
              <TableCell>
                <Badge color={attr.active ? 'success' : 'failure'}>
                  {attr.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="xs"
                    color="blue"
                    onClick={() => onEdit(attr)}
                  >
                    <MdOutlineEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDelete(attr._id, attr.value)}
                  >
                    <MdDelete className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttributeList;
