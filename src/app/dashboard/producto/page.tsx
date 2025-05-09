"use client"

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { FaSearch, FaPlus } from "react-icons/fa"
import styled from "styled-components"
import ProductCard from "@/components/product/ProductCard"
import NewProductModal from "@/components/product/NewProduct"
import { Product } from "@/interfaces/product.interface"
import { useAppDispatch } from "@/redux/hook"
import { getLoading, setLoading } from "@/redux/loadingSlice"
import apiClient from "@/utils/client"
import { io } from 'socket.io-client';
import { useSelector } from "react-redux"
import EditProduct from "@/components/product/EditProduct"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface CBP {
  _id: (string | number) 
  descripcion: string
}

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

const Button = styled.button`
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
  
  @media (min-width: 768px) {
    width: auto;
  }

  &:hover {
    background-color: #1e293b;
  }
`

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export default function ProductoPage() {
  const [search, setSearch] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState<Product[] | []>([])
  const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
  const [dataSearch, setDataSearch] = useState<Product[] | []>([])
  const [longArray, setLongArray] = useState<number>(0)
  const {open: loading} = useSelector(getLoading)
  const observer = useRef<IntersectionObserver | null>(null);
  const [openEdit, setOpenEdit] = useState(false)
  const [productSelected, setProductSelected] = useState<Product | undefined>(undefined)
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchProduct = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(prevData=>e.target.value)
}    

useEffect(()=>{

  const getProduct = async (skip: number, limit: number) => {
    dispatch(setLoading(true))
    try {
        const response = await apiClient.post(`/product/skip`, { skip, limit },
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            },
        });
        setData(prevData => {

            if (prevData.length === 0) {
                return response.data.array;
            }
            const newData = response.data.array.filter((element: Product) => {
                return prevData.findIndex((item: Product) => item._id === element._id) === -1;
            });

            return [...prevData, ...newData];
        })
        setLongArray(prevData=>response.data.longitud)
        dispatch(setLoading(false));
    } catch (e) {
        console.log("error getProduct", e);
        dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false));
    } 
  }
  
  getProduct(query.skip, query.limit)
  
},[dispatch, query]) 

useEffect(()=>{

  const getProductSearch = async (input: string) => {
    dispatch(setLoading(true))
    try {
        const response = await apiClient.post(`/product/search`, {input}, 
          {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`
            },
          }
        );
        setDataSearch(response.data);
        dispatch(setLoading(false));
    } catch (e) {
        console.log("error", e);
        dispatch(setLoading(false));
    } finally {
      dispatch(setLoading(false))
    }
  }

  if ( search !== '') {
    getProductSearch(search)
  }
},[search, dispatch]) 

useEffect(() => {
  if (session?.user?.role?.permissions) {
    const hasProductPermission = session.user.role.permissions.includes("read_product");
    
    if (!hasProductPermission) {
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
  socket.on(`product`, (socket) => {
    setSearch(prevData=>'')
    setData((prevData: Product[])=>{
      const exist = prevData.find((elem: Product) => elem._id === socket.data._id )
      if (exist) {
        const newData = prevData.map((item: Product) =>
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
},[data, dataSearch])
  
const lastElementRef = useCallback(
  (node: HTMLLIElement | null) => {
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
  },
  [loading, search, data.length, longArray, query]
);

  return (
    <Container>
      <Title>Productos</Title>

      <Header>
        <SearchContainer>
          <SearchIcon>
            <FaSearch size={14} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => searchProduct(e)}
          />
        </SearchContainer>
        {session?.user?.role?.permissions?.includes("create_product") && (  
          <Button onClick={() => setIsModalOpen(true)}>
            <FaPlus size={14} />
            Nuevo
          </Button>
        )}
      </Header>

      <ProductList>
        {
          search !== '' ?
            dataSearch.length !== 0 ? 
              dataSearch.map((product: Product, index: number)=>{
                return <ProductCard key={index} name={product.name} 
                  category={product.NameCategoria || 'Sin categoria'} price={product.precioUnitario} 
                  stock={product.stock} 
                  onEdit={()=>{
                    setOpenEdit(true)
                    setProductSelected(product)
                  }}
                />
              })
              : 
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay productos registrados</p>
              </div>
          :
            data.length !== 0 ? 
            data.map((product: Product, index: number)=>{
              return <ProductCard key={index} name={product.name} 
                category={product.NameCategoria || 'Sin categoria'} price={product.precioUnitario} 
                stock={product.stock} 
                onEdit={()=>{
                  setOpenEdit(true)
                  setProductSelected(product)
                }}
              />
            })
            : 
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay productos registrados</p>
            </div>
        }
        {
          search !== '' ?
          <></>:
          <li style={{listStyle: 'none', padding: 0, margin: 0, minHeight: '1px'}} ref={lastElementRef}></li>
        }
      </ProductList>
      
      <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {
        productSelected &&
        <EditProduct isOpen={openEdit} onClose={()=>setOpenEdit(false)} product={productSelected} />
      }
    </Container>
  )
}
