import { Role } from '@/interfaces/auth.interface';
import { useAppDispatch } from '@/redux/hook';
import { getLoading, setLoading } from '@/redux/loadingSlice';
import apiClient from '@/utils/client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaKey } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import styled from 'styled-components';

export default function ListRoles({search, setSearch, handleOpenRoleModal, handleOpenPermissionsPopover}: 
    {search: string, setSearch: (search: string) => void, handleOpenRoleModal: (role: Role) => void, handleOpenPermissionsPopover: (roleId: string, event: React.MouseEvent<HTMLButtonElement>) => void}) {

    const [data, setData] = useState<Role[] | []>([])
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const [dataSearch, setDataSearch] = useState<Role[] | []>([])
    const [longArray, setLongArray] = useState<number>(0)
    const {open: loading} = useSelector(getLoading)
    const observer = useRef<IntersectionObserver | null>(null);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        const getRole = async (skip: number, limit: number) => {
            dispatch(setLoading(true))
            try {
                const response = await apiClient.post(`/role/skip`, { skip, limit }, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
                    },
                });
                setData(prevData => {
                    if (prevData.length === 0) {
                        return response.data.array;
                    }
                    const newData = response.data.array.filter((element: Role) => {
                        return prevData.findIndex((item: Role) => item._id === element._id) === -1;
                    });
                    return [...prevData, ...newData];
                })
                setLongArray(prevData => response.data.longitud)
                dispatch(setLoading(false));
            } catch (e) {
                console.log("error getRole", e);
                dispatch(setLoading(false));
            } finally {
                dispatch(setLoading(false));
            }
        }
        
        getRole(query.skip, query.limit)
    }, [dispatch, query])

    useEffect(() => {
        const getRoleSearch = async (input: string) => {
            dispatch(setLoading(true))
            try {
                const response = await apiClient.post(`/role/search`, { input }, {
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
            getRoleSearch(search)
        }
    }, [search, dispatch])

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_DB_HOST) {
            return
        }
        const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
        socket.on(`role`, (socket) => {
            console.log('socket role', socket)
            setSearch('')
            console.log('data role', data)
            setData((prevData: Role[]) => {
                console.log('prevData role', prevData)
                if (prevData.length === 0) {
                    return [socket.data]
                }
                const exist = prevData?.find((elem: Role) => elem._id === socket.data._id)
                if (exist) {
                    const newData = prevData.map((item: Role) =>
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
              dataSearch.map((role: Role)=>{
                return <TableRow key={role._id}>
                <UserName>{role.name}</UserName>
                <ActionButtons>
                  <ActionButton $variant="edit" title="Editar rol" onClick={() => handleOpenRoleModal(role)}>
                    <FaEdit size={14} />
                  </ActionButton>
                  <ActionButton
                    $variant="permissions"
                    title="Ver permisos"
                    onClick={(e) => handleOpenPermissionsPopover(role._id, e)}
                  >
                    <FaKey size={14} />
                  </ActionButton>
                </ActionButtons>
              </TableRow>
              })
              : 
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay roles registrados</p>
              </div>
          :
            data.length !== 0 ? 
            data.map((role: Role)=>{
              return <TableRow key={role._id}>
              <UserName>{role.name}</UserName>
              <ActionButtons>
                <ActionButton $variant="edit" title="Editar rol" onClick={() => handleOpenRoleModal(role)}>
                  <FaEdit size={14} />
                </ActionButton>
                <ActionButton
                  $variant="permissions"
                  title="Ver permisos"
                  onClick={(e) => handleOpenPermissionsPopover(role._id, e)}
                >
                  <FaKey size={14} />
                </ActionButton>
              </ActionButtons>
            </TableRow>
            })
            : 
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay roles registrados</p>
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
  grid-template-columns: 1fr auto;
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