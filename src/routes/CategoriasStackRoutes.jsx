import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CategoriasScreen from "../screens/telas/CategoriasScreen";
import AlimentacaoLista from "../screens/listas/AlimentacaoLista";
import EducacaoLista from "../screens/listas/EducacaoLista";
import LazerLista from "../screens/listas/LazerLista";
import MetasLista from "../screens/listas/MetasLista";
import SaldoLista from "../screens/listas/SaldoLista";
import SaudeLista from "../screens/listas/SaudeLista";
import TransporteLista from "../screens/listas/TransporteLista";
import CasaLista from "../screens/listas/CasaLista";

import AlimentacaoForm from "../screens/forms/AlimentacaoForm";
import MetasForm from "../screens/forms/MetasForm";
import CasaForm from "../screens/forms/CasaForm";
import EduacacaoForm from "../screens/forms/EducacaoForm";
import LazerForm from "../screens/forms/LazerForm";
import SaudeForm from "../screens/forms/SaudeForm";
import TransporteForm from "../screens/forms/TransporteForm";
import SaldoForm from "../screens/forms/SaldoForm";

// importe outras listas conforme necessário

const Stack = createStackNavigator();

export default function CategoriaStackRoutes() {
  return (
    <Stack.Navigator initialRouteName="Categorias" >
      <Stack.Screen
        name="Categorias"
        component={CategoriasScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="AlimentacaoLista"
        component={AlimentacaoLista}
        options={{ title: "Alimentação" }}
      />
      <Stack.Screen
        name="CasaLista"
        component={CasaLista}
        options={{ title: "Casa" }}
      />
      <Stack.Screen
        name="EducacaoLista"
        component={EducacaoLista}
        options={{ title: "Educacao" }}
      />
      <Stack.Screen
        name="LazerLista"
        component={LazerLista}
        options={{ title: "Lazer" }}
      />
      <Stack.Screen
        name="MetasLista"
        component={MetasLista}
        options={{ title: "Metas" }}
      />
      <Stack.Screen
        name="SaldoLista"
        component={SaldoLista}
        options={{ title: "Saldo" }}
      />

      <Stack.Screen
        name="SaudeLista"
        component={SaudeLista}
        options={{ title: "Saúde" }}
      />
      <Stack.Screen
        name="TransporteLista"
        component={TransporteLista}
        options={{ title: "Transporte" }}
      />

      <Stack.Screen
        name="AlimentacaoForm"
        component={AlimentacaoForm}
        options={{ title: "Formulário " }}
      />
      <Stack.Screen
        name="MetasForm"
        component={MetasForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="CasaForm"
        component={CasaForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="EducacaoForm"
        component={EduacacaoForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="LazerForm"
        component={LazerForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="SaudeForm"
        component={SaudeForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="TransporteForm"
        component={TransporteForm}
        options={{ title: "Formulário" }}
      />
      <Stack.Screen
        name="SaldoForm"
        component={SaldoForm}
        options={{ title: "Formulário" }}
      />
    </Stack.Navigator>
  );
}
