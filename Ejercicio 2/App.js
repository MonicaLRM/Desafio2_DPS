import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { CameraComponent } from './components/CameraComponent';
import { GaleriaFotos } from './components/GaleriaFotos';
import { MaterialIcons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Camera') {
              iconName = 'camera';
            } else if (route.name === 'Lista de Archivos') {
              iconName = 'library-books';
            }
            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="Camera"
          component={CameraComponent}
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: 'blue' }, // Cambia el color de fondo aquí
          }}
        />
        <Tab.Screen
          name="Lista de Archivos" 
          component={GaleriaFotos}
          options={{
            headerShown: false,
            cardStyle: { backgroundColor: '#000' }, // Cambia el color de fondo aquí
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
