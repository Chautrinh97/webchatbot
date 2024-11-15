import ChatArea from "@/components/Chat/ChatArea";
import axiosInstance from "../apiService/axios";
import { getCookie } from "@/utils/cookie";
const NewConversation = async ({ }) => {
  const accessToken = await getCookie('accessToken');
  // const response = await axiosInstance.get(
  //   '/department',
  //   {
  //     headers: {
  //       Cookie: `accessToken=${accessToken}`,
  //     },
  //     withCredentials: true,
  //   }
  // );
  // const departments = response.data.map((department: any)=>({
  //   id: department._id,
  //   name: department.name,
  // }));
  return (
    <ChatArea/>
  );
}
export default NewConversation;