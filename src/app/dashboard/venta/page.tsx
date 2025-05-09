"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FaSearch, FaPlus } from "react-icons/fa"
import styled from "styled-components"
import SaleCard from "../../../components/venta/SaleCard"
import Link from "next/link"
import { Sale } from "../../../interfaces/sale.interface"
import { Types } from "mongoose"
import { useSelector } from "react-redux"
import { getLoading, setLoading } from "@/redux/loadingSlice"
import { useAppDispatch } from "@/redux/hook"
import apiClient from "@/utils/client"
import { io } from 'socket.io-client';
import InfoPopover from "@/components/venta/info-popover"
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation"
// Styled Components
const Container = styled.div`
  padding: 16px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  width: 100%;
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #94a3b8;
    box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2);
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #94a3b8;
`

const Button = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #0f172a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  text-decoration: none;
  
  @media (min-width: 768px) {
    width: auto;
  }

  &:hover {
    background-color: #1e293b;
  }
`

const SalesList = styled.div`
  display: flex;
  flex-direction: column;
`

export default function VentaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [search, setSearch] = useState<string>('')
  const [data, setData] = useState<Sale[]>([])
  const [longArray, setLongArray] = useState(0)
  const [dataSearch, setDataSearch] = useState<Sale[]>([])
  const observer = useRef<IntersectionObserver | null>(null);
  const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
  const {open: loading} = useSelector(getLoading)
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [saleId, setSaleId] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const getSale = async (skip: number, limit: number) => {
    dispatch(setLoading(true))
    try {
      const response = await apiClient.post(`/sale/skip`, { skip, limit });
      setData((prevData:Sale[]) => {
        if (prevData.length === 0) {
            return response.data.array;
        }
        const newData = response.data.array.filter((element: Sale) => {
            return prevData.findIndex((item: Sale) => item._id === element._id) === -1;
        });
        return [...prevData, ...newData];
      })
      setLongArray(prevData=>response.data.longitud)
      dispatch(setLoading(false))
    } catch (e) {
      console.log("error getSale",e);
      dispatch(setLoading(false))
    } finally {
      dispatch(setLoading(false));
    }
  }

  const getSaleSearch = async (input: string) => {
    dispatch(setLoading(true))
    try {
        const {data}:{data:Sale[]} = await apiClient.post(`/sale/search`, {input});
        setDataSearch(data);
        dispatch(setLoading(false));
    } catch (e) {
        console.log("error", e);
        dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false))
    }
  }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{
    if ( search !== '') {
      getSaleSearch(search)
    }
  },[search]) 
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(()=>{
    getSale(query.skip, query.limit)
  },[query])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session?.user?.role?.permissions) {
      const hasSalePermission = session.user.role.permissions.includes("read_sale");
      
      if (!hasSalePermission) {
        router.push('/dashboard/inicio'); 
        return;
      }
    }
  }, [session]);

  useEffect(()=>{
    if (!process.env.NEXT_PUBLIC_DB_HOST) {
      return
    }
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on(`sale`, (socket) => {
      setData((prevData:Sale[])=>{
        return [ socket.data, ...prevData ]
      })
    })
    return () => {
      socket.disconnect();
    }; 
  },[data])
  // eslint-disable-next-line react-hooks/exhaustive-deps
    
  const lastElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (loading) return;
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
    },
    [loading, data, search, query]
  );

  return (
    <Container>
      <Title>Ventas</Title>

      <Header>
        <SearchContainer>
          <SearchIcon>
            <FaSearch size={14} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar ventas..."
            value={searchTerm}
            onChange={(e) => setSearch(prevData=>e.target.value)}
          />
        </SearchContainer>

        {session?.user?.role?.permissions?.includes("create_sale") && (
          <Link href="/dashboard/venta/nueva" passHref legacyBehavior>
            <Button>
              <FaPlus size={14} />
            Nuevo
            </Button>
          </Link>
        )}
      </Header>
      

      <SalesList>
        {
               search !== '' ?
                dataSearch.length !== 0 ?
                dataSearch.map((item:Sale, index:number)=>{
                  if (!item._id || !item.nameCliente) {
                    return ''
                  }
                  return  <SaleCard
                  key={item._id.toString()}
                  customer={item.nameCliente}
                  date={item.createdAt || 'Fecha no definida'}
                  total={item.total}
                  id={item._id.toString()}
                  onPrint={() => {}}
                  onInfo={() => {
                    if(!item._id){
                      setAnchorEl(null);
                      setSaleId(null)
                      return
                    }
                    setAnchorEl(document.getElementById(item._id.toString()));setSaleId(item._id.toString())
                  } }
                  onEdit={() => {}}
                />
                })
                :
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                  <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay ventas registradas</p>
                </div>
              :
                data.length !== 0 ? 
                data.map((item:Sale, index:number)=>{
                  if (!item._id || !item.nameCliente) {
                    return ''
                  }
                  return <SaleCard
                  key={item._id.toString()}
                  id={item._id.toString()}
                  customer={item.nameCliente}
                  date={item.createdAt || 'Fecha no definida'}
                  total={item.total}
                  onPrint={() => {} }
                  onInfo={() => {
                    if(!item._id){
                      setAnchorEl(null);
                      setSaleId(null)
                      return
                    }
                    setAnchorEl(document.getElementById(item._id.toString()));setSaleId(item._id.toString())
                  } }
                  onEdit={() => {} }
                />
                })
                  :
                  <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay ventas registradas</p>
                  </div>
            }
            {search === '' && data.length < longArray && (
              <li
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 15,
                  minHeight: 5
                }}
                ref={lastElementRef}
              >
              </li>
            )}
      </SalesList>

      {(anchorEl && saleId) && <InfoPopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)} saleId={saleId} />}
    </Container>
  )
}
