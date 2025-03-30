import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

export interface SettingItem {
  id: number;
  key: string;
  name: string;
  description: string;
  value: string;
  create_dttm: string;
  update_dttm: string;
}

export interface SettingsApiResponse {
  items: SettingItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const PAGE_SIZE = 20;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for Create/Edit dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<SettingItem | null>(null);

  // State for Delete confirmation dialog
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteSettingId, setDeleteSettingId] = useState<number | null>(null);

  // --------------------------------------------------------------------------
  // Fetch the list of settings (with pagination)
  // --------------------------------------------------------------------------
  const fetchSettings = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/settings/?page=${pageNumber}&size=${PAGE_SIZE}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234', // example
          login: 'admin' // example
        }
      });
      if (!response.ok) throw new Error('Ошибка запроса');

      const data: SettingsApiResponse = await response.json();
      setSettings(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Get one setting by ID (for editing)
  // --------------------------------------------------------------------------
  const getSettingById = async (id: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/settings/${id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) {
        throw new Error(`Ошибка загрузки настройки: ${response.status}`);
      }
      const data: SettingItem = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка при получении настройки:', error);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // Create a new setting
  // --------------------------------------------------------------------------
  const createSetting = async (settingData: Omit<SettingItem, 'id' | 'create_dttm' | 'update_dttm'>) => {
    try {
      const response = await fetch('https://api.a-b-d.ru/admin/settings/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(settingData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка создания настройки: ${response.status}`);
      }
      // Refresh list
      fetchSettings(page);
    } catch (error) {
      console.error('Ошибка при создании настройки:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Update an existing setting
  // --------------------------------------------------------------------------
  const updateSetting = async (id: number, settingData: Omit<SettingItem, 'id' | 'create_dttm' | 'update_dttm'>) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/settings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(settingData)
      });
      if (!response.ok) {
        throw new Error(`Ошибка обновления настройки: ${response.status}`);
      }
      // Refresh list
      fetchSettings(page);
    } catch (error) {
      console.error('Ошибка при обновлении настройки:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Delete a setting
  // --------------------------------------------------------------------------
  const deleteSetting = async (id: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/settings/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) {
        throw new Error(`Ошибка удаления настройки: ${response.status}`);
      }
      // Refresh list
      fetchSettings(page);
    } catch (error) {
      console.error('Ошибка при удалении настройки:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for Create/Edit Dialog
  // --------------------------------------------------------------------------
  const handleOpenCreate = () => {
    setIsEditMode(false);
    // Initialize a blank setting object
    setCurrentSetting({
      id: 0,
      key: '',
      name: '',
      description: '',
      value: '',
      create_dttm: '',
      update_dttm: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (id: number) => {
    setIsEditMode(true);
    const foundSetting = await getSettingById(id);
    if (foundSetting) {
      setCurrentSetting(foundSetting);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSetting(null);
  };

  const handleSaveSetting = async () => {
    if (!currentSetting) return;

    const { id, key, name, description, value } = currentSetting;
    // Data object for create/update
    const data = { key, name, description, value };

    if (isEditMode) {
      await updateSetting(id, data);
    } else {
      await createSetting(data);
    }

    setOpenDialog(false);
    setCurrentSetting(null);
  };

  // --------------------------------------------------------------------------
  // Handlers for Delete Confirmation Dialog
  // --------------------------------------------------------------------------
  const handleOpenDeleteConfirm = (id: number) => {
    setDeleteSettingId(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteSettingId(null);
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteSettingId !== null) {
      await deleteSetting(deleteSettingId);
    }
    handleCloseDeleteConfirm();
  };

  // --------------------------------------------------------------------------
  // Fetch settings on mount & when page changes
  // --------------------------------------------------------------------------
  useEffect(() => {
    fetchSettings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Box
      sx={{
        height: '85vh',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9f9f9'
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Настройки системы</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Создать настройку
        </Button>
      </Box>

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ maxHeight: '100%', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Значение</TableCell>
                <TableCell>Создано</TableCell>
                <TableCell>Обновлено</TableCell>
                <TableCell align="center">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : settings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" color="textSecondary">
                      Данных пока нет
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                settings.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.key}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.description}</TableCell>
                    <TableCell>
                      <code style={{ wordBreak: 'break-all' }}>{s.value}</code>
                    </TableCell>
                    <TableCell>{new Date(s.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(s.update_dttm).toLocaleString()}</TableCell>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleOpenEdit(s.id)}>
                        Редактировать
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleOpenDeleteConfirm(s.id)}>
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
          <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
        </Box>
      </Paper>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Редактировать настройку' : 'Создать настройку'}</DialogTitle>
        <DialogContent dividers>
          {currentSetting && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Key"
                value={currentSetting.key}
                onChange={(e) => setCurrentSetting((prev) => (prev ? { ...prev, key: e.target.value } : null))}
              />
              <TextField
                label="Название"
                value={currentSetting.name}
                onChange={(e) => setCurrentSetting((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
              <TextField
                label="Описание"
                value={currentSetting.description}
                onChange={(e) => setCurrentSetting((prev) => (prev ? { ...prev, description: e.target.value } : null))}
              />
              <TextField
                label="Значение"
                value={currentSetting.value}
                onChange={(e) => setCurrentSetting((prev) => (prev ? { ...prev, value: e.target.value } : null))}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveSetting}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Удалить настройку?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту настройку?</Typography>
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

export default Settings;
