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
  TableFooter
} from '@mui/material';

interface Tariff {
  id: number;
  name: string;
  description: string;
  days_count: number;
  price: number;
  filter_count: number;
}

const Tariffs = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await fetch('https://api.a-b-d.ru/tariffs/', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            auth: '123'
          }
        });
        const data: Tariff[] = await response.json();
        setTariffs(data);
      } catch (error) {
        console.error('Error fetching tariffs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Days Count</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Filter Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tariffs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
                <TableCell>{tariff.filter_count}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tariffs;
