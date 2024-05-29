import { useEffect, useState } from "react"
import { ICustomerData } from "../interfaces/ICustomerData";
import { Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const Wrapper = styled.div`
    width: 100%;
    max-width: 860px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 20px;
`;
const Table = styled.table`
    width: 100%;
    border-radius: 8px;
    border-collapse: collapse;
    background-color: #ffffff;
`;
const Row = styled.tr`
    background-color: #f9f9f9;
    &:hover {
        cursor: pointer;
        background-color: #ffeeee;
    }
`;
const Cell = styled.td`
    padding: 15px;
    border: 1px solid #ddd;
    text-align: left;
    color: #333;
`;
const HeaderCell = styled.th`
    padding: 15px;
    border: 1px solid #ddd;
    text-align: left;
    background-color: #333;
    color: white;
    font-weight: bold;
`;

export default function List() {
    const [data, setData] = useState<ICustomerData[]>([]);
    const navigate = useNavigate();
    const handleRowClick = (id: string) => {
        navigate(`/write/${id}`);
    };
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchList = async () => {
          const customerQuery = query(
            collection(db, "customer_data"),
            orderBy("regDate", "desc"),
            limit(10)
          );
          unsubscribe = await onSnapshot(customerQuery, (snapshot) => {
            const listData = snapshot.docs.map((doc) => {
              const { name, userId, title, content, regDate, modifiedDate } = doc.data();
              return {
                name, 
                userId,
                title, 
                content, 
                regDate, 
                modifiedDate,
                id: doc.id
              };
            });
            setData(listData);
          });
        };
        fetchList();
        return () => {
            unsubscribe && unsubscribe();
        };
    }, []);
    return (
        <Wrapper>
            <Table>
                <thead>
                    <Row>
                        <HeaderCell style={{'borderTopLeftRadius': '8px'}}>No</HeaderCell>
                        <HeaderCell>고객명</HeaderCell>
                        <HeaderCell>제목</HeaderCell>
                        <HeaderCell>등록일</HeaderCell>
                        <HeaderCell style={{'borderTopRightRadius': '8px'}}>수정일</HeaderCell>
                    </Row>
                </thead>
                <tbody>
                    {
                        data.map((_data: ICustomerData) => (
                            <Row key={_data.id} onClick={() => handleRowClick(_data.id || '')}>
                                <Cell>
                                    {
                                        // 순번컬럼 구현
                                    }
                                </Cell>
                                <Cell>
                                    {
                                        _data.name
                                    }
                                </Cell>
                                <Cell>
                                    {
                                        _data.title
                                    }
                                </Cell>
                                <Cell>
                                    {
                                        _data.regDate
                                    }
                                </Cell>
                                <Cell>
                                    {
                                        _data.modifiedDate
                                    }
                                </Cell>
                            </Row>
                        ))
                    }
                </tbody>
            </Table>
        </Wrapper>
    )
}