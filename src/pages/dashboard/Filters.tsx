import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PAGE_SIZE = 50;

export interface FilterItem {
  id: number;
  user_id: number; // Игнорируем при PUT
  manufacture_id: number;
  model_id: number;
  series_id: number;
  equipment_id: number;
  engine_type_id: number;
  car_color_id: number;
  mileage_from: number;
  mileage_defore: number;
  price_from: number;
  price_defore: number;
  date_release_from: string;
  date_release_defore: string;
  create_dttm: string; // Можно тоже редактировать, если нужно
  update_dttm: string; // Можно тоже редактировать, если нужно
}

export interface FilterApiResponse {
  items: FilterItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Filters = () => {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================
  // ДИАЛОГ редактирования
  // ==========================
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterItem | null>(null);

  // Храним значения для полей редактирования
  const [editFormValues, setEditFormValues] = useState({
    manufacture_id: '',
    model_id: '',
    series_id: '',
    equipment_id: '',
    engine_type_id: '',
    car_color_id: '',
    mileage_from: '',
    mileage_defore: '',
    price_from: '',
    price_defore: '',
    date_release_from: '',
    date_release_defore: '',
    create_dttm: '',
    update_dttm: ''
  });

  // ==========================
  // ДИАЛОГ удаления
  // ==========================
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ==========================
  // Загрузка списка
  // ==========================
  const fetchFilters = async (currentPage: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/filters/?page=${currentPage}&size=${PAGE_SIZE}`, {
        headers: {
          Accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: FilterApiResponse = await response.json();
      setFilters(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters(page);
  }, [page]);

  // ==========================
  // УДАЛЕНИЕ
  // ==========================
  const handleOpenDeleteDialog = (filter: FilterItem) => {
    setSelectedFilter(filter);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedFilter(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedFilter) return;

    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/filters/${selectedFilter.id}`, {
        method: 'DELETE',
        headers: {
          auth: 'abcd-1234',
          login: 'admin'
        }
      });

      if (response.status === 204) {
        // Успешно удалили: убираем из списка
        setFilters((prev) => prev.filter((f) => f.id !== selectedFilter.id));
      } else {
        console.error('Не удалось удалить фильтр');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // ==========================
  // РЕДАКТИРОВАНИЕ
  // ==========================
  const handleOpenEditDialog = (filter: FilterItem) => {
    setSelectedFilter(filter);

    // Заполняем форму ВСЕМИ нужными полями (string, чтобы удобно в TextField)
    setEditFormValues({
      manufacture_id: String(filter.manufacture_id),
      model_id: String(filter.model_id),
      series_id: String(filter.series_id),
      equipment_id: String(filter.equipment_id),
      engine_type_id: String(filter.engine_type_id),
      car_color_id: String(filter.car_color_id),
      mileage_from: String(filter.mileage_from),
      mileage_defore: String(filter.mileage_defore),
      price_from: String(filter.price_from),
      price_defore: String(filter.price_defore),
      date_release_from: filter.date_release_from,
      date_release_defore: filter.date_release_defore,
      create_dttm: filter.create_dttm,
      update_dttm: filter.update_dttm
    });

    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedFilter(null);
    setEditDialogOpen(false);
  };

  const handleEditFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    if (!selectedFilter) return;

    // Собираем новые значения
    const updatedData = {
      // старые поля, кроме лишних
      ...selectedFilter,
      // user_id НЕ передаём!
      user_id: undefined,

      // А нужные обновляем из формы
      manufacture_id: Number(editFormValues.manufacture_id),
      model_id: Number(editFormValues.model_id),
      series_id: Number(editFormValues.series_id),
      equipment_id: Number(editFormValues.equipment_id),
      engine_type_id: Number(editFormValues.engine_type_id),
      car_color_id: Number(editFormValues.car_color_id),
      mileage_from: Number(editFormValues.mileage_from),
      mileage_defore: Number(editFormValues.mileage_defore),
      price_from: Number(editFormValues.price_from),
      price_defore: Number(editFormValues.price_defore),
      date_release_from: editFormValues.date_release_from,
      date_release_defore: editFormValues.date_release_defore,
      create_dttm: editFormValues.create_dttm,
      update_dttm: editFormValues.update_dttm
    };

    // Удалим поля, которые точно не хотим слать
    // Например, id можно слать, если нужно, но user_id уберём
    const { id, user_id, ...bodyToSend } = updatedData;

    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/filters/${selectedFilter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(bodyToSend)
      });

      if (!response.ok) {
        console.error('Ошибка при обновлении фильтра');
        return;
      }

      // Обновим список, чтобы увидеть изменения
      await fetchFilters(page);
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    } finally {
      handleCloseEditDialog();
    }
  };

  // ==========================
  // РЕНДЕР
  // ==========================
  return (
    <Box
      sx={{
        height: '85vh',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Typography variant="h5" mb={2}>
        Список фильтров
      </Typography>

      <Paper
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader sx={{ minWidth: 1800 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Manufacture ID</TableCell>
                <TableCell>Model ID</TableCell>
                <TableCell>Series ID</TableCell>
                <TableCell>Equipment ID</TableCell>
                <TableCell>Engine Type ID</TableCell>
                <TableCell>Car Color ID</TableCell>
                <TableCell>Mileage From</TableCell>
                <TableCell>Mileage Defore</TableCell>
                <TableCell>Price From</TableCell>
                <TableCell>Price Defore</TableCell>
                <TableCell>Date Release From</TableCell>
                <TableCell>Date Release Defore</TableCell>
                <TableCell>Create DTTM</TableCell>
                <TableCell>Update DTTM</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={17} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filters.length > 0 ? (
                filters.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.user_id}</TableCell>
                    <TableCell>{item.manufacture_id}</TableCell>
                    <TableCell>{item.model_id}</TableCell>
                    <TableCell>{item.series_id}</TableCell>
                    <TableCell>{item.equipment_id}</TableCell>
                    <TableCell>{item.engine_type_id}</TableCell>
                    <TableCell>{item.car_color_id}</TableCell>
                    <TableCell>{item.mileage_from}</TableCell>
                    <TableCell>{item.mileage_defore}</TableCell>
                    <TableCell>{item.price_from}</TableCell>
                    <TableCell>{item.price_defore}</TableCell>
                    <TableCell>{new Date(item.date_release_from).toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.date_release_defore).toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.update_dttm).toLocaleString()}</TableCell>
                    <TableCell sx={{ display: 'flex' }}>
                      <IconButton onClick={() => handleOpenEditDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(item)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={17} align="center">
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      </Paper>

      {/**
       * Диалог редактирования
       * Даем возможность менять все поля, кроме ID и user_id (или меняй, если нужно).
       */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Редактирование фильтра</DialogTitle>
        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Manufacture ID"
              name="manufacture_id"
              type="number"
              value={editFormValues.manufacture_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Model ID"
              name="model_id"
              type="number"
              value={editFormValues.model_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Series ID"
              name="series_id"
              type="number"
              value={editFormValues.series_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Equipment ID"
              name="equipment_id"
              type="number"
              value={editFormValues.equipment_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Engine Type ID"
              name="engine_type_id"
              type="number"
              value={editFormValues.engine_type_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Car Color ID"
              name="car_color_id"
              type="number"
              value={editFormValues.car_color_id}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Mileage From"
              name="mileage_from"
              type="number"
              value={editFormValues.mileage_from}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Mileage Defore"
              name="mileage_defore"
              type="number"
              value={editFormValues.mileage_defore}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Price From"
              name="price_from"
              type="number"
              value={editFormValues.price_from}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Price Defore"
              name="price_defore"
              type="number"
              value={editFormValues.price_defore}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Date Release From"
              name="date_release_from"
              type="text"
              // можно попробовать type="datetime-local" если нужно
              value={editFormValues.date_release_from}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Date Release Defore"
              name="date_release_defore"
              type="text"
              value={editFormValues.date_release_defore}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Create DTTM"
              name="create_dttm"
              type="text"
              value={editFormValues.create_dttm}
              onChange={handleEditFieldChange}
              fullWidth
            />
            <TextField
              label="Update DTTM"
              name="update_dttm"
              type="text"
              value={editFormValues.update_dttm}
              onChange={handleEditFieldChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleUpdateSubmit} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/**
       * Диалог подтверждения удаления
       */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Удалить фильтр?</DialogTitle>
        <DialogContent dividers>
          {selectedFilter && <Typography>Вы действительно хотите удалить фильтр с ID = {selectedFilter.id}?</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirmed} variant="contained" color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Filters;
