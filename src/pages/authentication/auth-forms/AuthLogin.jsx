import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| SIMPLE ADMIN LOGIN ||============================ //

export default function AuthLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const { email, password } = credentials;
    const response = await fetch('https://api.a-b-d.ru/test-admin-auth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        auth: password,
        login: email
      }
    });

    if (response.status === 200) {
      localStorage.setItem('userName', 'admin');
      navigate('/cars');
    } else {
      setServerError('Неверные учетные данные. Попробуйте снова.');
    }
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Логин</InputLabel>
              <OutlinedInput
                id="email-login"
                type="text"
                value={credentials.email}
                name="email"
                onChange={handleChange}
                placeholder="Введите логин"
                fullWidth
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">Пароль</InputLabel>
              <OutlinedInput
                fullWidth
                id="password-login"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                name="password"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="показать пароль"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Введите пароль"
              />
            </Stack>
          </Grid>

          {serverError && (
            <Grid item xs={12}>
              <Alert severity="error">{serverError}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
              Вход
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
