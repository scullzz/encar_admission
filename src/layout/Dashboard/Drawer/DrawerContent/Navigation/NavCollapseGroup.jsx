import PropTypes from 'prop-types';
// material-ui
import Box from '@mui/material/Box';
import { List, Collapse, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavCollapse from './NavCollapse';
import { useGetMenuMaster } from 'api/menu';
import { useState } from 'react';

export default function NavCollapseGroup({ item }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <ListItemButton sx={{pl: 3}} onClick={handleToggle}>
        {item.icon && <ListItemIcon>{<item.icon />}</ListItemIcon>}
        <ListItemText primary={<Typography variant="subtitle1">{item.title}</Typography>} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
        >
          {navCollapse}
        </List>
      </Collapse>
    </>
  );
}

NavCollapseGroup.propTypes = { item: PropTypes.object };
