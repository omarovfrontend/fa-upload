import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from  './upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyCf7Kyc8r0BGZTi9KPckvhGS0HdiKLonns",
    authDomain: "fe-upload-cee42.firebaseapp.com",
    projectId: "fe-upload-cee42",
    storageBucket: "fe-upload-cee42.appspot.com",
    messagingSenderId: "593554199733",
    appId: "1:593554199733:web:47b079394634d1ad4c5afc"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.gif', '.jpg', '.jpeg'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`);
            const task = ref.put(file);

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log(error);
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download url', url);
                })
            })
        })
    }
})