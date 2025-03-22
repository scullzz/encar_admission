import {
  HomeOutlined,
  UserOutlined,
  RobotOutlined,
  PictureOutlined,
  SettingOutlined,
  FilterOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';

// icons
const icons = {
  HomeOutlined,
  UserOutlined,
  RobotOutlined,
  PictureOutlined,
  SettingOutlined,
  FilterOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  DollarOutlined
};

const dashboard = {
  id: 'dashboard',
  type: 'group',
  children: [
    {
      id: 'filters',
      title: 'Filters',
      type: 'item',
      url: '/filters',
      icon: icons.FilterOutlined,
      breadcrumbs: false
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      type: 'item',
      url: '/subscriptions',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'tariffs',
      title: 'Tariffs',
      type: 'item',
      url: '/tariffs',
      icon: icons.CreditCardOutlined,
      breadcrumbs: false
    },
    {
      id: 'contracts',
      title: 'Contracts',
      type: 'item',
      url: '/contracts',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'pay_history',
      title: 'Pay history',
      type: 'item',
      url: '/pay_history',
      icon: icons.DollarOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
