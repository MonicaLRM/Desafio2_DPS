import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Contactos from './components/Contactos';
import AgregarCumpleanos from './components/AgregarCumpleanos';

const Drawer = createDrawerNavigator();

export default function App() {
  const [contra, setContra] = useState('');
  const [confirmContra, setConfirmContra] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [ingreso, setIngreso] = useState(false);
  const [login, setLogin] = useState(true);
  const [mssgError, setMssgError] = useState('');

  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    const logeado = async () => {
      const datosUsuario = await obtenerDatos();
      if (datosUsuario) {
        setEmail(datosUsuario.email);
        setIngreso(true);
      }
    };
    logeado();
  }, []);

  // Función para guardar datos en AsyncStorage
  const guardarDatos = async (usuario, email, contra) => {
    try {
      const datosUsuario = JSON.stringify({ usuario, email, contra });
      await AsyncStorage.setItem('user', datosUsuario);
    } catch {
      setMssgError('Error al guardar los datos de usuario');
    }
  };

  // Función para obtener datos desde AsyncStorage
  const obtenerDatos = async () => {
    try {
      const datosUsuario = await AsyncStorage.getItem('user');
      return datosUsuario != null ? JSON.parse(datosUsuario) : null;
    } catch {
      setMssgError('Error al recuperar los datos de usuario');
    }
  };

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validarRegistro = async () => {
    if (!validarEmail(email)) {
      setMssgError('El correo electrónico ingresado no es válido.');
      return;
    }
    if (contra.length < 6) {
      setMssgError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contra !== confirmContra) {
      setMssgError('Las contraseñas no coinciden.');
      return;
    }

    const usuarioAn = await obtenerDatos();
    if (usuarioAn && usuarioAn.email === email) {
      setMssgError('El correo electrónico ya está registrado.');
      return;
    }

    if (usuario && email && contra) {
      await guardarDatos(usuario, email, contra);
      setIngreso(true);
      setMssgError('');
    } else {
      setMssgError('Por favor, complete todos los campos.');
    }
  };

  const validarIngreso = async () => {
    const datosUsuario = await obtenerDatos();
    if (!validarEmail(email)) {
      setMssgError('El correo electrónico ingresado no es válido.');
      return;
    }
    if (datosUsuario && datosUsuario.email === email && datosUsuario.contra === contra) {
      setIngreso(true);
      setMssgError(''); // Limpiar mensaje de error después del inicio de sesión exitoso
    } else {
      setMssgError('Credenciales incorrectas.');
    }
  };

  const validarCierre = async () => {
    setIngreso(false);
  };

  const cambioPantalla = () => {
    setLogin(!login);
    setUsuario('');
    setEmail('');
    setContra('');
    setConfirmContra('');
    setMssgError('');
  };

  const agregarContacto = (nuevoContacto) => {
    setContactos((prevContactos) => [...prevContactos, nuevoContacto]);
  };

  const eliminarContacto = (id) => {
    setContactos((prevContactos) => prevContactos.filter((contacto) => contacto.id !== id));
  };

  if (ingreso) {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Contactps">
          <Drawer.Screen name="Contactos">
            {(props) => <Contactos {...props} contactos={contactos} eliminarContacto={eliminarContacto} />}
          </Drawer.Screen>
          <Drawer.Screen name="Agregar Cumpleaños">
            {(props) => <AgregarCumpleanos {...props} agregarContacto={agregarContacto} />}
          </Drawer.Screen>
          <Drawer.Screen name="Cerrar Sesión">
            {() => (
              <View style={styles.container}>
                <Text>Seguro que deseas cerrar sesion?</Text>
                <Button title="Cerrar Sesión" onPress={validarCierre} />
              </View>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{mssgError ? mssgError : (login ? "Iniciar Sesión" : "Registrarse")}</Text>
      {!login && (
        <TextInput
          placeholder="Nombre de usuario"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={contra}
        onChangeText={setContra}
        style={styles.input}
        secureTextEntry
      />
      {!login && (
        <TextInput
          placeholder="Confirmar Contraseña"
          value={confirmContra}
          onChangeText={setConfirmContra}
          style={styles.input}
          secureTextEntry
        />
      )}
      {login ? (
        <>
          <Button title="Iniciar Sesión" onPress={validarIngreso} />
          <Button title="Registrarse" onPress={cambioPantalla} />
        </>
      ) : (
        <>
          <Button title="Registrarse" onPress={validarRegistro} />
          <Button title="Volver al Inicio de Sesión" onPress={cambioPantalla} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

