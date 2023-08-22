let bancodedados = require('../bancodedados')

function gerarData () {
    let data = new Date()
    const ano = data.getUTCFullYear()
    let mes = data.getUTCMonth()
    let dia = data.getUTCDate()
    let hora = data.getHours()
    let minuto = data.getMinutes()
    let segundo = data.getSeconds()
    
    if (mes <= 9) {
        mes = '0' + mes
    }
    if (dia <= 9) {
        dia = '0' + dia
    }
    if (hora <= 9) {
        hora = '0' + hora
    }
    if (minuto <= 9) {
        minuto = '0' + minuto
    }
    if (segundo <= 9) {
        segundo = '0' + segundo
    }

    return data = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`
}

function encontrarConta (numero_conta) {
    const contaEncontrada = bancodedados.contas.find((conta) => {
        return conta.numero === numero_conta
    })

    return contaEncontrada
}

function encontrarIndiceConta (numero_conta) {
    const indiceContaEncontrada = bancodedados.contas.findIndex((conta) => {
        return conta.numero === numero_conta
    })

    return indiceContaEncontrada
}

function definirProximoNumero () {
    let quantidadeContas = bancodedados.contas.length
    let proximoNumero
    
    if (quantidadeContas === 0) {
        proximoNumero = '1'
    } else {
        proximoNumero = +(bancodedados.contas[ quantidadeContas - 1 ].numero) + 1
        proximoNumero = proximoNumero.toString()
    }

    return proximoNumero
}

const listarContas = (req, res) => {
    return res.status(200).json(bancodedados.contas)
}

const criarConta = (req, res) => {
    const proximoNumero = definirProximoNumero()
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    
    let novaConta = {
        numero: proximoNumero,
        saldo: 0,
        usuario: {
            nome, 
            cpf, 
            data_nascimento, 
            telefone, 
            email, 
            senha
        }
    }
    bancodedados.contas.push(novaConta)

    return res.status(201).json(novaConta)
}

const atualizarUsuario = (req, res) => {
    let { numeroConta } = req.params
    const indiceUsuarioASerAtualizado = encontrarIndiceConta(numeroConta)
    const usuarioASerAtualizado = bancodedados.contas[indiceUsuarioASerAtualizado].usuario
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const usuarioAtualizado = {
        nome: nome ?? usuarioASerAtualizado.nome, 
        cpf: cpf ?? usuarioASerAtualizado.cpf, 
        data_nascimento: data_nascimento ?? usuarioASerAtualizado.data_nascimento, 
        telefone: telefone ?? usuarioASerAtualizado.telefone, 
        email: email ?? usuarioASerAtualizado.email, 
        senha: senha ?? usuarioASerAtualizado.senha
    }
        
    bancodedados.contas[indiceUsuarioASerAtualizado].usuario = usuarioAtualizado
    
    return res.status(201).json({ mensagem: 'Conta atualizada com sucesso.' })
}

const excluirConta = (req, res) => {
    let { numeroConta } = req.params
    const indiceContaASerExcluida = encontrarIndiceConta(numeroConta)

    bancodedados.contas.splice(indiceContaASerExcluida, 1)
    
    return res.status(200).json({ mensagem: 'Conta excluída com sucesso.' })
}

const depositar = (req, res) => {
    const { numero_conta } = req.body
    let { valor } = req.body

    const contaParaDeposito = encontrarConta(numero_conta)
    valor = Number(valor)
    contaParaDeposito.saldo += valor

    const data = gerarData()
    const novoDeposito = {
        data,
        numero_conta,
        valor
    }
        
    bancodedados.depositos.push(novoDeposito)

    return res.status(201).json({ mensagem: 'Depósito realizado com sucesso.' })
}

const sacar = (req, res) => {
    const { numero_conta } = req.body
    let { valor } = req.body

    contaParaSaque = encontrarConta(numero_conta)
    valor = Number(valor)
    contaParaSaque.saldo -= valor
    
    const data = gerarData()
    const novoSaque = {
        data,
        numero_conta,
        valor
    }
    
    bancodedados.saques.push(novoSaque)
    
    return res.status(201).json({ mensagem: 'Saque realizado com sucesso.' })
}


const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino } = req.body
    let { valor } = req.body

    const contaOrigem = encontrarConta(numero_conta_origem)
    const contaDestino = encontrarConta(numero_conta_destino)
    
    valor = Number(valor)
    contaOrigem.saldo -= valor
    contaDestino.saldo += valor

    const data = gerarData()
    const novaTransferencia = {
        data,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
    
    bancodedados.transferencias.push(novaTransferencia)

    return res.status(201).json({ mensagem: 'Transferência realizada com sucesso.'})
}

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query
    const contaBuscada = encontrarConta(numero_conta)
        
    return res.status(200).json({ saldo: contaBuscada.saldo })
}

const gerarExtrato = (req, res) => {
    const { numero_conta } = req.query
    const contaBuscada = encontrarConta(numero_conta)

    const depositos = bancodedados.depositos.filter((deposito) => {
        return deposito.numero_conta === contaBuscada.numero
    })
    const saques = bancodedados.saques.filter((saque) => {
        return saque.numero_conta === contaBuscada.numero
    })
    const transferenciasEnviadas = bancodedados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === contaBuscada.numero
    })
    const transferenciasRecebidas = bancodedados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === contaBuscada.numero
    })

    const extrato = {
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    }

    return res.status(201).json(extrato)
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    gerarExtrato,
    encontrarConta, // a partir daqui
    encontrarIndiceConta
}
