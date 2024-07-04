import { PrismaClient } from "@prisma/client"
import { Router, Request, Response } from "express"

const prisma = new PrismaClient()
const router = Router()

// Função para obter todas as candidatas
router.get("/", async (req: Request, res: Response) => {
  try {
    const candidatas = await prisma.candidata.findMany()
    res.status(200).json(candidatas)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Tipo para a função de validação
type ValidationResult = {
  valid: boolean
  message?: string
}

// Função para validar os dados de entrada
const validateCandidataData = (nome: string, clube: string, idade: number, sonho: string): ValidationResult => {
  if (!nome || !clube || !idade || !sonho) {
    return { valid: false, message: "Informe nome, clube, idade e sonho" }
  }
  return { valid: true }
}

// Função para criar uma candidata
const createCandidata = async (nome: string, clube: string, idade: number, sonho: string) => {
  return await prisma.candidata.create({
    data: { nome, clube, idade, sonho }
  })
}

// Função principal do endpoint de criação de candidata
router.post("/", async (req: Request, res: Response) => {
  const { nome, clube, idade, sonho } = req.body

  const validation = validateCandidataData(nome, clube, idade, sonho)
  if (!validation.valid) {
    res.status(400).json({ erro: validation.message })
    return
  }

  try {
    const candidata = await createCandidata(nome, clube, idade, sonho)
    res.status(201).json(candidata)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
