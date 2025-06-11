import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/telas/LoginScreen';
import CadastroScreen from '../screens/telas/CadastroScreen';
import TabRoutes from './TabRoutes';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="Perfil" component={TabRoutes} />
    </Stack.Navigator>
  );
}
