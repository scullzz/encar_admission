import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
// import { useDispatch, useSelector } from 'react-redux';
// import { update } from '../../../../redux/reloadStatusSlice';
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';
import React from 'react';
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import { FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs-plugin-utc';

dayjs.extend(utc);
// const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(({ theme }) => ({
//   width: 42,
//   height: 26,
//   padding: 0,
//   '& .MuiSwitch-switchBase': {
//     padding: 0,
//     margin: 2,
//     transitionDuration: '300ms',
//     '&.Mui-checked': {
//       transform: 'translateX(16px)',
//       color: '#fff',
//       '& + .MuiSwitch-track': {
//         backgroundColor: '#65C466',
//         opacity: 1,
//         border: 0,
//         ...theme.applyStyles('dark', {
//           backgroundColor: '#2ECA45'
//         })
//       },
//       '&.Mui-disabled + .MuiSwitch-track': {
//         opacity: 0.5
//       }
//     },
//     '&.Mui-focusVisible .MuiSwitch-thumb': {
//       color: '#33cf4d',
//       border: '6px solid #fff'
//     },
//     '&.Mui-disabled .MuiSwitch-thumb': {
//       color: theme.palette.grey[100],
//       ...theme.applyStyles('dark', {
//         color: theme.palette.grey[600]
//       })
//     },
//     '&.Mui-disabled + .MuiSwitch-track': {
//       opacity: 0.7,
//       ...theme.applyStyles('dark', {
//         opacity: 0.3
//       })
//     }
//   },
//   '& .MuiSwitch-thumb': {
//     boxSizing: 'border-box',
//     width: 22,
//     height: 22
//   },
//   '& .MuiSwitch-track': {
//     borderRadius: 26 / 2,
//     backgroundColor: '#E9E9EA',
//     opacity: 1,
//     transition: theme.transitions.create(['background-color'], {
//       duration: 500
//     }),
//     ...theme.applyStyles('dark', {
//       backgroundColor: '#39393D'
//     })
//   }
// }));

export default function HeaderContent() {
  // const dispatch = useDispatch();
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  // const status = useSelector((state) => state.reloadStatus.reloadStatus);
  // const { t, i18n } = useTranslation();

  // const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // const handleLanguageChange = (event) => {
  //   const newLanguage = event.target.value;
  //   localStorage.setItem('language', newLanguage);
  //   setLanguage(newLanguage);
  //   i18n.changeLanguage(newLanguage);
  // };

  // const handleOnChange = (action) => {
  //   dispatch(update(action));
  // };

  // const [time, setTime] = useState(
  //   dayjs()
  //     .utcOffset(5 * 60)
  //     .format('HH:mm:ss')
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTime(
  //       dayjs()
  //         .utcOffset(5 * 60)
  //         .format('HH:mm:ss')
  //     );
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      {!downLG && <Search />}
      {/* {downLG && <Box sx={{ width: '100%', ml: 1 }} />} */}

      {/* <Typography sx={{ mr: 2 }} variant="h4" component="div">
        {time}
      </Typography> */}

      {/* <FormControlLabel
        sx={{ width: '235px' }}
        control={<IOSSwitch sx={{ m: 1 }} defaultChecked={status} onChange={(event) => handleOnChange(event.target.checked)} />}
        label={t('auto_reload')}
      /> */}
      {/* 
      <Box sx={{ flexShrink: 0 }}>
        <Select
          value={language}
          onChange={handleLanguageChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Language select' }}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="ru">Русский</MenuItem>
          <MenuItem value="uz">O'zbek</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
      </Box> */}

      {!downLG && <Profile />}
      {/* {downLG && <MobileSection />} */}
    </>
  );
}
