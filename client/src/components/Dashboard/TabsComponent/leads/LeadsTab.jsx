'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeads, getMatches } from '@/services/leads';
import { Spinner, Button } from 'flowbite-react';
import { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import LeadsTable from './LeadsTable';
import LeadForm from './LeadForm';
import MatchesModal from './MatchesModal';

const LeadsTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [matchesModalOpen, setMatchesModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Query para obtener leads
  const {
    data: leadsData,
    isLoading: isLoadingLeads,
    isError: isErrorLeads,
    error: errorLeads,
  } = useQuery({
    queryKey: ['leads', currentPage, statusFilter],
    queryFn: () =>
      getLeads({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
    refetchOnMount: false,
  });

  // Query para obtener matches
  const { data: matchesData } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
    refetchOnMount: false,
  });

  const leads = leadsData?.docs || [];
  const totalPages = leadsData?.totalPages || 1;
  const matches = matchesData || [];

  const handleCreate = () => {
    setCurrentLead(null);
    setIsEdit(false);
    setOpenModal(true);
  };

  const handleEdit = (lead) => {
    setCurrentLead(lead);
    setIsEdit(true);
    setOpenModal(true);
  };

  const handleViewMatch = (leadId) => {
    setSelectedLeadId(leadId);
    setMatchesModalOpen(true);
  };

  const statusLabels = {
    all: 'Todos',
    esperando: 'Esperando',
    contactado: 'Contactado',
    vendido: 'Vendido',
    descartado: 'Descartado',
  };

  if (isLoadingLeads) {
    return (
      <div className="flex justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isErrorLeads) {
    return (
      <div className="p-4 text-red-600">
        Error cargando leads: {errorLeads?.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Gestión de Clientes (CRM)
        </h2>
        <Button onClick={handleCreate} size="sm">
          <IoAddCircleOutline className="mr-2 h-5 w-5" />
          Crear Lead
        </Button>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusLabels).map(([key, label]) => (
          <Button
            key={key}
            size="xs"
            color={statusFilter === key ? 'blue' : 'gray'}
            onClick={() => {
              setStatusFilter(key);
              setCurrentPage(1);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Estadísticas rápidas */}
      {matches.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              {matches.length} lead{matches.length !== 1 ? 's' : ''} con productos coincidentes
            </span>
          </div>
        </div>
      )}

      {/* Tabla de leads */}
      <LeadsTable
        leads={leads}
        matches={matches}
        onEdit={handleEdit}
        onViewMatch={handleViewMatch}
      />

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Modal de creación/edición */}
      <LeadForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        lead={currentLead}
        isEdit={isEdit}
      />

      {/* Modal de matches */}
      <MatchesModal
        open={matchesModalOpen}
        onClose={() => setMatchesModalOpen(false)}
        leadId={selectedLeadId}
        matches={matches}
      />
    </div>
  );
};

export default LeadsTab;
