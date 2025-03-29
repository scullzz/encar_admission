import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Pagination
} from '@mui/material';

export interface SubscriptionItem {
  id: number;
  user_id: number;
  tariff_id: number;
  subscription_end: string;
  create_dttm: string;
  update_dttm: string;
}

export interface SubscriptionApiResponse {
  items: SubscriptionItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const PAGE_SIZE = 20;

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchSubscriptions = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/subscription/?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data: SubscriptionApiResponse = await response.json();
      setSubscriptions(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Ошибка загрузки подписок:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(page);
  }, [page]);

  return (
    <Box
      sx={{
        height: '100vh',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f4f4f4'
      }}
    >
      <Typography variant="h5" mb={2}>
        Подписки
      </Typography>

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 80 }}>ID</TableCell>
                <TableCell sx={{ minWidth: 120 }}>User ID</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Tariff ID</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Окончание</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Создано</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Обновлено</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="textSecondary">
                      Данных пока нет
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.id}</TableCell>
                    <TableCell>{sub.user_id}</TableCell>
                    <TableCell>{sub.tariff_id}</TableCell>
                    <TableCell>{new Date(sub.subscription_end).toLocaleString()}</TableCell>
                    <TableCell>{new Date(sub.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(sub.update_dttm).toLocaleString()}</TableCell>
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

export default Subscriptions;
