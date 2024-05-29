import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
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
    width: 200px;
    padding: 10px 0;
    margin-right: 20px;
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
const SubmitBtn = styled.input`
    background-color: #1d9bf9;
    color: white;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    width: 200px;
    &:hover, &:active {
        opacity: 0.9;
    }
`;
const Image = styled.img`
    width: 200px;
    height: auto;
    border-radius: 15px;
`;

export default function PostForm() {
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [imagePath, setImagePath] = useState('');

    const { id } = useParams();
    const user = auth.currentUser || null;

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }

    const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e?.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFile(file);
            if (id) {
                uploadFiles(file, id);
            } else {
                const imageUrl = URL.createObjectURL(file);
                setImagePath(imageUrl);
            }
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

    const uploadFiles = async (file: File, docId: string) => {
        const locationRef = ref(storage, `list/${user?.uid}-${user?.displayName}/${docId}`);
        // 각 파일을 업로드하고 해당 Promise를 배열에 저장
        const uploadResult = await uploadBytes(locationRef, file);
        const downloadUrl =  await getDownloadURL(uploadResult.ref);
        setImagePath(downloadUrl);
    };

    const onSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                    modifiedDate: regDate,
                    imagePath
                });
            } else {
                const doc = await addDoc(collection(db, 'customer_data'), {
                    name, 
                    userId: user?.uid,
                    title, 
                    content, 
                    regDate, 
                    imagePath
                });
                if (file) {
                    const locationRef = ref(storage, `list/${user?.uid}-${user?.displayName}/${doc.id}`);
                    const result = await uploadBytes(locationRef, file);
                    const imagePath = await getDownloadURL(result.ref);
                    await updateDoc(doc, {
                        imagePath,
                    });
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            location.href = '/list';
        }
    }

    useEffect(() => {
        if (id) {
            const fetchFormData = async () => {
                const docRef = doc(db, 'customer_data', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    setTitle(docData.title);
                    setContent(docData.content);
                    setUserId(docData.userId);
                    setReadOnly(docData.userId !== auth.currentUser?.uid);
                    setImagePath(docData.imagePath);
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
        {
            ((id && userId === user?.uid) || !id) && 
                <Wrapper>
                    <AttachFileButton htmlFor="file">파일첨부</AttachFileButton>
                    <AttachFileInput id="file" type="file" accept="image/*" onChange={onFileChange} />
                        <SubmitBtn type="submit" value={
                            isLoading ? '게시글 작성중...' : '게시글 작성하기'
                        } />
                </Wrapper>
        }
        {
            imagePath &&
                <Image src={imagePath} />
        }
    </Form>
}