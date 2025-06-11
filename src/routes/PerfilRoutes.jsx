import PerfilScreen from '../screens/telas/PerfilScreen';
import PerfilForm from '../screens/forms/PerfilForm';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function PerfilRoutes() {
  return (
    <Stack.Navigator initialRouteName="PerfilScreen">
      <Stack.Screen
        name="PerfilScreen"
        component={PerfilScreen}
        options={{ title: " " }}
      />
      <Stack.Screen
        name="PerfilForm"
        component={PerfilForm}
        options={{ title: "Editar Perfil" }}
      />
    </Stack.Navigator>
  );
}
