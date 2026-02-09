'use client';

import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from '@tremor/react';
import { Button } from 'flowbite-react';
import { FaEdit } from 'react-icons/fa';
import { format } from '@formkit/tempo';
import StatusBadge from './StatusBadge';
import WhatsAppButton from './WhatsAppButton';
import MatchIndicator from './MatchIndicator';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const LeadsTable = ({ leads, matches, onEdit, onViewMatch }) => {
  // Función para obtener el match count de un lead
  const getMatchCount = (leadId) => {
    const leadMatch = matches?.find((m) => m.leadId === leadId);
    return leadMatch?.matchCount || 0;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Cliente</TableHeaderCell>
            <TableHeaderCell>Presupuesto</TableHeaderCell>
            <TableHeaderCell>Requisitos</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Matches</TableHeaderCell>
            <TableHeaderCell>Contacto</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => {
            const matchCount = getMatchCount(lead._id);
            
            return (
              <TableRow key={lead._id}>
                <TableCell>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {lead.clientName}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(lead.budget)}
                  </span>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {lead.requirements?.brands?.length > 0 && (
                      <Badge size="xs" color="slate">
                        {lead.requirements.brands.join(', ')}
                      </Badge>
                    )}
                    {lead.requirements?.ramMin && (
                      <Badge size="xs" color="indigo">
                        RAM ≥{lead.requirements.ramMin}GB
                      </Badge>
                    )}
                    {lead.requirements?.processorBrand && (
                      <Badge size="xs" color="violet">
                        {lead.requirements.processorBrand}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                
                <TableCell>
                  <MatchIndicator
                    matchCount={matchCount}
                    onClick={() => onViewMatch(lead._id)}
                  />
                </TableCell>
                
                <TableCell>
                  <WhatsAppButton
                    clientName={lead.clientName}
                    whatsapp={lead.whatsapp}
                  />
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {format(new Date(lead.createdAt), 'DD/MM/YYYY')}
                  </span>
                </TableCell>
                
                <TableCell>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => onEdit(lead)}
                  >
                    <FaEdit className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {leads.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No hay leads para mostrar. Crea uno para comenzar.
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
