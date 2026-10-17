import { getEquipmentType } from "./equipment-config"

export type TermoData = {
  company: {
    razaoSocial: string
    cnpj: string
    nomeMarca: string
    unidadeRazaoSocial: string
    unidadeCnpj: string
  }
  colaborador: {
    nome: string
    cpf: string
    data: string // já formatada, ex: "30/06/2026"
  }
  equipamento: {
    tipo: string // id do EquipmentType
    marca: string
    modelo: string
    specificValue: string
    acessorios: string
  }
  supervisor: string
  // Cláusulas extras, adicionadas pelo usuário no formulário.
  // Entram automaticamente numeradas em sequência às cláusulas fixas (9, 10, 11...),
  // sempre no final do Termo de Responsabilidade, antes da declaração de aceite.
  clausulasAdicionais?: { titulo: string; texto: string }[]
}

// Blocos usados para renderizar o documento no PDF.
export type Block =
  | { type: "title"; text: string }
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "field"; label: string; value: string }
  | { type: "bullet"; text: string }
  | { type: "spacer"; size?: number }

// Quantidade de cláusulas fixas no Termo de Responsabilidade (1 a 8 hoje).
// Usado para numerar as cláusulas adicionais em sequência (9, 10, 11...).
const TOTAL_CLAUSULAS_FIXAS = 8

/**
 * TERMO DE RESPONSABILIDADE PARA UTILIZAÇÃO DE EQUIPAMENTOS DE T.I
 * Texto reproduzido PALAVRA POR PALAVRA do documento assinado fornecido pela empresa.
 * Apenas nome, CPF, data e dados da empresa são variáveis.
 */
export function getTermoResponsabilidade(data: TermoData): Block[] {
  const { razaoSocial, cnpj } = data.company

  // Monta os blocos das cláusulas adicionais (se houver), numeradas em sequência.
  const blocksClausulasAdicionais: Block[] = []
  const clausulasAdicionais = data.clausulasAdicionais?.filter(
    (c) => c.titulo.trim() || c.texto.trim(),
  )
  if (clausulasAdicionais && clausulasAdicionais.length > 0) {
    clausulasAdicionais.forEach((clausula, index) => {
      const numero = TOTAL_CLAUSULAS_FIXAS + index + 1
      const titulo = clausula.titulo.trim() || "CLÁUSULA ADICIONAL"
      blocksClausulasAdicionais.push({ type: "spacer", size: 2 })
      blocksClausulasAdicionais.push({ type: "heading", text: `${numero}. ${titulo.toUpperCase()}` })
      blocksClausulasAdicionais.push({ type: "paragraph", text: clausula.texto.trim() })
    })
  }

  return [
    { type: "title", text: "TERMO DE RESPONSABILIDADE PARA UTILIZAÇÃO DE EQUIPAMENTOS DE T.I" },
    { type: "spacer", size: 4 },
    { type: "heading", text: razaoSocial },
    { type: "paragraph", text: `CNPJ: ${cnpj}` },
    { type: "spacer", size: 2 },
    {
      type: "paragraph",
      text: `Pelo presente termo, o(a) abaixo-assinado(a) se compromete a utilizar os equipamentos de T.I fornecidos pela ${razaoSocial}, de acordo com as normas estabelecidas e reconhece a responsabilidade por qualquer dano causado por mal uso do equipamento.`,
    },
    { type: "spacer", size: 2 },
    { type: "field", label: "NOME DO COLABORADOR", value: data.colaborador.nome },
    { type: "field", label: "CPF DO COLABORADOR", value: data.colaborador.cpf },
    { type: "spacer", size: 2 },
    { type: "heading", text: "1. RESPONSABILIDADE" },
    { type: "paragraph", text: "O usuário se responsabiliza por:" },
    { type: "bullet", text: "Manter os equipamentos em bom estado de conservação." },
    {
      type: "bullet",
      text: "Utilizar o equipamento de acordo com as normas de uso estabelecidas pela academia.",
    },
    {
      type: "bullet",
      text: "Arcar com os custos de reparo ou substituição do equipamento em caso de danos provocados por mau uso, negligência ou descuido.",
    },
    {
      type: "bullet",
      text: "Notificar imediatamente a administração em caso de perda, roubo ou furto do equipamento.",
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "2. TERMOS DE USO" },
    { type: "bullet", text: "O uso dos equipamentos é restrito a atividades relacionadas à academia." },
    {
      type: "bullet",
      text: `É proibido o uso do equipamento para fins pessoais ou que não estejam relacionados às atividades da ${razaoSocial}.`,
    },
    {
      type: "bullet",
      text: "O usuário não deve instalar softwares ou aplicativos sem autorização prévia da administração.",
    },
    {
      type: "bullet",
      text: "O usuário deve garantir que o equipamento seja utilizado em ambientes seguros e protegidos.",
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "3. PROTEÇÃO DE DADOS" },
    {
      type: "paragraph",
      text: "O usuário compromete-se a respeitar a Lei Geral de Proteção de Dados (LGPD), garantindo a confidencialidade e a segurança das informações dos clientes da academia a que tiver acesso durante a utilização dos equipamentos. É vedado o uso ou compartilhamento indevido de dados pessoais. O usuário deve notificar imediatamente a administração em caso de violação de dados.",
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "4. DEVOLUÇÃO DO EQUIPAMENTO" },
    {
      type: "paragraph",
      text: `Os equipamentos deverão ser devolvidos à ${razaoSocial} nas mesmas condições em que foi recebido, salvo desgaste natural. A devolução deve ocorrer no término do uso ou sempre que solicitado pela administração.`,
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "5. PENALIDADES" },
    {
      type: "paragraph",
      text: "Em caso de descumprimento dos termos aqui estabelecidos, o usuário poderá ser responsabilizado civil e criminalmente, além de responder por possíveis perdas e danos à academia. O usuário também poderá perder o direito de utilizar o equipamento no futuro.",
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "6. ACOMPANHAMENTO E AUDITORIA" },
    {
      type: "paragraph",
      text: `A administração da ${razaoSocial} reserva-se o direito de realizar auditorias periódicas no uso dos equipamentos, incluindo verificação de instalação de software e integridade do equipamento.`,
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "7. MODIFICAÇÕES NO TERMO" },
    {
      type: "paragraph",
      text: "Este termo poderá ser modificado a qualquer momento pela administração, sendo as alterações comunicadas ao usuário. O uso contínuo dos equipamentos após a notificação de mudanças implica aceitação das novas condições.",
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "8. VIGÊNCIA" },
    {
      type: "paragraph",
      text: "Este termo tem validade enquanto o usuário estiver em posse do equipamento, podendo ser revogado a qualquer momento pela administração da academia.",
    },
    // Cláusulas adicionais (se houver) entram aqui, sempre depois da última cláusula fixa.
    ...blocksClausulasAdicionais,
    { type: "spacer", size: 6 },
    { type: "paragraph", text: "Declaro que li e concordo com os termos acima." },
    { type: "spacer", size: 2 },
    { type: "paragraph", text: `DATA ${data.colaborador.data}` },
  ]
}

