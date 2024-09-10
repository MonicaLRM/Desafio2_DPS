import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Contactos from './Contactos';
import AgregarCumpleanos from './AgregarCumpleanos';

const Drawer = createDrawerNavigator();

export default function MenuDrawer({ contactos, agregarContacto, eliminarContacto }) {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Contactos">
        <Drawer.Screen name="Contactos">
          {(props) => <Contactos {...props} contactos={contactos} eliminarContacto={eliminarContacto} />}
        </Drawer.Screen>
        <Drawer.Screen name="Agregar Cumpleaños">
          {(props) => <AgregarCumpleanos {...props} agregarContacto={agregarContacto} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
