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

export interface PayHistoryItem {
  id: number;
  user_id: number;
  tariff_id: number;
  price: number;
  successfully: boolean;
  intellect_invoice_id: string | null;
  create_dttm: string;
  update_dttm: string;
}

export interface PayHistoryApiResponse {
  items: PayHistoryItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const PAGE_SIZE = 50;

const PayHistory: React.FC = () => {
  const [payHistory, setPayHistory] = useState<PayHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPayHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/payhistory/?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data: PayHistoryApiResponse = await response.json();
      setPayHistory(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Ошибка загрузки истории платежей:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayHistory(page);
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
        История платежей
      </Typography>

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 80 }}>ID</TableCell>
                <TableCell sx={{ minWidth: 120 }}>User ID</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Tariff ID</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Price</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Successfully</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Invoice ID</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Создано</TableCell>
                <TableCell sx={{ minWidth: 180 }}>Обновлено</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : payHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" color="textSecondary">
                      Данных пока нет
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                payHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.user_id}</TableCell>
                    <TableCell>{item.tariff_id}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.successfully ? 'Да' : 'Нет'}</TableCell>
                    <TableCell>{item.intellect_invoice_id ?? '—'}</TableCell>
                    <TableCell>{new Date(item.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(item.update_dttm).toLocaleString()}</TableCell>
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

export default PayHistory;
