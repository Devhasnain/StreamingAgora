import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

const StackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

let homeIp = '192.168.1.103';
let officeIp = '192.168.100.38';
let hotspotIp = '192.168.179.33';

const configurations = {
  StackScreenOptions,
  keys: {
    backend_url: `http://${officeIp}:3001`,
  },
  agora: {
    appId: '6e784e6db30341cd9393efe08127893e',
    token:
      '007eJxTYOCd+X/rsvRYm9kno+8yfZDXKis+eIOv35dryXfm7yyrJC8oMJilmluYpJqlJBkbGJsYJqdYGlsap6alGlgYGplbAJmP+KrTGgIZGXZ92srMyACBID4LQ0lqcQkDAwBL7x/P',
  },
};

export default configurations;
