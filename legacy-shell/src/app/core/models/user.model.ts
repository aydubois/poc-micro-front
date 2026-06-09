export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  isActive: boolean
  createdAt: string
}
