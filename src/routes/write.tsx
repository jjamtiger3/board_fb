import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components"
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useParams } from 'react-router-dom';

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;
const Input = styled.input`
    border: 2px solid white;
    padding: 20px;
    border-radius: 5px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf9;
    }
`;
const TextArea = styled.textarea`
    border: 2px solid white;
    padding: 20px;
    border-radius: 5px;
    font-size: 16px;
    color: white;
    background-color: black;
    width: 100%;
    resize: none;
    &::placeholder {
        font-size: 16px;
        font-family: system-ui, sans-serif;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf9;
    }
`;
const AttachFileButton = styled.label`
    padding: 10px 0;
    color: #1d9bf9;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf9;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;
const AttachFileInput = styled.input`
    display: none;
`;
const Button = styled.button`
    background-color: #1d9bf9;
    color: white;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
    float: right;
    &:hover, &:active {
        opacity: 0.9;
    }
`;
const SubmitBtn = styled.input`
    background-color: #1d9bf9;
    color: white;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
    float: right;
    &:hover, &:active {
        opacity: 0.9;
    }
`;

export default function PostForm() {
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [file, setFile] = useState<File|null>(null);

    const { id } = useParams();

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e?.target;
        if (files && files.length === 1) {
            setFile(files[0]);
        }
    }

    const validCheck = () => {
        const user = auth.currentUser;
        if (!user) {
            return false;
        }
        if (isLoading) {
            return false;
        }
        if (!title || title.length > 50) {
            return false;
        }
        if (!content || content.length > 2000) {
            return false;
        }
        return true;
    }

    const onSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!validCheck()) {
            return;
        }
        try {
            setLoading(true);
            const createdDate = new Date(Date.now()).toLocaleDateString();
            const regDate = createdDate.replace(/(\d+)\/(\d+)\/(\d+)/g, "$3-$2-$1");
            const name = user?.displayName;
            if (id) {
                const docRef = doc(db, 'customer_data', id);
                await updateDoc(docRef, {
                    title, 
                    content, 
                    // regDate, 
                    modifiedDate: regDate,
                });
            } else {
                const doc = await addDoc(collection(db, 'customer_data'), {
                    name, 
                    title, 
                    content, 
                    regDate, 
                    // modifiedDate,
                });
            }
            // if (file) {
            //     const locationRef = ref(storage, `tweet/${user.uid}-${user.displayName}/${doc.id}`);
            //     const result = await uploadBytes(locationRef, file);
            //     const photoUrl = await getDownloadURL(result.ref);
            //     await updateDoc(doc, {
            //         photo: photoUrl,
            //     });
            //     setTweet('');
            //     setFile(null);
            // }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            location.href = '/list';
        }
    }

    useEffect(() => {
        if (id) {
            setReadOnly(true);
            const fetchFormData = async () => {
                const docRef = doc(db, 'customer_data', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setTitle(docData.title);
                    setContent(docData.content);
                }
            };
            fetchFormData();
        }
        return () => {
        };
    }, [id]);

    return <Form onSubmit={onSubmit}>
        <Input 
            maxLength={2000}
            required
            placeholder="제목을 입력해주세요" 
            value={title} 
            readOnly={readOnly}
            onChange={onTitleChange} 
        />
        <TextArea 
            rows={25}
            maxLength={2000}
            required
            placeholder="내용을 입력해주세요" 
            value={content} 
            readOnly={readOnly}
            onChange={onContentChange} 
        />
        {/* <AttachFileButton htmlFor="file">
            {
                isEdit ?  
                    (file ? 'Photo updated ✅' : 'Update Photo') : 
                    (file ? "Photo added ✅" : "Add photo")
            }
        </AttachFileButton> */}
        {/* <AttachFileInput id="file" type="file" accept="image/*" onChange={onFileChange} /> */}
        <Wrapper>
            {
                readOnly ? 
                    <Button onClick={() => setReadOnly(false)}>
                        {isLoading ? '게시글 수정중...' : '게시글 수정하기'}
                    </Button> : 
                    <SubmitBtn type="submit" value={
                        isLoading ? '게시글 작성중...' : '게시글 작성하기'
                        } />
            }
        </Wrapper>
    </Form>
}