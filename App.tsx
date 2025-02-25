import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Button, Image, View, Alert } from 'react-native';
import { openCamera, openGallery } from './utils/imagePicker';


export default function App() {
  let res:string|null = '';
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    res = image
  },[image])


  // Пробуем взять изображение через expo
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4,3],
      quality:1
    }).then(result => {
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
      const currentImage = image;
      //console.log(currentImage)
      console.log(result)
      
      
      
    })
    .then(()=> {
      if (image){
        console.log('shit1')
        console.log(image)
        uploadPhoto(image)
      }
      console.log('shit2')
      console.log(image)
    })
    .catch()
    
    
  }

  const cameraPress = async () => {
    await openGallery(setPhoto);
    console.log('test1');
    if (photo) {
      console.log('test1');
      uploadPhoto(photo.uri);
      console.log('test2');
    }
  };

  const uploadPhoto = async (photoUri: string) => {
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    try {
      const response = await fetch('http://localhost:3000/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.text();
      setServerResponse(result);
      Alert.alert('Успех', `Фото загружено! Ответ сервера: ${result}`);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить фото.');
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
          <TouchableOpacity style={styles.button} onPress={cameraPress}>
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
