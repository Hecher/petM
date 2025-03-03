import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker'
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Button, Image, View, Alert } from 'react-native';
import { openCamera, openGallery } from './utils/imagePicker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';


export default function App() {
  let res:string|null = '';
  const [photo, setPhoto] = useState<{ uri: string } | null>(null);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [image, setImage] = useState<any | null>(null);
  useEffect(() => {
    if (image) {
      console.log("Calling uploadPhoto with:", image);
      uploadPhoto(image);
      //setImage(null);
    }
  },[image])

  // Пробуем взять изображение через expo
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ['images'],
  //     allowsEditing: true,
  //     aspect: [4,3],
  //     quality:1,
  //     base64: true, 
  //   }).then(result => {
  //     if (!result.canceled) {
  //       setPhoto({ uri: result.assets[0].uri }); // Исправлено: доступ к URI через result.assets[0].uri
  //       uploadPhoto(result.assets[0].uri); // Передаем URI напрямую
  //     }
  //     const currentImage = image;
  //     //console.log(currentImage)
  //     console.log(result)
  //     console.log(image);
  //   })
  //   .catch(error => console.error(error.message))
  // }
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true, // Включаем base64
      });
  
      if (!result.canceled) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`; // Формируем base64 строку
        console.log(base64String)
        setPhoto({ uri: base64String }); // Сохраняем base64 строку
        uploadPhoto(base64String); // Передаем base64 строку
      }
  
      console.log(result); // Логируем результат
    } catch (error:any) {
      console.error(error.message); // Ловим ошибки
    }
  };

  const cameraPress = async () => {
    await openGallery(setPhoto);
    console.log('test1');
    if (photo) {
      console.log('test1');
      uploadPhoto(photo.uri);
      console.log('test2');
    }
  };

  // const uploadPhoto = async (photoUri: any) => {
  //   if (!photoUri) {
  //     console.error("uploadPhoto called with an EMPTY URI!");
  //     return;
  //   }
  
  //   console.log(photoUri)
  //   const formData = new FormData();
  //   formData.append('file', {
  //     uri: photoUri, // URI изображения
  //     name: 'photo.jpg', // Имя файла
  //     type: 'image/jpeg', // Тип файла
  //   } as any); // Приведение типа для TypeScript
  //   console.log(formData);
    

  //   try {
  //     // const response = await Axios.postForm('http://localhost:3000/image/upload',{
  //     //   photo: photoUri.uri
  //     // })
  //     // const response = await fetch('http://localhost:3000/image/upload', {
  //     //   method: 'POST',
  //     //   body: photoUri.uri,
  //     //   headers: {
  //     //     'Content-Type': 'multipart/form-data',
  //     //   },
  //     // });
  //     const response = await axios.post('http://localhost:3000/image/uploadf', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // Указываем тип контента
  //       },
  //     });
      
  //     setServerResponse(response.data);
  //     Alert.alert('Успех', `Фото загружено! Ответ сервера: ${response.data}`);
  //   } catch (error) {
  //     Alert.alert('Ошибка', 'Не удалось загрузить фото.');
  //   }
  // };
  const uploadPhoto = async (photoUri: string) => {
    if (!photoUri) {
      console.error("uploadPhoto called with an EMPTY URI!");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', {
      uri: photoUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  
    try {
      const response = await axios.post('http://localhost:3000/image/uploadf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setServerResponse(response.data);
      Alert.alert('Успех', `Фото загружено! Ответ сервера: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error(error);
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
