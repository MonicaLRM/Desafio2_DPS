import React from "react";
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  Button,
  Image,
  View
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000"
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width
  },
  cancel: {
    position: "absolute",
    right: 20,
    top: 20,
    backgroundColor: "transparent",
    color: "#FFF",
    fontWeight: "600",
    fontSize: 17
  }
});

class GaleriaFotos extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Seismic"
  });

  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      isLoaded: false
    };

    AsyncStorage.getItem("imageUri").then(response => {
      this.setState({
        isLoaded: true,
        imageUri: response
      });
    });
  }

  renderImage() {
    return (
      <View>
        <Image source={{ uri: this.state.imageUri }} style={styles.preview} />
        <Text
          style={styles.cancel}
          onPress={() => this.setState({ path: null })}
        >
          X
        </Text>
      </View>
    );
  }

  renderLoadingScreen() {
    return (
      <View>
        <Text style={styles.cancel}>Loading</Text>
        <Button
          title="Map View"
          onPress={() => this.props.navigation.popToTop()}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoaded ? this.renderImage() : this.renderLoadingScreen()}
      </View>
    );
  }
}

export default GaleriaFotos;