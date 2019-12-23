import request from "@/utils/request";


export const submitFileAPI = request.post.bind(null , '/importSecurityData/importUsers')