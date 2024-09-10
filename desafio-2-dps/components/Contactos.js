import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { format, parseISO, isBefore, differenceInDays } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons'; 

const ObtenerColor = (date) => {
  const Hoy = new Date();
  const proxCumple = new Date(date);
  proxCumple.setFullYear(Hoy.getFullYear());

  if (isBefore(proxCumple, Hoy)) return 'red';
  return 'blue';
};

const DiasFaltantes = (date) => {
  const Hoy = new Date();
  const proxCumple = new Date(date);
  proxCumple.setFullYear(Hoy.getFullYear());

  if (isBefore(proxCumple, Hoy)) {
    proxCumple.setFullYear(Hoy.getFullYear() + 1);
  }

  return differenceInDays(proxCumple, Hoy);
};

export default function Contactos({ contactos, eliminarContacto, navigation }) {
  const [sortedContactos, setSortedContactos] = useState([]);

  useEffect(() => {
    const sorted = [...contactos].sort((a, b) => new Date(a.fechaNacimiento) - new Date(b.fechaNacimiento));
    setSortedContactos(sorted);
  }, [contactos]);

  const handleLongPress = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => eliminarContacto(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {sortedContactos.length === 0 ? (
        <View style={styles.noContactContainer}>
          <FontAwesome name="frown-o" size={50} color="gray" />
          <Text style={styles.noContactText}>No hay contactos agregados</Text>
        </View>
      ) : (
        <FlatList
          data={sortedContactos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const date = new Date(item.fechaNacimiento);
            const daysUntilBirthday = DiasFaltantes(date);
            let color = ObtenerColor(date);

            let message;
            if (Math.abs(daysUntilBirthday) === 364) {
              message = 'Hoy es el cumpleaños';
              color = 'green';
            } else if (color === 'red') {
              message = `Cumpleaños atrasado`;
            } else {
              message = `Faltan ${Math.abs(daysUntilBirthday) + 1} días`;
            }

            return (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item.id)}
                style={[styles.contacto, { backgroundColor: color }]}
              >
                <Text>{item.nombre}</Text>
                <Text>{format(parseISO(item.fechaNacimiento), 'dd MMM')}</Text>
                <Text>{message}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Agregar Cumpleaños')} 
      >
        <FontAwesome name="plus" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  noContactContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContactText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 10,
  },
  contacto: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Para sombra en Android
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
});
