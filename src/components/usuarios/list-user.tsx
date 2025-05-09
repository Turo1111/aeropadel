import { User } from '@/interfaces/auth.interface';
import { useAppDispatch } from '@/redux/hook';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import apiClient from '@/utils/client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import styled from 'styled-components';

export default function ListUser({search, setSearch, handleOpenUserModal, handleOpenPermissionsPopover}: {search: string, setSearch: (search: string) => void, handleOpenUserModal: (user: User) => void, handleOpenPermissionsPopover: (roleId: string, event: React.MouseEvent<HTMLButtonElement>) => void}) {

    const [data, setData] = useState<User[] | []>([])
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const [dataSearch, setDataSearch] = useState<User[] | []>([])
    const [longArray, setLongArray] = useState<number>(0)
    const {open: loading} = useSelector(getLoading)
    const observer = useRef<IntersectionObserver | null>(null);
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    

    useEffect(() => {
        const getUser = async (skip: number, limit: number) => {
            dispatch(setLoading(true))
            try {
                const response = await apiClient.post(`/user/skip`, { skip, limit }, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    },
                });
                setData(prevData => {
                    if (prevData.length === 0) {
                        return response.data.array;
                    }
                    const newData = response.data.array.filter((element: User) => {
                        return prevData.findIndex((item: User) => item._id === element._id) === -1;
                    });
                    return [...prevData, ...newData];
                })
                setLongArray(prevData => response.data.longitud)
                dispatch(setLoading(false));
            } catch (e) {
                console.log("error getUser", e);
                dispatch(setLoading(false));
            } finally {
                dispatch(setLoading(false));
            }
        }
        
        getUser(query.skip, query.limit)
    }, [dispatch, query])

    useEffect(() => {
        const getUserSearch = async (input: string) => {
            dispatch(setLoading(true))
            try {
                const response = await apiClient.post(`/user/search`, { input }, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    },
                });
                setDataSearch(response.data);
                dispatch(setLoading(false));
            } catch (e) {
                console.log("error", e);
                dispatch(setLoading(false));
            } finally {
                dispatch(setLoading(false))
            }
        }

        if (search !== '') {
            getUserSearch(search)
        }
    }, [search, dispatch])

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_DB_HOST) {
            return
        }
        const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
        socket.on(`user`, (socket) => {
            setSearch('')
            setData((prevData: User[]) => {
                const exist = prevData.find((elem: User) => elem._id === socket.data._id)
                if (exist) {
                    const newData = prevData.map((item: User) =>
                        item._id === socket.data._id ? socket.data : item
                    )
                    return newData
                }
                return [...prevData, socket.data]
            })
        })
        return () => {
            socket.disconnect();
        };
    }, [data, dataSearch])

    const lastElementRef = useCallback((node: HTMLLIElement | null) => {
        if (loading) {
            return
        };
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (search === '') {
                    if (data.length < longArray && longArray > query.limit + query.skip) {
                        setQuery(prevData => ({ skip: prevData.skip + 25, limit: prevData.limit }));
                    }
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, search, data.length, longArray, query]);

    return (
        <UserList>
        {
          search !== '' ?
            dataSearch.length !== 0 ? 
              dataSearch.map((user: User)=>{
                return <TableRow key={user._id}>
                <UserName>{user.nickname}</UserName>
                <UserRole>{user.nameRole}</UserRole>
                <ActionButtons>
                  {session?.user?.role?.permissions?.includes("update_user") && ( 
                    <ActionButton $variant="edit" title="Editar usuario" onClick={() => handleOpenUserModal(user)}>
                      <FaEdit size={14} />
                    </ActionButton>
                  )}
                  {session?.user?.role?.permissions?.includes("read_role") && (
                    <ActionButton
                      $variant="permissions"
                      title="Ver permisos"
                      onClick={(e) => handleOpenPermissionsPopover(user.role, e)}
                  >
                    <FaKey size={14} />
                  </ActionButton>
                  )}
                </ActionButtons>
              </TableRow>
              })
              : 
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay usuarios registrados</p>
              </div>
          :
            data.length !== 0 ? 
            data.map((user: User)=>{
              return <TableRow key={user._id}>
              <UserName>{user.nickname}</UserName>
              <UserRole>{user.nameRole}</UserRole>
              <ActionButtons>
                {session?.user?.role?.permissions?.includes("update_user") && (
                  <ActionButton $variant="edit" title="Editar usuario" onClick={() => handleOpenUserModal(user)}>
                    <FaEdit size={14} />
                  </ActionButton>
                )}  
                {session?.user?.role?.permissions?.includes("read_role") && (
                  <ActionButton
                    $variant="permissions"
                    title="Ver permisos"
                    onClick={(e) => handleOpenPermissionsPopover(user.role, e)}
                >
                  <FaKey size={14} />
                </ActionButton>
                )}
              </ActionButtons>
            </TableRow>
            })
            : 
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay usuarios registrados</p>
            </div>
        }
        {
          search !== '' ?
          <></>:
          <li style={{listStyle: 'none', padding: 0, margin: 0, minHeight: '1px'}} ref={lastElementRef}></li>
        }
      </UserList>
    )
}



const UserTable = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  color: #64748b;
`

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`

const UserName = styled.div`
  font-weight: 500;
`

const UserRole = styled.div`
  color: #64748b;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button<{ $variant?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: none;
  background-color: ${(props) => {
    switch (props.$variant) {
      case "edit":
        return "#e0f2fe"
      case "permissions":
        return "#fef3c7"
      default:
        return "#f1f5f9"
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case "edit":
        return "#0284c7"
      case "permissions":
        return "#d97706"
      default:
        return "#64748b"
    }
  }};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => {
      switch (props.$variant) {
        case "edit":
          return "#bae6fd"
        case "permissions":
          return "#fde68a"
        default:
          return "#e2e8f0"
      }
    }};
  }
`

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`