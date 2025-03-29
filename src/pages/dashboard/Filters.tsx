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
  Typography
} from '@mui/material';

const PAGE_SIZE = 50;

export interface FilterItem {
  id: number;
  user_id: number;
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
  create_dttm: string;
  update_dttm: string;
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

  const fetchFilters = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/filters?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          Accept: 'application/json'
          // при необходимости добавьте другие заголовки
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

  return (
    <Box
      sx={{
        // Высота всего блока (примерно 85% от высоты окна)
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
          // Разрешаем контейнеру расти
          flexGrow: 1,
          // Скрываем прокрутку самого Paper (она будет у таблицы)
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 
          flex: 1 заставит контейнер занять все доступное пространство
          overflow: 'auto' обеспечит прокрутку только содержимого таблицы
        */}
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          {/* 
            Устанавливаем минимальную ширину, чтобы колонки не сжимались слишком сильно 
            При необходимости можно увеличить число (1500, 1800 и т.д.) 
          */}
          <Table stickyHeader sx={{ minWidth: 1500 }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={16} align="center">
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={16} align="center">
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 
          Блок с пагинацией вынесен вниз, чтобы она была зафиксирована 
          и не прокручивалась вместе с таблицей 
        */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
        </Box>
      </Paper>
    </Box>
  );
};

export default Filters;
