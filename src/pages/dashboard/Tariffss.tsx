import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

const PAGE_SIZE = 50;

export interface Tariff {
  id: number;
  name: string;
  description: string;
  days_count: number;
  price: number;
  filters_count: number;
  create_dttm: string;
  update_dttm: string;
}

export interface TariffsApiResponse {
  items: Tariff[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Tariffs: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // State for Create & Edit Dialog
  const [openDialog, setOpenDialog] = useState(false);
  // Distinguish between "create" or "edit"
  const [isEditMode, setIsEditMode] = useState(false);

  // Current Tariff data in the form
  const [currentTariff, setCurrentTariff] = useState<Tariff | null>(null);

  // State for Delete confirmation
  const [deleteTariffId, setDeleteTariffId] = useState<number | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // --------------------------------------------------------------------------
  // Fetch multiple tariffs (list)
  // --------------------------------------------------------------------------
  const fetchTariffs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/tariffs/?page=${pageNumber}&size=${PAGE_SIZE}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234', // Example header
          login: 'admin' // Example header
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data: TariffsApiResponse = await response.json();
      setTariffs(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Get one tariff by ID (used for editing)
  // --------------------------------------------------------------------------
  const getTariffById = async (tariffId: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/tariffs/${tariffId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data: Tariff = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tariff:', error);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // Create a new tariff
  // --------------------------------------------------------------------------
  const createTariff = async (tariffData: Omit<Tariff, 'id' | 'create_dttm' | 'update_dttm'>) => {
    try {
      const response = await fetch('https://api.a-b-d.ru/admin/tariffs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(tariffData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      // Refresh list
      fetchTariffs(page);
    } catch (error) {
      console.error('Error creating tariff:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Update an existing tariff
  // --------------------------------------------------------------------------
  const updateTariff = async (tariffId: number, tariffData: Partial<Tariff>) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/tariffs/${tariffId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(tariffData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      // Refresh list
      fetchTariffs(page);
    } catch (error) {
      console.error('Error updating tariff:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Delete an existing tariff
  // --------------------------------------------------------------------------
  const deleteTariff = async (tariffId: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/tariffs/${tariffId}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      // Refresh list
      fetchTariffs(page);
    } catch (error) {
      console.error('Error deleting tariff:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for opening/closing dialogs
  // --------------------------------------------------------------------------
  const handleOpenCreate = () => {
    setIsEditMode(false);
    setCurrentTariff({
      id: 0,
      name: '',
      description: '',
      days_count: 0,
      price: 0,
      filters_count: 0,
      create_dttm: '',
      update_dttm: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (id: number) => {
    setIsEditMode(true);
    const foundTariff = await getTariffById(id);
    if (foundTariff) {
      setCurrentTariff(foundTariff);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTariff(null);
  };

  // --------------------------------------------------------------------------
  // Handler for saving changes (create or update)
  // --------------------------------------------------------------------------
  const handleSaveTariff = async () => {
    if (!currentTariff) return;

    const { id, ...rest } = currentTariff;
    // Convert to the shape needed by the API
    const requestData = {
      name: rest.name,
      description: rest.description,
      days_count: rest.days_count,
      price: rest.price,
      filters_count: rest.filters_count
    };

    if (isEditMode) {
      // Update
      await updateTariff(id, requestData);
    } else {
      // Create
      await createTariff(requestData);
    }

    // Close dialog
    setOpenDialog(false);
    setCurrentTariff(null);
  };

  // --------------------------------------------------------------------------
  // Handlers for deleting
  // --------------------------------------------------------------------------
  const handleOpenDeleteConfirm = (tariffId: number) => {
    setDeleteTariffId(tariffId);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteTariffId(null);
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteTariffId) {
      await deleteTariff(deleteTariffId);
    }
    handleCloseDeleteConfirm();
  };

  // --------------------------------------------------------------------------
  // Fetch tariffs on mount / page change
  // --------------------------------------------------------------------------
  useEffect(() => {
    fetchTariffs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Тарифы</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Создать тариф
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Кол-во дней</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Кол-во фильтров</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Дата обновления</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tariffs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Данных пока нет
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              tariffs.map((tariff) => (
                <TableRow key={tariff.id}>
                  <TableCell>{tariff.id}</TableCell>
                  <TableCell>{tariff.name}</TableCell>
                  <TableCell>{tariff.description}</TableCell>
                  <TableCell>{tariff.days_count}</TableCell>
                  <TableCell>{tariff.price}</TableCell>
                  <TableCell>{tariff.filters_count}</TableCell>
                  <TableCell>{new Date(tariff.create_dttm).toLocaleString()}</TableCell>
                  <TableCell>{new Date(tariff.update_dttm).toLocaleString()}</TableCell>
                  <TableCell sx={{display: "flex"}}>
                    <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleOpenEdit(tariff.id)}>
                      Редактировать
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleOpenDeleteConfirm(tariff.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
      </Box>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Редактировать тариф' : 'Создать тариф'}</DialogTitle>
        <DialogContent dividers>
          {currentTariff && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Название"
                value={currentTariff.name}
                onChange={(e) => setCurrentTariff((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
              <TextField
                label="Описание"
                value={currentTariff.description}
                onChange={(e) => setCurrentTariff((prev) => (prev ? { ...prev, description: e.target.value } : null))}
              />
              <TextField
                label="Кол-во дней"
                type="text"
                value={currentTariff.days_count}
                onChange={(e) => setCurrentTariff((prev) => (prev ? { ...prev, days_count: Number(e.target.value) } : null))}
              />
              <TextField
                label="Цена"
                type="text"
                value={currentTariff.price}
                onChange={(e) => setCurrentTariff((prev) => (prev ? { ...prev, price: Number(e.target.value) } : null))}
              />
              <TextField
                label="Кол-во фильтров"
                type="text"
                value={currentTariff.filters_count}
                onChange={(e) => setCurrentTariff((prev) => (prev ? { ...prev, filters_count: Number(e.target.value) } : null))}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveTariff}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Удалить тариф?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот тариф?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Отмена</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tariffs;
