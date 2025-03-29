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
  Pagination
} from '@mui/material';

export interface UserItem {
  id: number;
  username: string;
  first_name: string;
  create_dttm: string;
  update_dttm: string;
}

export interface UsersApiResponse {
  items: UserItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const PAGE_SIZE = 10;

const Users = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/users/?page=${page}&size=${PAGE_SIZE}`, {
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });

      if (!response.ok) throw new Error('Ошибка загрузки');

      const data: UsersApiResponse = await response.json();
      setUsers(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return (
    <Box
      sx={{
        height: '85vh',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f4f4f4'
      }}
    >
      <Typography variant="h5" mb={2}>
        Пользователи
      </Typography>

      <Paper sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TableContainer sx={{ maxHeight: '100%', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Создан</TableCell>
                <TableCell>Обновлён</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.first_name}</TableCell>
                    <TableCell>{new Date(user.create_dttm).toLocaleString()}</TableCell>
                    <TableCell>{new Date(user.update_dttm).toLocaleString()}</TableCell>
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

export default Users;
