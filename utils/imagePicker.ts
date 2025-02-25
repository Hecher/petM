import { launchCamera, launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';

export const openCamera = (setPhoto: (photo: { uri: string } | null) => void): void => {
  launchCamera({ mediaType: 'photo', quality: 1 }, (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('Пользователь отменил съемку');
      return;
    }
    if (response.errorCode) {
      console.log(`Ошибка камеры: ${response.errorMessage}`);
      return;
    }
    if (response.assets && response.assets.length > 0) {
      setPhoto({ uri: response.assets[0].uri! });
    }
  });
};

export const openGallery = (setPhoto: (photo: { uri: string } | null) => void): void => {
  launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('Пользователь отменил выбор фото');
      return;
    }
    if (response.errorCode) {
      console.log(`Ошибка галереи: ${response.errorMessage}`);
      return;
    }
    if (response.assets && response.assets.length > 0) {
      setPhoto({ uri: response.assets[0].uri! });
    }
  });
};
