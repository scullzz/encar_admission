import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';

interface Contact {
  title: string;
  url: string;
  sequence_number: number;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('https://api.a-b-d.ru/contact/', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            auth: '123'
          }
        });
        const data: Contact[] = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Sequence Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="body1" color="textSecondary">
                  Данных пока нет
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.sequence_number}>
                <TableCell>{contact.title}</TableCell>
                <TableCell>
                  <a href={contact.url} target="_blank" rel="noopener noreferrer">
                    {contact.url}
                  </a>
                </TableCell>
                <TableCell>{contact.sequence_number}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Contacts;
