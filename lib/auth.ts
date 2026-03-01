import { cookies } from 'next/headers';
export function isAdmin(){ return cookies().get('admin_session')?.value === '1'; }
