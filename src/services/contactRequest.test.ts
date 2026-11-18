// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { sendContactRequest } from './contactRequest'
afterEach(()=>vi.unstubAllGlobals())
const payload={name:'Contato demonstrativo',phone:'91999990000',acknowledged:true,request_id:'00000000-0000-4000-8000-000000000001',source:'site',campaign:''}
it('obtains CSRF protection then submits without patient or appointment fields',async()=>{
  const fetchMock=vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({csrfToken:'test-token'})}).mockResolvedValueOnce({ok:true,json:async()=>({status:'received'})})
  vi.stubGlobal('fetch',fetchMock)
  await sendContactRequest(payload)
  expect(fetchMock).toHaveBeenCalledTimes(2)
  const options=fetchMock.mock.calls[1][1]
  expect(options.headers['X-CSRFToken']).toBe('test-token')
  expect(JSON.parse(options.body)).toEqual({...payload,website:''})
})
it('does not report success when the API fails',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:false,status:503}))
  await expect(sendContactRequest(payload)).rejects.toThrow('Não foi possível conectar')
})
