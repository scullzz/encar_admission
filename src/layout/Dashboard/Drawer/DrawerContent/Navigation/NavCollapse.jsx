import PropTypes from 'prop-types';
import { List } from '@mui/material';
import NavItem from './NavItem';

function NavCollapse({ item, level }) {
  return (
    <>
      <List component="div" disablePadding>
        <NavItem key={item.id} item={item} level={level + 1} />
      </List>
    </>
  );
}

NavCollapse.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired
};

export default NavCollapse;
