import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AgregarCumpleanos({ agregarContacto }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
const [fechaNacimiento, setFechaNacimiento] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validarTelefono = (telefono) => {
    const regex = /^[0-9]+$/;
    return regex.test(telefono);
  };

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAgregar = () => {
    if (!validarTelefono(telefono)) {
      setErrorMessage('El teléfono debe de contener solo números');
      return;
    }
    if (!validarEmail(email)) {
      setErrorMessage('El correo electrónico ingresado no es válido.');
      return;
    }

    setErrorMessage('');
    agregarContacto({
      id: Date.now().toString(),
      nombre,
      telefono,
      email,
      fechaNacimiento: fechaNacimiento.toISOString().split('T')[0], // Formato YYYY-MM-DD
    });

    // Mostrar alerta de éxito
    Alert.alert('Éxito', 'El contacto se agregó con éxito.');

    // Limpiar los campos después de agregar
    setNombre('');
    setTelefono('');
    setEmail('');
    setFechaNacimiento(new Date(new Date().setHours(0, 0, 0, 0)));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || fechaNacimiento;
    setShowDatePicker(false);
    setFechaNacimiento(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text>Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        placeholder="Nombre"
      />
      <Text>Teléfono</Text>
      <TextInput
        value={telefono}
        onChangeText={setTelefono}
        style={styles.input}
        placeholder="Teléfono "
        keyboardType="numeric"
      />
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Correo Electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Fecha de Nacimiento</Text>
      <View>
        <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
        <Text>{fechaNacimiento.toISOString().split('T')[0]}</Text>
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button title="Agregar Contacto" onPress={handleAgregar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

