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

export interface CarItem {
  id: number;
  manufacture_id: number;
  model_id: number;
  series_id: number;
  equipment_id: number;
  engine_type_id: number;
  car_color_id: number;
  mileage: number;
  price_won: number;
  price_rub: number;
  date_release: string;
  publication_dttm: string;
  check_dttm: string;
  change_ownership: number;
  all_traffic_accident: number;
  traffic_accident_owner: number;
  traffic_accident_other: number;
  repair_cost_owner: number | null;
  repair_cost_other: number | null;
  theft: number;
  flood: number;
  death: number;
  url: string;
  create_dttm: string;
  update_dttm: string;
}

export interface CarApiResponse {
  items: CarItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Cars = () => {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCars = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/car/?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          Accept: 'application/json',
          Auth: 'abcd-1234',
          Login: 'admin'
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: CarApiResponse = await response.json();
      setCars(data.items);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars(page);
  }, [page]);

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
        Список автомобилей
      </Typography>

      <Paper
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TableContainer sx={{ maxHeight: '100%', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пробег</TableCell>
                <TableCell>Цена (₩)</TableCell>
                <TableCell>Цена (₽)</TableCell>
                <TableCell>Дата выпуска</TableCell>
                <TableCell>Ссылка</TableCell>
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
                cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.id}</TableCell>
                    <TableCell>{car?.mileage?.toLocaleString()}</TableCell>
                    <TableCell>{car.price_won.toLocaleString()}</TableCell>
                    <TableCell>{car.price_rub.toLocaleString()}</TableCell>
                    <TableCell>{new Date(car.date_release).toLocaleString()}</TableCell>
                    <TableCell>
                      <a href={car.url} target="_blank" rel="noreferrer">
                        Перейти
                      </a>
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
      </Paper>
    </Box>
  );
};

export default Cars;
