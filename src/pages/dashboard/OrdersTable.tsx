import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Button,
  Grid,
  IconButton,
  CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';

interface Carrier {
  id: number;
  carrierId: string;
  vendorId: string;
  createDate: string;
  debtor: {
    id: number,
    amount: number,
    type: string,
  } | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface BillingHistory {
  id: number;
  amount: number;
  refNum: string;
  beforeBalance: number;
  afterBalance: number;
  createdAt: string
}

interface Contract {
  id: number;
  carrier: Carrier;
  contractId: string;
  balance: number;
  billingHistory: BillingHistory[];
}

export default function OrdersTable() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  interface Column {
    id: 'id' | 'carrierId' | 'carrier.createDate' | 'contractId' | 'description' | 'balance' | 'actions';
    label: string;
    minWidth?: number;
    align?: 'right' | 'center';
    format?: (value: any) => string;
  }

  const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'carrierId', label: t('orders.carrier_id'), minWidth: 100 },
    {
      id: 'carrier.createDate',
      label: t('orders.created_at'),
      minWidth: 150,
      align: 'right',
      format: (value: string) => new Date(value).toLocaleDateString()
    },
    { id: 'contractId', label: t('orders.contract_id'), minWidth: 100, align: 'right' },
    {
      id: 'balance',
      label: t('orders.balance'),
      minWidth: 100,
      align: 'right',
      format: (value: string) => parseFloat(value).toFixed(2)
    },
    { id: 'actions', label: t('orders.Actions'), minWidth: 100, align: 'center' }
  ];

  const [page, setPage] = useState<number>(parseInt(localStorage.getItem('currentPage') || '1', 10)); // Initialize from localStorage
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<Carrier[]>([]);
  const [filteredRows, setFilteredRows] = useState<Contract[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    id: '',
    carrierId: '',
    contractId: '',
    minBalance: '',
    maxBalance: '',
    fromDate: '',
    toDate: ''
  });

  const getListData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: rowsPerPage.toString()
      });

      if (filters.id) queryParams.append('id', filters.id);
      if (filters.carrierId) queryParams.append('carrierId', filters.carrierId);
      if (filters.contractId) queryParams.append('contractId', filters.contractId);
      if (filters.minBalance) queryParams.append('minBalance', filters.minBalance);
      if (filters.maxBalance) queryParams.append('maxBalance', filters.maxBalance);
      if (filters.fromDate) queryParams.append('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.append('toDate', filters.toDate);

      queryParams.append('sortType', 'desc');

      const queryString = queryParams.toString();

      const response = await fetch(`https://tss-user-api.prod.united-fuel.com/api/contracts?${queryString}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const res = await response.json();
        setRows(res.data);
        setFilteredRows(res.data);
        setPagination({ currentPage: res.pagination.currentPage, totalPages: res.pagination.totalPages });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (newPage + 1 <= pagination.totalPages && newPage + 1 > 0) {
      setPage(newPage + 1);
      localStorage.setItem('currentPage', (newPage + 1).toString()); // Update localStorage
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
    localStorage.setItem('currentPage', '1'); // Reset to first page on rows-per-page change
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    setPage(1);
    localStorage.setItem('currentPage', '1'); // Reset to first page on new search
    getListData();
  };

  useEffect(() => {
    getListData();
  }, [page, rowsPerPage]);

  const getBalanceCellStyle = (balance: number) => {
    if (balance > 0) {
      return { backgroundColor: '#90ee90', color: '#fff', fontWeight: 'bold' };
    } else if (balance < 0) {
      return { backgroundColor: '#f08080', color: '#fff', fontWeight: 'bold' };
    } else {
      return { backgroundColor: '#ffffe0', color: '#000', fontWeight: 'bold' };
    }
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={3}>
          <TextField id="outlined-id" label="ID" variant="outlined" name="id" value={filters.id} onChange={handleFilterChange} fullWidth />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-carrierId"
            label="Carrier ID"
            variant="outlined"
            name="carrierId"
            value={filters.carrierId}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-contractId"
            label="Contract ID"
            variant="outlined"
            name="contractId"
            value={filters.contractId}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            id="outlined-minBalance"
            label="Min Balance"
            variant="outlined"
            name="minBalance"
            value={filters.minBalance}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-maxBalance"
            label="Max Balance"
            variant="outlined"
            name="maxBalance"
            value={filters.maxBalance}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            id="outlined-fromDate"
            label="From Date"
            type="date"
            variant="outlined"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            id="outlined-toDate"
            label="To Date"
            type="date"
            variant="outlined"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button sx={{ width: '100%', fontWeight: 700 }} variant="contained" onClick={handleSearch}>
            {t('orders.search')}
          </Button>
        </Grid>
      </Grid>

      <TableContainer sx={{ maxHeight: '100vh', position: 'relative' }}>
        {loading && (
          <CircularProgress
            size={60}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          />
        )}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) =>  (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, position: 'sticky', top: 0, zIndex: 2 }}
                  sx={{ backgroundColor: '#c0c0c0', fontWeight: 'bold' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.map((row, index) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={row.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : row.carrier.debtor ? "#e4666621" : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {columns.map((column) => {
                    if (column.id === 'actions') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <IconButton onClick={() => navigate(`/orders/carrier/${row.id}`)} aria-label="view details">
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      );
                    }

                    let value;

                    if(column.id === 'carrier.createDate') {
                      value = row?.carrier?.createDate
                    } else {
                      value = row[column.id as keyof Carrier]
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={column.id === 'balance' ? getBalanceCellStyle(parseFloat(value as string)) : {}}
                      >
                        {column.format && typeof value === 'string' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={pagination.totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count !== -1 ? count : `more than ${to}`}`}
        sx={{ minHeight: '50px' }}
      />
    </Paper>
  );
}
