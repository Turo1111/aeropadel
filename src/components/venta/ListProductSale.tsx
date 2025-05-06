import { Product } from '@/interfaces/product.interface'
import { useAppDispatch } from '@/redux/hook'
import { getLoading, setLoading } from '@/redux/loadingSlice'
import { addItemSale } from '@/redux/saleSlice'
import apiClient from '@/utils/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import ProductCard from '../product/ProductCard'
import ProductCardSale from './ProductCardSale'
import { FaSearch } from 'react-icons/fa'

export default function ListProductSale() {

    const [search, setSearch] = useState<string>('')
    const [data, setData] = useState<Product[] | []>([])
    const [query, setQuery] = useState<{skip: number, limit: number}>({skip: 0, limit: 25})
    const [dataSearch, setDataSearch] = useState<Product[] | []>([])
    const [longArray, setLongArray] = useState<number>(0)
    const {open: loading} = useSelector(getLoading)
    const dispatch = useAppDispatch();
    const observer = useRef<IntersectionObserver | null>(null);

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
            console.log("error", e);
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
      [loading, search, data.length, longArray]
    );

  return (
    <Section>
      <SectionHeader>
        <Title>Lista de Productos</Title>
        <SearchContainer>
          <SearchIcon>
            <FaSearch size={14} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchContainer>
      </SectionHeader>
      <SectionContent>
        <ProductList>
        {
          search !== '' ?
            dataSearch.length !== 0 ? 
              dataSearch.map((product: Product, index: number)=>{
                return <ProductCardSale key={index} onClick={() => dispatch(addItemSale({item: product}))}
                    category={product.NameCategoria || 'Sin categoria'} name={product.name}
                    price={product.precioUnitario} stock={product.stock} 
                />
              })
              : 
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <p style={{ fontSize: "16px", color: "#6b7280" }}>No hay productos registrados</p>
              </div>
          :
            data.length !== 0 ? 
            data.map((product: Product, index: number)=>{
              return <ProductCardSale key={index} onClick={() => dispatch(addItemSale({item: product}))}
              category={product.NameCategoria || 'Sin categoria'} name={product.name}
              price={product.precioUnitario} stock={product.stock} 
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
      </SectionContent>
    </Section>
  )
}

const Section = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex: 1;
  flex-direction: column;
`


const SectionHeader = styled.div`
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 14px;
  background-color: #f8fafc;
`

const SectionContent = styled.div`
  padding: 5px;
  overflow-y: scroll;
  @media only screen and (max-width: 650px) {
    max-height: 40vh;
  }
`


const ProductList = styled.ul`
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
  }
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

const Title = styled.h1`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
`