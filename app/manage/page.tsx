'use client';
import { useRouter } from 'next/navigation';

const ManagePage = () => {
  const router = useRouter();
  router.push('/manage/issuing-body');
  return null; 
};

export default ManagePage;