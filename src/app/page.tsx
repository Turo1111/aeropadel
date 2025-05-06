"use client"
import Button from "@/components/Button";
import ButtonUI from "@/components/ButtonUI";
// import Button from "@/components/Button"; // Commented out since component doesn't exist yet
import Input from "@/components/Input";
import Loading from "@/components/Loading"; 
import useLocalStorage from "@/hooks/useLocalStorage";
import { Auth } from "@/interfaces/auth.interface";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/loadingSlice";
import { getLoading } from "@/redux/loadingSlice";
import apiClient from "@/utils/client";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import * as Yup from 'yup';

interface Result {
  error: string | null;
  status: number;
  ok: boolean;
  url: string | null;
}


export default function Home() {
  const loading = useSelector(getLoading)
  const [valueStorage, setValue] = useLocalStorage("user", "")
  const dispatch = useAppDispatch();
  const router: AppRouterInstance = useRouter()
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: SignupSchema,
    onSubmit: async (formValue: Auth) => {
      console.log('Formvalue:', formValue)
      dispatch(setLoading(true))
      const response = await signIn('credentials', {
        nickname: formValue.nickname,
        password: formValue.password,
        redirect: false
      })
      const result: Result = {
        error: response?.error || null,
        status: response?.status || 400,
        ok: response?.ok || false,
        url: response?.url || null
      }

      console.log("result", result)

      if (result.error) {
        setError(result.error)
      } else {
        dispatch(setLoading(false))
        router.push('/dashboard/inicio')
      }
    }
  }) 
  

  return (
    <Main>
      <ContainerLogin>
        <Title>AEROPADEL</Title>
        <div>
          <Input label={'Usuario'} name={'nickname'} value={formik.values.nickname} onChange={formik.handleChange} type='text' />
          {formik.errors.nickname && formik.touched.nickname && (
            <p style={{color: 'red', textAlign: 'start'}}>{formik.errors.nickname}</p>
          )}
          <Input label={'Contraseña'} name={'password'} value={formik.values.password} onChange={formik.handleChange} type='password' />
          {formik.errors.password && formik.touched.password && (
            <p style={{color: 'red', textAlign: 'start'}}>{formik.errors.password}</p>
          )}
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end', width: '100%'}}>
            <div style={{display: "flex", alignItems: "center"}} >
              {error && <div style={{color: 'red', marginRight: 15}}>{error}</div>}
              <ButtonUI label={'INGRESAR'} onClick={formik.handleSubmit}/>
            </div>
          </div>
        </div>
      </ContainerLogin>
    </Main>
  );
}

const initialValues:Auth = {
  nickname: '',
  password: ''
};

const SignupSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
  nickname: Yup.string().required('Required'),
});

const Main = styled.main `
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin-top: 10%;
`

const ContainerLogin = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  min-width: 400px;
`

const Title = styled.h2 `
  margin: 15px 0;
  font-size: 32px;
`