/**
 * TERMO DE RECEBIMENTO DO EQUIPAMENTO
 * Texto reproduzido PALAVRA POR PALAVRA do documento assinado fornecido pela empresa.
 * Apenas nome, dados do equipamento, unidade e data são variáveis.
 */
export function getTermoRecebimento(data: TermoData): Block[] {
  const tipo = getEquipmentType(data.equipamento.tipo)
  const nomeEquip = tipo?.nomeNoTermo ?? "equipamento"
  const campoLabel = tipo?.specificField.label ?? "Identificador"
  const nome = data.colaborador.nome || "________________"

  return [
    {
      type: "paragraph",
      text: `Eu, ${nome} Declaro que recebi, em bom estado de conservação e funcionamento, o ${nomeEquip} abaixo descrito, entregue pela empresa ${data.company.nomeMarca}.`,
    },
    { type: "spacer", size: 2 },
    { type: "heading", text: "Informações do Equipamento:" },
    { type: "bullet", text: `Modelo: ${data.equipamento.modelo || ""}` },
    { type: "bullet", text: `Marca: ${data.equipamento.marca || ""}` },
    { type: "bullet", text: `${campoLabel}: ${data.equipamento.specificValue || ""}` },
    { type: "bullet", text: `Acessórios (se houver): ${data.equipamento.acessorios || ""}` },
    { type: "spacer", size: 2 },
    {
      type: "paragraph",
      text: `Este ${nomeEquip} será de minha responsabilidade a partir da data de recebimento.`,
    },
    { type: "spacer", size: 2 },
    { type: "paragraph", text: `Unidade: ${data.company.unidadeRazaoSocial}` },
    { type: "paragraph", text: `CNPJ: ${data.company.unidadeCnpj}` },
    { type: "paragraph", text: `Data: ${data.colaborador.data}` },
    { type: "spacer", size: 2 },
    { type: "paragraph", text: "Assinatura do Recebedor:" },
  ]
}
