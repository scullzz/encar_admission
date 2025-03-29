import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Pagination } from '@mui/material';

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

const Settings = () => {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSettings = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/settings/?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
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

  useEffect(() => {
    fetchSettings(page);
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
      <Typography variant="h5" mb={2}>
        Настройки системы
      </Typography>

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ maxHeight: '100%', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Значение</TableCell>
                <TableCell>Создано</TableCell>
                <TableCell>Обновлено</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                settings.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.description}</TableCell>
                    <TableCell>
                      <code style={{ wordBreak: 'break-all' }}>{s.value}</code>
                    </TableCell>
                    <TableCell>{new Date(s.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(s.update_dttm).toLocaleString()}</TableCell>
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
    </Box>
  );
};

export default Settings;
