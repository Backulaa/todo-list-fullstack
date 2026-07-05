import axios from 'axios'
import type { ApiResponse, PageResponse, Todo, TodoRequest } from '../types/todo'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const todoApi = {
  getTodos: async (params?: {
    keyword?: string
    completed?: boolean
    page?: number
    size?: number
  }) => {
    const response = await api.get<ApiResponse<PageResponse<Todo>>>('/todos', {
      params: {
        ...params,
        sort: 'createdAt,desc',
      },
    })

    return response.data.data
  },

  createTodo: async (data: TodoRequest) => {
    const response = await api.post<ApiResponse<Todo>>('/todos', data)
    return response.data.data
  },

  updateTodo: async (id: string, data: TodoRequest) => {
    const response = await api.put<ApiResponse<Todo>>(`/todos/${id}`, data)
    return response.data.data
  },

  updateCompletedStatus: async (id: string, completed: boolean) => {
    const response = await api.patch<ApiResponse<Todo>>(`/todos/${id}/completed`, null, {
      params: { completed },
    })

    return response.data.data
  },

  deleteTodo: async (id: string) => {
    await api.delete(`/todos/${id}`)
  },
}