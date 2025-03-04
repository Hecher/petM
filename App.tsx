import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Button, Image, View, Alert } from 'react-native';
import { openCamera, openGallery } from './utils/imagePicker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';


export default function App() {
  const [uploading, setUploading] = useState(false);
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      await uploadImage(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  const uploadImage = async (uri: string) => {
    setUploading(true);
    console.log('File URI:', uri);

    // const fileInfo = await FileSystem.getInfoAsync(uri);
    // console.log(fileInfo.exists)
    // if (!fileInfo.exists) {
    //   console.log('aaaaaaaaaaaaaaaaa')
    //   Alert.alert('Error', 'File does not exist');
    //   return;
    // }
    // console.log(fileInfo.exists)
    let fileType = uri.substring(uri.lastIndexOf(".") + 1);
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: `photo.${fileType}`,
      type: 'image/${fileType}',
    } as any);
    
    // const formDataEntries = Array.from(formData as any._parts);
    // console.log('[DEBUG] FormData:', formDataEntries);

    try {
      const response = await fetch('http://localhost:3000/image/upload', {
        method: 'POST', 
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data"
        }
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
      console.log('[DEBUG] Response status:', response.status);
      if (!response.ok) throw new Error('Upload failed');
      Alert.alert('Success', 'Image uploaded!');
    } catch (error) {
      Alert.alert('Error', 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  
  
  
  const drawingPress = () => console.log('режим рисунка')
  const loginPress = () => console.log('вход')
  const registrPress = () => console.log('регистрация')

  return (
    <SafeAreaView style={styles.container}>
        {/* Название приложения */}
        <View style={styles.header}>
          <Text style={styles.headerText}>OCR application - TRAS</Text>
        </View>

        {/* Блок кнопок */}
        <View style={styles.buttonContainer}>
          {/* Кнопка фотография */}
          <TouchableOpacity style={styles.button} onPress={drawingPress}>
            <Image source={require('./assets/camera.png')} />
            <Text> Камера</Text>
          </TouchableOpacity>

          {/* Кнопка рисунок */}
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Image source={require('./assets/folder.png')}/>
            <Text>Файл из галереи</Text>
          </TouchableOpacity>
        </View>

        {/* Блок входа и регистрации */}
        <View style={styles.authButtons}>
          {/* Вход */}
          <TouchableOpacity style={styles.authButton} onPress={loginPress}>
            <Text style={styles.authText}>Вход</Text>
          </TouchableOpacity>

          {/* Регистрация */}
          <TouchableOpacity style = {styles.authButton} onPress={registrPress}>
            <Text style={styles.authText}> Регистрация</Text>
          </TouchableOpacity>
        </View>

        

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  header: {
    width: 300,
    height: 90,
    backgroundColor: '#8C95EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: 130,
    height: 130,
    backgroundColor: '#8C95EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  authButtons: {
    gap: 20,
  },

  authButton: {
    width: 300,
    height: 70,
    backgroundColor: '#8C95EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },

  authText: {
     fontSize: 20,
     fontWeight: 'bold',
  }
});
