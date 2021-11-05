import React from 'react';
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';
import { useState } from 'react';

export default function NweetFactory({ userObj }) {
  const [attachment, setAttachment] = useState('');
  const [nweet, setNweet] = useState('');
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let attachmentUrl = '';
      const nweetObj = {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
      };
      console.log(attachment);
      if (attachment !== '') {
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        await uploadString(attachmentRef, attachment, 'data_url').then(
          (snapshot) => {
            console.log('Uploaded a data_url string!');
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              nweetObj.attachmentUrl = downloadURL;
              addDoc(collection(dbService, 'nweets'), nweetObj);
            });
          },
        );
      } else {
        addDoc(collection(dbService, 'nweets'), nweetObj);
      }

      setAttachment('');
      setNweet('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment(null);
  return (
    <form onSubmit={onSubmit}>
      <input
        value={nweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Nweet" />
      {attachment && (
        <div>
          <img src={attachment} alt="uploadImage" width="50px" height="50px" />
          <button onClick={onClearAttachment}>Cancel upload</button>
        </div>
      )}
    </form>
  );
}
