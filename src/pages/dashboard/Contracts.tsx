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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';

interface Contact {
  id: number;
  title: string;
  url: string;
  sequence_number: number;
  create_dttm?: string;
  update_dttm?: string;
}

interface FetchContactsResponse {
  items: Contact[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dialog states
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  // Delete confirmation states
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Fetch all contacts
  // --------------------------------------------------------------------------
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.a-b-d.ru/admin/contacts/?page=1&size=50', {
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

      // The response shape: { items, total, page, size, pages }
      const data: FetchContactsResponse = await response.json();
      setContacts(data.items || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Get one contact by its ID
  // --------------------------------------------------------------------------
  const getContactById = async (id: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/contacts/${id}`, {
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
      const data: Contact = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // Create a new contact (with sequence_number)
  // --------------------------------------------------------------------------
  const createContact = async (contactData: Omit<Contact, 'id'>) => {
    try {
      const response = await fetch('https://api.a-b-d.ru/admin/contacts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(contactData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      await fetchContacts();
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Update an existing contact by ID (with sequence_number)
  // --------------------------------------------------------------------------
  const updateContact = async (id: number, contactData: Omit<Contact, 'id'>) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        },
        body: JSON.stringify(contactData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      await fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Delete a contact by ID
  // --------------------------------------------------------------------------
  const deleteContact = async (id: number) => {
    try {
      const response = await fetch(`https://api.a-b-d.ru/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          auth: 'abcd-1234',
          login: 'admin'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // --------------------------------------------------------------------------
  // Handlers for dialog (create/edit)
  // --------------------------------------------------------------------------
  const handleOpenCreate = () => {
    setIsEditMode(false);
    // Start with empty fields, including sequence_number
    setCurrentContact({ id: 0, title: '', url: '', sequence_number: 0 });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (id: number) => {
    setIsEditMode(true);
    const contact = await getContactById(id);
    if (contact) {
      setCurrentContact(contact);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentContact(null);
  };

  const handleSaveContact = async () => {
    if (!currentContact) return;
    const { id, title, url, sequence_number } = currentContact;

    if (isEditMode) {
      // For update, we pass the ID to update, omitting `id` from the payload
      await updateContact(id, { title, url, sequence_number });
    } else {
      // For create, we pass everything except the ID
      await createContact({ title, url, sequence_number });
    }

    setOpenDialog(false);
    setCurrentContact(null);
  };

  // --------------------------------------------------------------------------
  // Handlers for delete confirmation
  // --------------------------------------------------------------------------
  const handleOpenDeleteConfirm = (id: number) => {
    setDeleteContactId(id);
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteContactId(null);
    setOpenDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteContactId !== null) {
      await deleteContact(deleteContactId);
    }
    handleCloseDeleteConfirm();
  };

  // --------------------------------------------------------------------------
  // Initial fetch
  // --------------------------------------------------------------------------
  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5">Контакты</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Создать контакт
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Sequence Number</TableCell>
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    Данных пока нет
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.title}</TableCell>
                  <TableCell>
                    <a href={contact.url} target="_blank" rel="noopener noreferrer">
                      {contact.url}
                    </a>
                  </TableCell>
                  <TableCell>{contact.sequence_number}</TableCell>
                  <TableCell sx={{ display: 'flex' }}>
                    <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleOpenEdit(contact.id)}>
                      Редактировать
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleOpenDeleteConfirm(contact.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Редактировать контакт' : 'Создать контакт'}</DialogTitle>
        <DialogContent dividers>
          {currentContact && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                value={currentContact.title}
                onChange={(e) => setCurrentContact((prev) => (prev ? { ...prev, title: e.target.value } : null))}
              />
              <TextField
                label="URL"
                value={currentContact.url}
                onChange={(e) => setCurrentContact((prev) => (prev ? { ...prev, url: e.target.value } : null))}
              />
              <TextField
                type="number"
                label="Sequence Number"
                value={currentContact.sequence_number}
                onChange={(e) => setCurrentContact((prev) => (prev ? { ...prev, sequence_number: +e.target.value } : null))}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveContact}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Удалить контакт?</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить этот контакт?</Typography>
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

export default Contacts;
