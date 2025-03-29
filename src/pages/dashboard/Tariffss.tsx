import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Pagination
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

  const fetchTariffs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/tariffs/?page=${page}&size=${PAGE_SIZE}`, {
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
      const data: TariffsApiResponse = await response.json();
      setTariffs(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching tariffs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs(page);
  }, [page]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Тарифы
      </Typography>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {tariffs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
      </Box>
    </Box>
  );
};

export default Tariffs;
